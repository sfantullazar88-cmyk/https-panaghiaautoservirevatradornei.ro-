import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from passlib.context import CryptContext
import uuid

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

MONGO_URL = "mongodb://localhost:27017"
DATABASE_NAME = "panaghia"

async def create_admin():
    client = AsyncIOMotorClient(MONGO_URL)
    db = client[DATABASE_NAME]

    email = "admin@panaghia.ro"
    password = "admin123"

    existing = await db.admin_users.find_one({"email": email})

    if existing:
        print("Admin există deja!")
        return

    hashed_password = pwd_context.hash(password)

    admin = {
        "id": str(uuid.uuid4()),
        "email": email,
        "hashed_password": hashed_password,
        "is_active": True,
        "is_superadmin": True,
    }

    await db.admin_users.insert_one(admin)

    print("ADMIN CREAT!")
    print("Email:", email)
    print("Parola:", password)

asyncio.run(create_admin())