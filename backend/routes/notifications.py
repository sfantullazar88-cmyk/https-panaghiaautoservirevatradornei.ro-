from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from datetime import datetime, timezone
import os
import requests

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

    if existing:
        await db.push_tokens.update_one(
            {"token": request.token},
            {"$set": {
                "device_name": request.device_name,
                "updated_at": datetime.now(timezone.utc).isoformat()
            }}
        )
    else:
        await db.push_tokens.insert_one({
            "token": request.token,
            "device_name": request.device_name,
            "created_at": datetime.now(timezone.utc).isoformat(),
            "updated_at": datetime.now(timezone.utc).isoformat(),
            "is_active": True
        })

    return {"status": "registered"}


async def send_push_notification(title: str, body: str):
    server_key = os.environ.get("FIREBASE_SERVER_KEY")
    if not server_key:
        print("FIREBASE_SERVER_KEY missing")
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

        response = requests.post(
            "https://fcm.googleapis.com/fcm/send",
            headers={
                "Authorization": f"key={server_key}",
                "Content-Type": "application/json"
            },
            json={
                "to": token,
                "notification": {
                    "title": title,
                    "body": body
                },
                "data": {
                    "click_action": "OPEN_ADMIN"
                }
            }
        )

        if response.status_code == 200:
            success += 1
        else:
            print("Push failed:", response.text)

    return success > 0