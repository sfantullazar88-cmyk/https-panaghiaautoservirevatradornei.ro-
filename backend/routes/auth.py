"""
Authentication module for Panaghia Admin Panel
JWT-based authentication with security features
"""
from datetime import datetime, timedelta, timezone
from typing import Optional
import os
import secrets
import hashlib

from fastapi import APIRouter, HTTPException, Depends, Request, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel, EmailStr, Field
import jwt
from passlib.context import CryptContext

router = APIRouter(prefix="/auth", tags=["Authentication"])

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# JWT Security
security = HTTPBearer()

# Rate limiting store (in production, use Redis)
login_attempts = {}
MAX_LOGIN_ATTEMPTS = 5
LOCKOUT_DURATION = 15  # minutes

# Database reference
db = None

def set_db(database):
    global db
    db = database


# ============== MODELS ==============

class AdminUser(BaseModel):
    id: str
    email: EmailStr
    hashed_password: str
    is_active: bool = True
    is_superadmin: bool = False
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    last_login: Optional[datetime] = None
    failed_login_attempts: int = 0
    locked_until: Optional[datetime] = None


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class LoginResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int
    user: dict


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


# ============== HELPER FUNCTIONS ==============

def get_jwt_secret():
    return os.environ.get('JWT_SECRET_KEY', 'fallback-secret-key')

def get_jwt_algorithm():
    return os.environ.get('JWT_ALGORITHM', 'HS256')

def get_access_token_expire():
    return int(os.environ.get('JWT_ACCESS_TOKEN_EXPIRE_MINUTES', 60))

def get_refresh_token_expire():
    return int(os.environ.get('JWT_REFRESH_TOKEN_EXPIRE_DAYS', 7))


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + (expires_delta or timedelta(minutes=get_access_token_expire()))
    to_encode.update({
        "exp": expire,
        "iat": datetime.now(timezone.utc),
        "type": "access"
    })
    return jwt.encode(to_encode, get_jwt_secret(), algorithm=get_jwt_algorithm())


def create_refresh_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(days=get_refresh_token_expire())
    to_encode.update({
        "exp": expire,
        "iat": datetime.now(timezone.utc),
        "type": "refresh"
    })
    return jwt.encode(to_encode, get_jwt_secret(), algorithm=get_jwt_algorithm())


def decode_token(token: str) -> dict:
    try:
        payload = jwt.decode(token, get_jwt_secret(), algorithms=[get_jwt_algorithm()])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expirat")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Token invalid")


def generate_reset_token() -> str:
    return secrets.token_urlsafe(32)


def hash_reset_token(token: str) -> str:
    return hashlib.sha256(token.encode()).hexdigest()


# ============== RATE LIMITING ==============

def check_rate_limit(email: str) -> bool:
    """Check if user is rate limited"""
    if email in login_attempts:
        attempts, locked_until = login_attempts[email]
        if locked_until and datetime.now(timezone.utc) < locked_until:
            return False
        if locked_until and datetime.now(timezone.utc) >= locked_until:
            # Reset after lockout
            login_attempts[email] = (0, None)
    return True


def record_failed_attempt(email: str):
    """Record a failed login attempt"""
    if email in login_attempts:
        attempts, _ = login_attempts[email]
        attempts += 1
    else:
        attempts = 1
    
    locked_until = None
    if attempts >= MAX_LOGIN_ATTEMPTS:
        locked_until = datetime.now(timezone.utc) + timedelta(minutes=LOCKOUT_DURATION)
    
    login_attempts[email] = (attempts, locked_until)


def reset_attempts(email: str):
    """Reset login attempts on successful login"""
    if email in login_attempts:
        del login_attempts[email]


# ============== DEPENDENCIES ==============

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Verify JWT token and return current user"""
    token = credentials.credentials
    payload = decode_token(token)
    
    if payload.get("type") != "access":
        raise HTTPException(status_code=401, detail="Token invalid")
    
    email = payload.get("sub")
    if not email:
        raise HTTPException(status_code=401, detail="Token invalid")
    
    user = await db.admin_users.find_one({"email": email}, {"_id": 0, "hashed_password": 0})
    if not user:
        raise HTTPException(status_code=401, detail="Utilizator negăsit")
    
    if not user.get("is_active", True):
        raise HTTPException(status_code=401, detail="Cont dezactivat")
    
    return user


async def get_current_admin(current_user: dict = Depends(get_current_user)):
    """Ensure user is an admin"""
    return current_user


# ============== ROUTES ==============

@router.post("/login", response_model=LoginResponse)
async def login(request: LoginRequest):
    """Admin login endpoint"""
    email = request.email.lower()
    
    # Check rate limiting
    if not check_rate_limit(email):
        remaining = login_attempts.get(email, (0, None))[1]
        if remaining:
            minutes_left = int((remaining - datetime.now(timezone.utc)).total_seconds() / 60) + 1
            raise HTTPException(
                status_code=429,
                detail=f"Prea multe încercări. Încercați din nou în {minutes_left} minute."
            )
    
    # Find user
    user = await db.admin_users.find_one({"email": email})
    if not user:
        record_failed_attempt(email)
        raise HTTPException(status_code=401, detail="Email sau parolă incorectă")
    
    # Check if account is locked
    if user.get("locked_until") and datetime.fromisoformat(user["locked_until"]) > datetime.now(timezone.utc):
        raise HTTPException(status_code=423, detail="Contul este blocat temporar")
    
    # Verify password
    if not verify_password(request.password, user["hashed_password"]):
        record_failed_attempt(email)
        
        # Update failed attempts in DB
        await db.admin_users.update_one(
            {"email": email},
            {"$inc": {"failed_login_attempts": 1}}
        )
        
        raise HTTPException(status_code=401, detail="Email sau parolă incorectă")
    
    # Reset attempts on success
    reset_attempts(email)
    
    # Update last login
    await db.admin_users.update_one(
        {"email": email},
        {
            "$set": {
                "last_login": datetime.now(timezone.utc).isoformat(),
                "failed_login_attempts": 0,
                "locked_until": None
            }
        }
    )
    
    # Create tokens
    token_data = {"sub": email, "user_id": user["id"]}
    access_token = create_access_token(token_data)
    refresh_token = create_refresh_token(token_data)
    
    return LoginResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        expires_in=get_access_token_expire() * 60,
        user={
            "id": user["id"],
            "email": user["email"],
            "is_superadmin": user.get("is_superadmin", False)
        }
    )


@router.post("/refresh", response_model=LoginResponse)
async def refresh_token(request: TokenRefreshRequest):
    """Refresh access token"""
    payload = decode_token(request.refresh_token)
    
    if payload.get("type") != "refresh":
        raise HTTPException(status_code=401, detail="Token invalid")
    
    email = payload.get("sub")
    user = await db.admin_users.find_one({"email": email})
    
    if not user or not user.get("is_active", True):
        raise HTTPException(status_code=401, detail="Utilizator invalid")
    
    # Create new tokens
    token_data = {"sub": email, "user_id": user["id"]}
    access_token = create_access_token(token_data)
    new_refresh_token = create_refresh_token(token_data)
    
    return LoginResponse(
        access_token=access_token,
        refresh_token=new_refresh_token,
        expires_in=get_access_token_expire() * 60,
        user={
            "id": user["id"],
            "email": user["email"],
            "is_superadmin": user.get("is_superadmin", False)
        }
    )


@router.post("/password-reset/request")
async def request_password_reset(request: PasswordResetRequest):
    """Request password reset - sends token"""
    email = request.email.lower()
    user = await db.admin_users.find_one({"email": email})
    
    # Always return success to prevent email enumeration
    if not user:
        return {"message": "Dacă emailul există, veți primi instrucțiuni de resetare"}
    
    # Generate reset token
    reset_token = generate_reset_token()
    hashed_token = hash_reset_token(reset_token)
    
    # Store in DB (expires in 1 hour)
    await db.password_reset_tokens.insert_one({
        "email": email,
        "token_hash": hashed_token,
        "created_at": datetime.now(timezone.utc).isoformat(),
        "expires_at": (datetime.now(timezone.utc) + timedelta(hours=1)).isoformat(),
        "used": False
    })
    
    # In production, send email here
    # For now, log the token (remove in production!)
    print(f"[PASSWORD RESET] Token for {email}: {reset_token}")
    
    return {
        "message": "Dacă emailul există, veți primi instrucțiuni de resetare",
        "debug_token": reset_token  # Remove in production!
    }


@router.post("/password-reset/confirm")
async def confirm_password_reset(request: PasswordResetConfirm):
    """Confirm password reset with token"""
    hashed_token = hash_reset_token(request.token)
    
    # Find valid token
    token_doc = await db.password_reset_tokens.find_one({
        "token_hash": hashed_token,
        "used": False
    })
    
    if not token_doc:
        raise HTTPException(status_code=400, detail="Token invalid sau expirat")
    
    # Check expiration
    expires_at = datetime.fromisoformat(token_doc["expires_at"])
    if datetime.now(timezone.utc) > expires_at:
        raise HTTPException(status_code=400, detail="Token expirat")
    
    # Validate password strength
    if len(request.new_password) < 8:
        raise HTTPException(status_code=400, detail="Parola trebuie să aibă minim 8 caractere")
    
    # Update password
    new_hash = hash_password(request.new_password)
    await db.admin_users.update_one(
        {"email": token_doc["email"]},
        {"$set": {"hashed_password": new_hash}}
    )
    
    # Mark token as used
    await db.password_reset_tokens.update_one(
        {"_id": token_doc["_id"]},
        {"$set": {"used": True}}
    )
    
    return {"message": "Parola a fost resetată cu succes"}


@router.post("/change-password")
async def change_password(
    request: ChangePasswordRequest,
    current_user: dict = Depends(get_current_admin)
):
    """Change password for logged in user"""
    user = await db.admin_users.find_one({"email": current_user["email"]})
    
    # Verify current password
    if not verify_password(request.current_password, user["hashed_password"]):
        raise HTTPException(status_code=400, detail="Parola actuală incorectă")
    
    # Validate new password
    if len(request.new_password) < 8:
        raise HTTPException(status_code=400, detail="Parola nouă trebuie să aibă minim 8 caractere")
    
    # Update password
    new_hash = hash_password(request.new_password)
    await db.admin_users.update_one(
        {"email": current_user["email"]},
        {"$set": {"hashed_password": new_hash}}
    )
    
    return {"message": "Parola a fost schimbată cu succes"}


@router.get("/me")
async def get_current_user_info(current_user: dict = Depends(get_current_admin)):
    """Get current user info"""
    return current_user


@router.post("/logout")
async def logout(current_user: dict = Depends(get_current_admin)):
    """Logout - client should discard tokens"""
    # In a more advanced setup, you'd invalidate the token
    return {"message": "Deconectat cu succes"}
