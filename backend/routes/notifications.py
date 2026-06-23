from fastapi import APIRouter
from pydantic import BaseModel
from datetime import datetime, timezone
import os
import json
import firebase_admin
from firebase_admin import credentials, messaging

router = APIRouter(prefix="/notifications", tags=["Notifications"])

db = None

def set_db(database):
    global db
    db = database


class TokenRequest(BaseModel):
    token: str
    device_name: str = "Telefon"


@router.post("/register-token")
async def register_token(request: TokenRequest):
    existing = await db.push_tokens.find_one({"token": request.token})

    data = {
        "token": request.token,
        "device_name": request.device_name,
        "updated_at": datetime.now(timezone.utc).isoformat(),
        "is_active": True
    }

    if existing:
        await db.push_tokens.update_one({"token": request.token}, {"$set": data})
    else:
        data["created_at"] = datetime.now(timezone.utc).isoformat()
        await db.push_tokens.insert_one(data)

    return {"status": "registered"}


def init_firebase():
    if firebase_admin._apps:
        return

    service_account_json = os.environ.get("FIREBASE_SERVICE_ACCOUNT_JSON")
    if not service_account_json:
        print("FIREBASE_SERVICE_ACCOUNT_JSON missing")
        return

    service_account = json.loads(service_account_json)
    cred = credentials.Certificate(service_account)
    firebase_admin.initialize_app(cred)


async def send_push_notification(title: str, body: str):
    init_firebase()

    if not firebase_admin._apps:
        print("Firebase Admin not initialized")
        return False

    tokens = await db.push_tokens.find({"is_active": True}).to_list(1000)

    if not tokens:
        print("No push tokens registered")
        return False

    success = 0

    for item in tokens:
        token = item.get("token")
        if not token:
            continue

        message = messaging.Message(
            notification=messaging.Notification(
                title=title,
                body=body
            ),
            token=token,
            webpush=messaging.WebpushConfig(
                fcm_options=messaging.WebpushFCMOptions(
                    link="https://www.panaghiaautoservirevatradornei.ro/admin/orders"
                )
            )
        )

        try:
            messaging.send(message)
            success += 1
        except Exception as e:
            print(f"Push failed for token {token}: {e}")

    return success > 0