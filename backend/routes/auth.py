"""
Authentication module for Panaghia Admin Panel.
Include:
- autentificare cu email și parolă;
- autentificare OTP;
- tokenuri JWT;
- recuperarea parolei;
- schimbarea parolei;
- protecție împotriva încercărilor repetate.
"""

import asyncio
import hashlib
import logging
import os
import secrets
from datetime import datetime, timedelta, timezone
from typing import Optional

import jwt
import requests
from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    Request,
)
from fastapi.security import (
    HTTPAuthorizationCredentials,
    HTTPBearer,
)
from passlib.context import CryptContext
from pydantic import BaseModel, EmailStr, Field

from rate_limit import limiter


router = APIRouter(
    prefix="/auth",
    tags=["Authentication"],
)

logger = logging.getLogger(__name__)


# ============================================================
# CONFIGURARE
# ============================================================

pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto",
)

security = HTTPBearer()

db = None

login_attempts = {}

MAX_LOGIN_ATTEMPTS = 5
LOCKOUT_DURATION_MINUTES = 15
OTP_EXPIRE_MINUTES = 10
RESET_TOKEN_EXPIRE_MINUTES = 15


def set_db(database):
    """Primește conexiunea MongoDB din server.py."""
    global db
    db = database


# ============================================================
# MODELE
# ============================================================

class AdminUser(BaseModel):
    id: str
    email: EmailStr
    hashed_password: str
    is_active: bool = True
    is_superadmin: bool = False

    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc)
    )

    last_login: Optional[datetime] = None
    failed_login_attempts: int = 0
    locked_until: Optional[datetime] = None


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class OTPVerifyRequest(BaseModel):
    email: EmailStr
    code: str


class LoginResponse(BaseModel):
    access_token: Optional[str] = None
    refresh_token: Optional[str] = None
    token_type: str = "bearer"
    expires_in: Optional[int] = None
    user: Optional[dict] = None
    otp_required: bool = False
    message: Optional[str] = None


class TokenRefreshRequest(BaseModel):
    refresh_token: str


class PasswordResetRequest(BaseModel):
    email: EmailStr


class PasswordResetConfirm(BaseModel):
    token: str
    new_password: str


class ChangePasswordRequest(BaseModel):
    current_password: str
    new_password: str


# ============================================================
# FUNCȚII AJUTĂTOARE
# ============================================================

def normalize_email(email: str) -> str:
    return email.strip().lower()


def get_jwt_secret() -> str:
    secret = os.environ.get("JWT_SECRET_KEY")

    if not secret:
        raise RuntimeError(
            "JWT_SECRET_KEY nu este configurată."
        )

    return secret


def get_jwt_algorithm() -> str:
    return os.environ.get(
        "JWT_ALGORITHM",
        "HS256",
    )


def get_access_token_expire() -> int:
    return int(
        os.environ.get(
            "JWT_ACCESS_TOKEN_EXPIRE_MINUTES",
            "60",
        )
    )


def get_refresh_token_expire() -> int:
    return int(
        os.environ.get(
            "JWT_REFRESH_TOKEN_EXPIRE_DAYS",
            "7",
        )
    )


def otp_enabled() -> bool:
    return (
        os.environ.get("OTP_ENABLED", "false")
        .strip()
        .lower()
        == "true"
    )


def verify_password(
    plain_password: str,
    hashed_password: str,
) -> bool:
    try:
        return pwd_context.verify(
            plain_password,
            hashed_password,
        )
    except Exception:
        logger.exception(
            "Eroare la verificarea parolei."
        )
        return False


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def hash_secret(value: str) -> str:
    return hashlib.sha256(
        value.encode("utf-8")
    ).hexdigest()


def generate_otp() -> str:
    """Generează un cod OTP format din 6 cifre."""
    return f"{secrets.randbelow(1_000_000):06d}"


def generate_reset_token() -> str:
    """
    Generează un cod de resetare format din 8 cifre,
    mai ușor de introdus de către utilizator.
    """
    return f"{secrets.randbelow(100_000_000):08d}"


def hash_reset_token(token: str) -> str:
    return hash_secret(token.strip())


def parse_datetime(value) -> Optional[datetime]:
    """
    Transformă în datetime valorile salvate în MongoDB,
    inclusiv textele ISO.
    """
    if value is None:
        return None

    if isinstance(value, datetime):
        result = value
    elif isinstance(value, str):
        try:
            result = datetime.fromisoformat(
                value.replace("Z", "+00:00")
            )
        except ValueError:
            return None
    else:
        return None

    if result.tzinfo is None:
        result = result.replace(
            tzinfo=timezone.utc
        )

    return result


def get_user_id(user: dict) -> str:
    """
    Returnează ID-ul utilizatorului indiferent dacă
    este păstrat în câmpul id sau în _id.
    """
    if user.get("id"):
        return str(user["id"])

    if user.get("_id") is not None:
        return str(user["_id"])

    raise HTTPException(
        status_code=500,
        detail="Utilizatorul nu are un identificator valid.",
    )


def create_access_token(
    data: dict,
    expires_delta: Optional[timedelta] = None,
) -> str:
    to_encode = data.copy()

    expire = datetime.now(timezone.utc) + (
        expires_delta
        or timedelta(
            minutes=get_access_token_expire()
        )
    )

    to_encode.update({
        "exp": expire,
        "iat": datetime.now(timezone.utc),
        "type": "access",
    })

    return jwt.encode(
        to_encode,
        get_jwt_secret(),
        algorithm=get_jwt_algorithm(),
    )


def create_refresh_token(data: dict) -> str:
    to_encode = data.copy()

    expire = (
        datetime.now(timezone.utc)
        + timedelta(
            days=get_refresh_token_expire()
        )
    )

    to_encode.update({
        "exp": expire,
        "iat": datetime.now(timezone.utc),
        "type": "refresh",
    })

    return jwt.encode(
        to_encode,
        get_jwt_secret(),
        algorithm=get_jwt_algorithm(),
    )


def decode_token(token: str) -> dict:
    try:
        return jwt.decode(
            token,
            get_jwt_secret(),
            algorithms=[get_jwt_algorithm()],
        )

    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=401,
            detail="Token expirat.",
        )

    except jwt.InvalidTokenError:
        raise HTTPException(
            status_code=401,
            detail="Token invalid.",
        )


def build_login_response(
    user: dict,
) -> LoginResponse:
    email = normalize_email(user["email"])
    user_id = get_user_id(user)

    token_data = {
        "sub": email,
        "user_id": user_id,
    }

    access_token = create_access_token(
        token_data
    )

    refresh_token = create_refresh_token(
        token_data
    )

    return LoginResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        expires_in=(
            get_access_token_expire() * 60
        ),
        user={
            "id": user_id,
            "email": email,
            "is_superadmin": user.get(
                "is_superadmin",
                False,
            ),
        },
    )


# ============================================================
# EMAIL PRIN RESEND
# ============================================================

def get_resend_configuration():
    api_key = os.environ.get(
        "RESEND_API_KEY",
        "",
    ).strip()

    from_email = os.environ.get(
        "OTP_FROM_EMAIL",
        (
            "comenzi@"
            "panaghiaautoservirevatradornei.ro"
        ),
    ).strip()

    if not api_key:
        raise RuntimeError(
            "RESEND_API_KEY nu este configurată."
        )

    if not from_email:
        raise RuntimeError(
            "OTP_FROM_EMAIL nu este configurată."
        )

    return api_key, from_email


def send_resend_email_sync(
    destination_email: str,
    subject: str,
    html_content: str,
):
    """
    Trimite efectiv mesajul prin Resend.
    Funcția este sincronă și va fi rulată într-un thread.
    """
    api_key, from_email = (
        get_resend_configuration()
    )

    response = requests.post(
        "https://api.resend.com/emails",
        headers={
            "Authorization": (
                f"Bearer {api_key}"
            ),
            "Content-Type": (
                "application/json"
            ),
        },
        json={
            "from": (
                "Panaghia Autoservire "
                f"<{from_email}>"
            ),
            "to": [destination_email],
            "subject": subject,
            "html": html_content,
        },
        timeout=15,
    )

    if not response.ok:
        raise RuntimeError(
            "Eroare Resend: "
            f"{response.status_code} - "
            f"{response.text}"
        )

    return response.json()


async def send_otp_email(
    email: str,
    otp_code: str,
):
    """Trimite codul OTP pentru autentificare."""

    html_content = (
        "<div style='font-family:Arial,sans-serif;'>"
        "<h2>Cod de autentificare Panaghia</h2>"
        "<p>Codul tău de conectare este:</p>"
        "<p style='font-size:30px;"
        "font-weight:bold;"
        "letter-spacing:5px;'>"
        f"{otp_code}"
        "</p>"
        "<p>Codul este valabil 10 minute.</p>"
        "<p>Dacă nu ai încercat să te autentifici, "
        "poți ignora acest mesaj.</p>"
        "</div>"
    )

    await asyncio.to_thread(
        send_resend_email_sync,
        email,
        "Cod conectare Panaghia Admin",
        html_content,
    )


async def send_password_reset_email(
    email: str,
    reset_token: str,
):
    """Trimite codul pentru resetarea parolei."""

    html_content = (
        "<div style='font-family:Arial,sans-serif;'>"
        "<h2>Resetarea parolei Panaghia</h2>"
        "<p>Ai solicitat resetarea parolei "
        "pentru panoul de administrare.</p>"
        "<p>Codul tău de resetare este:</p>"
        "<p style='font-size:30px;"
        "font-weight:bold;"
        "letter-spacing:5px;'>"
        f"{reset_token}"
        "</p>"
        "<p>Codul este valabil 15 minute și "
        "poate fi folosit o singură dată.</p>"
        "<p>Dacă nu ai solicitat resetarea, "
        "poți ignora acest mesaj.</p>"
        "</div>"
    )

    await asyncio.to_thread(
        send_resend_email_sync,
        email,
        "Resetarea parolei Panaghia Admin",
        html_content,
    )


# ============================================================
# PROTECȚIE ÎMPOTRIVA ÎNCERCĂRILOR REPETATE
# ============================================================

def check_rate_limit(email: str) -> bool:
    if email not in login_attempts:
        return True

    attempts, locked_until = (
        login_attempts[email]
    )

    if (
        locked_until
        and datetime.now(timezone.utc)
        < locked_until
    ):
        return False

    if (
        locked_until
        and datetime.now(timezone.utc)
        >= locked_until
    ):
        login_attempts[email] = (
            0,
            None,
        )

    return True


def record_failed_attempt(email: str):
    if email in login_attempts:
        attempts, _ = login_attempts[email]
        attempts += 1
    else:
        attempts = 1

    locked_until = None

    if attempts >= MAX_LOGIN_ATTEMPTS:
        locked_until = (
            datetime.now(timezone.utc)
            + timedelta(
                minutes=(
                    LOCKOUT_DURATION_MINUTES
                )
            )
        )

    login_attempts[email] = (
        attempts,
        locked_until,
    )


def reset_attempts(email: str):
    login_attempts.pop(
        email,
        None,
    )


# ============================================================
# DEPENDENȚE PENTRU RUTELE PROTEJATE
# ============================================================

async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(
        security
    ),
):
    token = credentials.credentials
    payload = decode_token(token)

    if payload.get("type") != "access":
        raise HTTPException(
            status_code=401,
            detail="Token invalid.",
        )

    email = payload.get("sub")

    if not email:
        raise HTTPException(
            status_code=401,
            detail="Token invalid.",
        )

    user = await db.admin_users.find_one(
        {
            "email": normalize_email(email),
        },
        {
            "_id": 0,
            "hashed_password": 0,
        },
    )

    if not user:
        raise HTTPException(
            status_code=401,
            detail="Utilizator negăsit.",
        )

    if not user.get("is_active", True):
        raise HTTPException(
            status_code=401,
            detail="Cont dezactivat.",
        )

    return user


async def get_current_admin(
    current_user: dict = Depends(
        get_current_user
    ),
):
    return current_user


# ============================================================
# AUTENTIFICARE
# ============================================================

@router.post(
    "/login",
    response_model=LoginResponse,
)
@limiter.limit("5/minute")
async def login(
    request: Request,
    login_data: LoginRequest,
):
    email = normalize_email(
        login_data.email
    )

    if not check_rate_limit(email):
        locked_until = login_attempts.get(
            email,
            (0, None),
        )[1]

        minutes_left = 1

        if locked_until:
            seconds_left = (
                locked_until
                - datetime.now(timezone.utc)
            ).total_seconds()

            minutes_left = max(
                1,
                int(seconds_left / 60) + 1,
            )

        raise HTTPException(
            status_code=429,
            detail=(
                "Prea multe încercări. "
                f"Încercați din nou în "
                f"{minutes_left} minute."
            ),
        )

    user = await db.admin_users.find_one({
        "email": email,
    })

    if not user:
        record_failed_attempt(email)

        raise HTTPException(
            status_code=401,
            detail=(
                "Email sau parolă incorectă."
            ),
        )

    if not user.get("is_active", True):
        raise HTTPException(
            status_code=403,
            detail="Cont dezactivat.",
        )

    locked_until = parse_datetime(
        user.get("locked_until")
    )

    if (
        locked_until
        and locked_until
        > datetime.now(timezone.utc)
    ):
        raise HTTPException(
            status_code=423,
            detail=(
                "Contul este blocat temporar."
            ),
        )

    if not verify_password(
        login_data.password,
        user.get("hashed_password", ""),
    ):
        record_failed_attempt(email)

        await db.admin_users.update_one(
            {
                "email": email,
            },
            {
                "$inc": {
                    "failed_login_attempts": 1,
                }
            },
        )

        raise HTTPException(
            status_code=401,
            detail=(
                "Email sau parolă incorectă."
            ),
        )

    reset_attempts(email)

    await db.admin_users.update_one(
        {
            "email": email,
        },
        {
            "$set": {
                "failed_login_attempts": 0,
                "locked_until": None,
            }
        },
    )

    if otp_enabled():
        otp_code = generate_otp()
        otp_hash = hash_secret(otp_code)
        now = datetime.now(timezone.utc)

        await db.otp_codes.update_many(
            {
                "email": email,
                "used": False,
            },
            {
                "$set": {
                    "used": True,
                }
            },
        )

        await db.otp_codes.insert_one({
            "email": email,
            "code_hash": otp_hash,
            "created_at": now.isoformat(),
            "expires_at": (
                now
                + timedelta(
                    minutes=OTP_EXPIRE_MINUTES
                )
            ).isoformat(),
            "used": False,
        })

        try:
            # Codul se trimite către emailul
            # utilizatorului autentificat.
            await send_otp_email(
                email,
                otp_code,
            )

        except Exception as exc:
            logger.exception(
                "Trimiterea codului OTP a eșuat."
            )

            await db.otp_codes.update_many(
                {
                    "email": email,
                    "used": False,
                },
                {
                    "$set": {
                        "used": True,
                    }
                },
            )

            raise HTTPException(
                status_code=500,
                detail=(
                    "Codul OTP nu a putut fi "
                    "trimis. Încercați din nou."
                ),
            ) from exc

        return LoginResponse(
            otp_required=True,
            message=(
                "Codul OTP a fost trimis "
                "pe adresa de email."
            ),
        )

    await db.admin_users.update_one(
        {
            "email": email,
        },
        {
            "$set": {
                "last_login": (
                    datetime.now(timezone.utc)
                    .isoformat()
                ),
            }
        },
    )

    return build_login_response(user)


@router.post(
    "/verify-otp",
    response_model=LoginResponse,
)
@limiter.limit("5/minute")
async def verify_otp(
    request: Request,
    otp_data: OTPVerifyRequest,
):
    email = normalize_email(
        otp_data.email
    )

    code = otp_data.code.strip()

    if not code:
        raise HTTPException(
            status_code=400,
            detail="Introduceți codul OTP.",
        )

    code_hash = hash_secret(code)

    otp_doc = await db.otp_codes.find_one({
        "email": email,
        "code_hash": code_hash,
        "used": False,
    })

    # Compatibilitate cu eventualele coduri vechi
    # salvate în clar în baza de date.
    if not otp_doc:
        otp_doc = await db.otp_codes.find_one({
            "email": email,
            "code": code,
            "used": False,
        })

    if not otp_doc:
        raise HTTPException(
            status_code=400,
            detail="Cod OTP invalid.",
        )

    expires_at = parse_datetime(
        otp_doc.get("expires_at")
    )

    if (
        not expires_at
        or datetime.now(timezone.utc)
        > expires_at
    ):
        await db.otp_codes.update_one(
            {
                "_id": otp_doc["_id"],
            },
            {
                "$set": {
                    "used": True,
                }
            },
        )

        raise HTTPException(
            status_code=400,
            detail="Cod OTP expirat.",
        )

    user = await db.admin_users.find_one({
        "email": email,
        "is_active": {
            "$ne": False,
        },
    })

    if not user:
        raise HTTPException(
            status_code=404,
            detail="Utilizator negăsit.",
        )

    await db.otp_codes.update_one(
        {
            "_id": otp_doc["_id"],
        },
        {
            "$set": {
                "used": True,
            }
        },
    )

    await db.admin_users.update_one(
        {
            "email": email,
        },
        {
            "$set": {
                "last_login": (
                    datetime.now(timezone.utc)
                    .isoformat()
                ),
            }
        },
    )

    return build_login_response(user)


# ============================================================
# REFRESH TOKEN
# ============================================================

@router.post(
    "/refresh",
    response_model=LoginResponse,
)
async def refresh_token(
    refresh_data: TokenRefreshRequest,
):
    payload = decode_token(
        refresh_data.refresh_token
    )

    if payload.get("type") != "refresh":
        raise HTTPException(
            status_code=401,
            detail="Token invalid.",
        )

    email = normalize_email(
        payload.get("sub", "")
    )

    if not email:
        raise HTTPException(
            status_code=401,
            detail="Token invalid.",
        )

    user = await db.admin_users.find_one({
        "email": email,
        "is_active": {
            "$ne": False,
        },
    })

    if not user:
        raise HTTPException(
            status_code=401,
            detail="Utilizator invalid.",
        )

    return build_login_response(user)


# ============================================================
# RESETAREA PAROLEI
# ============================================================

@router.post("/password-reset/request")
@limiter.limit("3/hour")
async def request_password_reset(
    request: Request,
    reset_data: PasswordResetRequest,
):
    email = normalize_email(
        reset_data.email
    )

    generic_response = {
        "message": (
            "Dacă emailul există, veți primi "
            "instrucțiuni pentru resetarea parolei."
        )
    }

    user = await db.admin_users.find_one({
        "email": email,
        "is_active": {
            "$ne": False,
        },
    })

    # Nu dezvăluim dacă adresa există.
    if not user:
        return generic_response

    await db.password_reset_tokens.update_many(
        {
            "email": email,
            "used": False,
        },
        {
            "$set": {
                "used": True,
            }
        },
    )

    reset_token = generate_reset_token()
    hashed_token = hash_reset_token(
        reset_token
    )

    now = datetime.now(timezone.utc)

    await db.password_reset_tokens.insert_one({
        "email": email,
        "token_hash": hashed_token,
        "created_at": now.isoformat(),
        "expires_at": (
            now
            + timedelta(
                minutes=(
                    RESET_TOKEN_EXPIRE_MINUTES
                )
            )
        ).isoformat(),
        "used": False,
    })

    try:
        await send_password_reset_email(
            email,
            reset_token,
        )

    except Exception as exc:
        logger.exception(
            "Trimiterea emailului de resetare "
            "a eșuat."
        )

        await db.password_reset_tokens.update_one(
            {
                "token_hash": hashed_token,
            },
            {
                "$set": {
                    "used": True,
                }
            },
        )

        raise HTTPException(
            status_code=500,
            detail=(
                "Emailul de resetare nu a putut "
                "fi trimis. Încercați din nou."
            ),
        ) from exc

    return generic_response


@router.post("/password-reset/confirm")
@limiter.limit("5/hour")
async def confirm_password_reset(
    request: Request,
    reset_data: PasswordResetConfirm,
):
    token = reset_data.token.strip()
    new_password = reset_data.new_password

    if not token:
        raise HTTPException(
            status_code=400,
            detail=(
                "Introduceți codul de resetare."
            ),
        )

    if len(new_password) < 8:
        raise HTTPException(
            status_code=400,
            detail=(
                "Parola trebuie să aibă "
                "minimum 8 caractere."
            ),
        )

    hashed_token = hash_reset_token(token)

    token_doc = (
        await db.password_reset_tokens.find_one({
            "token_hash": hashed_token,
            "used": False,
        })
    )

    if not token_doc:
        raise HTTPException(
            status_code=400,
            detail=(
                "Codul de resetare este invalid "
                "sau a fost deja folosit."
            ),
        )

    expires_at = parse_datetime(
        token_doc.get("expires_at")
    )

    if (
        not expires_at
        or datetime.now(timezone.utc)
        > expires_at
    ):
        await db.password_reset_tokens.update_one(
            {
                "_id": token_doc["_id"],
            },
            {
                "$set": {
                    "used": True,
                }
            },
        )

        raise HTTPException(
            status_code=400,
            detail=(
                "Codul de resetare a expirat."
            ),
        )

    email = normalize_email(
        token_doc["email"]
    )

    user = await db.admin_users.find_one({
        "email": email,
        "is_active": {
            "$ne": False,
        },
    })

    if not user:
        raise HTTPException(
            status_code=400,
            detail="Utilizatorul nu mai există.",
        )

    new_hash = hash_password(
        new_password
    )

    now = datetime.now(timezone.utc)

    password_result = (
        await db.admin_users.update_one(
            {
                "email": email,
            },
            {
                "$set": {
                    "hashed_password": new_hash,
                    "password_changed_at": (
                        now.isoformat()
                    ),
                    "failed_login_attempts": 0,
                    "locked_until": None,
                }
            },
        )
    )

    if password_result.modified_count != 1:
        raise HTTPException(
            status_code=500,
            detail=(
                "Parola nu a putut fi actualizată."
            ),
        )

    await db.password_reset_tokens.update_many(
        {
            "email": email,
        },
        {
            "$set": {
                "used": True,
            }
        },
    )

    reset_attempts(email)

    return {
        "message": (
            "Parola a fost resetată cu succes. "
            "Vă puteți autentifica folosind "
            "parola nouă."
        )
    }


# ============================================================
# SCHIMBAREA PAROLEI DIN CONT
# ============================================================

@router.post("/change-password")
async def change_password(
    change_data: ChangePasswordRequest,
    current_user: dict = Depends(
        get_current_admin
    ),
):
    email = normalize_email(
        current_user["email"]
    )

    user = await db.admin_users.find_one({
        "email": email,
    })

    if not user:
        raise HTTPException(
            status_code=404,
            detail="Utilizator negăsit.",
        )

    if not verify_password(
        change_data.current_password,
        user.get("hashed_password", ""),
    ):
        raise HTTPException(
            status_code=400,
            detail="Parola actuală este incorectă.",
        )

    if len(change_data.new_password) < 8:
        raise HTTPException(
            status_code=400,
            detail=(
                "Parola nouă trebuie să aibă "
                "minimum 8 caractere."
            ),
        )

    if (
        change_data.current_password
        == change_data.new_password
    ):
        raise HTTPException(
            status_code=400,
            detail=(
                "Parola nouă trebuie să fie "
                "diferită de parola actuală."
            ),
        )

    new_hash = hash_password(
        change_data.new_password
    )

    await db.admin_users.update_one(
        {
            "email": email,
        },
        {
            "$set": {
                "hashed_password": new_hash,
                "password_changed_at": (
                    datetime.now(timezone.utc)
                    .isoformat()
                ),
            }
        },
    )

    return {
        "message": (
            "Parola a fost schimbată cu succes."
        )
    }


# ============================================================
# UTILIZATOR CURENT ȘI LOGOUT
# ============================================================

@router.get("/me")
async def get_current_user_info(
    current_user: dict = Depends(
        get_current_admin
    ),
):
    return current_user


@router.post("/logout")
async def logout(
    current_user: dict = Depends(
        get_current_admin
    ),
):
    return {
        "message": "Deconectat cu succes."
    }