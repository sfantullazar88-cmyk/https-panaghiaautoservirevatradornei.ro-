from fastapi import FastAPI, APIRouter
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List
import uuid
from datetime import datetime, timezone

# Import routes
from routes import menu, orders, restaurant

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Set database for routes
menu.set_db(db)
orders.set_db(db)
restaurant.set_db(db)

# Create the main app without a prefix
app = FastAPI(title="Panaghia API", description="API for Panaghia Autoservire Vatra Dornei", version="1.0.0")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Define Models
class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class StatusCheckCreate(BaseModel):
    client_name: str


# Health check route
@api_router.get("/")
async def root():
    return {"message": "Panaghia API is running", "version": "1.0.0"}


@api_router.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.now(timezone.utc).isoformat()}


@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.model_dump()
    status_obj = StatusCheck(**status_dict)
    
    doc = status_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    
    _ = await db.status_checks.insert_one(doc)
    return status_obj


@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    
    for check in status_checks:
        if isinstance(check['timestamp'], str):
            check['timestamp'] = datetime.fromisoformat(check['timestamp'])
    
    return status_checks


# Include all routers
api_router.include_router(menu.router)
api_router.include_router(orders.router)
api_router.include_router(restaurant.router)

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


@app.on_event("startup")
async def startup_event():
    """Initialize database with default data if empty"""
    logger.info("Starting Panaghia API...")
    
    # Check if categories exist, if not seed the database
    categories_count = await db.menu_categories.count_documents({})
    if categories_count == 0:
        logger.info("Seeding database with initial data...")
        await seed_database()
        logger.info("Database seeded successfully!")


async def seed_database():
    """Seed the database with initial data"""
    
    # Categories
    categories = [
        {"id": "ciorbe", "name": "Ciorbe", "slug": "ciorbe", "icon": "soup", "order": 1, "is_active": True},
        {"id": "feluri-principale", "name": "Feluri Principale", "slug": "feluri-principale", "icon": "main", "order": 2, "is_active": True},
        {"id": "garnituri", "name": "Garnituri", "slug": "garnituri", "icon": "side", "order": 3, "is_active": True},
        {"id": "salate", "name": "Salate", "slug": "salate", "icon": "salad", "order": 4, "is_active": True},
        {"id": "deserturi", "name": "Deserturi", "slug": "deserturi", "icon": "dessert", "order": 5, "is_active": True},
        {"id": "bauturi", "name": "Băuturi", "slug": "bauturi", "icon": "drink", "order": 6, "is_active": True}
    ]
    await db.menu_categories.insert_many(categories)
    
    # Menu items
    now = datetime.now(timezone.utc).isoformat()
    menu_items = [
        # Ciorbe
        {"id": "1", "category_id": "ciorbe", "name": "Ciorbă de burtă", "description": "Ciorbă tradițională românească cu smântână și ardei iute", "price": 18, "image": "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&q=80", "is_popular": True, "is_available": True, "created_at": now, "updated_at": now},
        {"id": "2", "category_id": "ciorbe", "name": "Ciorbă de perișoare", "description": "Ciorbă cu perișoare de carne de porc și legume proaspete", "price": 15, "image": "https://images.unsplash.com/photo-1552590635-27c2c2128abf?w=400&q=80", "is_popular": False, "is_available": True, "created_at": now, "updated_at": now},
        {"id": "3", "category_id": "ciorbe", "name": "Ciorbă de fasole", "description": "Ciorbă de fasole cu afumătură și smântână", "price": 14, "image": "https://images.unsplash.com/photo-1603105037880-880cd4edfb0d?w=400&q=80", "is_popular": False, "is_available": True, "created_at": now, "updated_at": now},
        {"id": "4", "category_id": "ciorbe", "name": "Supă cremă de legume", "description": "Supă cremă de legume de sezon cu crutoane", "price": 12, "image": "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&q=80", "is_popular": False, "is_available": True, "created_at": now, "updated_at": now},
        # Feluri Principale
        {"id": "5", "category_id": "feluri-principale", "name": "Sarmale în foi de viță", "description": "Sarmale tradiționale cu carne tocată, orez și smântână", "price": 28, "image": "https://images.unsplash.com/photo-1544025162-d76694265947?w=400&q=80", "is_popular": True, "is_available": True, "created_at": now, "updated_at": now},
        {"id": "6", "category_id": "feluri-principale", "name": "Mici cu muștar", "description": "Porție de 5 mici la grătar cu muștar și pâine", "price": 22, "image": "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=400&q=80", "is_popular": True, "is_available": True, "created_at": now, "updated_at": now},
        {"id": "7", "category_id": "feluri-principale", "name": "Șnițel de pui", "description": "Șnițel de pui pane cu garnitură la alegere", "price": 25, "image": "https://images.unsplash.com/photo-1432139555190-58524dae6a55?w=400&q=80", "is_popular": False, "is_available": True, "created_at": now, "updated_at": now},
        {"id": "8", "category_id": "feluri-principale", "name": "Tochitura moldovenească", "description": "Tocăniță de porc cu mămăliguță și ou", "price": 32, "image": "https://images.unsplash.com/photo-1613653739328-e86ebd77c9c8?w=400&q=80", "is_popular": True, "is_available": True, "created_at": now, "updated_at": now},
        {"id": "9", "category_id": "feluri-principale", "name": "Pulpă de pui la cuptor", "description": "Pulpă de pui marinată la cuptor cu legume", "price": 24, "image": "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=400&q=80", "is_popular": False, "is_available": True, "created_at": now, "updated_at": now},
        # Garnituri
        {"id": "10", "category_id": "garnituri", "name": "Cartofi prăjiți", "description": "Porție de cartofi prăjiți aurii", "price": 8, "image": "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&q=80", "is_popular": False, "is_available": True, "created_at": now, "updated_at": now},
        {"id": "11", "category_id": "garnituri", "name": "Mămăliguță", "description": "Mămăliguță tradițională cu unt", "price": 6, "image": "https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=400&q=80", "is_popular": False, "is_available": True, "created_at": now, "updated_at": now},
        {"id": "12", "category_id": "garnituri", "name": "Piure de cartofi", "description": "Piure cremos cu unt și lapte", "price": 7, "image": "https://images.unsplash.com/photo-1623689046286-01d812215a5c?w=400&q=80", "is_popular": False, "is_available": True, "created_at": now, "updated_at": now},
        # Salate
        {"id": "13", "category_id": "salate", "name": "Salată de varză", "description": "Salată de varză proaspătă cu morcov și mărar", "price": 8, "image": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80", "is_popular": False, "is_available": True, "created_at": now, "updated_at": now},
        {"id": "14", "category_id": "salate", "name": "Salată de roșii", "description": "Roșii proaspete cu ceapă și ulei de măsline", "price": 10, "image": "https://images.unsplash.com/photo-1607532941433-304659e8198a?w=400&q=80", "is_popular": False, "is_available": True, "created_at": now, "updated_at": now},
        {"id": "15", "category_id": "salate", "name": "Salată mixtă", "description": "Mix de salată verde, roșii, castraveți și ardei", "price": 12, "image": "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&q=80", "is_popular": False, "is_available": True, "created_at": now, "updated_at": now},
        # Deserturi
        {"id": "16", "category_id": "deserturi", "name": "Papanași cu smântână", "description": "Papanași tradiționali cu smântână și dulceață", "price": 18, "image": "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&q=80", "is_popular": True, "is_available": True, "created_at": now, "updated_at": now},
        {"id": "17", "category_id": "deserturi", "name": "Clătite cu Nutella", "description": "Clătite pufoase cu Nutella și banane", "price": 15, "image": "https://images.unsplash.com/photo-1519676867240-f03562e64548?w=400&q=80", "is_popular": False, "is_available": True, "created_at": now, "updated_at": now},
        {"id": "18", "category_id": "deserturi", "name": "Cozonac de casă", "description": "Felie de cozonac tradițional cu nucă", "price": 10, "image": "https://images.unsplash.com/photo-1509365465985-25d11c17e812?w=400&q=80", "is_popular": False, "is_available": True, "created_at": now, "updated_at": now},
        # Băuturi
        {"id": "19", "category_id": "bauturi", "name": "Limonadă de casă", "description": "Limonadă proaspătă cu mentă și ghiață", "price": 8, "image": "https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=400&q=80", "is_popular": False, "is_available": True, "created_at": now, "updated_at": now},
        {"id": "20", "category_id": "bauturi", "name": "Compot de casă", "description": "Compot de fructe de sezon", "price": 6, "image": "https://images.unsplash.com/photo-1534353473418-4cfa6c56fd38?w=400&q=80", "is_popular": False, "is_available": True, "created_at": now, "updated_at": now},
        {"id": "21", "category_id": "bauturi", "name": "Apă plată/minerală", "description": "Sticlă 500ml", "price": 5, "image": "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=400&q=80", "is_popular": False, "is_available": True, "created_at": now, "updated_at": now}
    ]
    await db.menu_items.insert_many(menu_items)
    
    # Daily menu
    daily_menus = [
        {"id": "daily-1", "day": "Luni", "soup": "Ciorbă de perișoare", "main": "Șnițel cu piure", "is_active": True},
        {"id": "daily-2", "day": "Marți", "soup": "Ciorbă de burtă", "main": "Sarmale cu mămăliguță", "is_active": True},
        {"id": "daily-3", "day": "Miercuri", "soup": "Supă de pui", "main": "Pulpă de pui la cuptor", "is_active": True},
        {"id": "daily-4", "day": "Joi", "soup": "Ciorbă de fasole", "main": "Mici cu cartofi prăjiți", "is_active": True},
        {"id": "daily-5", "day": "Vineri", "soup": "Ciorbă de legume", "main": "Tochitura moldovenească", "is_active": True}
    ]
    await db.daily_menu.insert_many(daily_menus)
    
    # Restaurant info
    restaurant_info = {
        "id": "panaghia-info",
        "name": "Panaghia",
        "tagline": "Autoservire Vatra Dornei",
        "phone": "0746 254 162",
        "address": "Str. Dornelor nr. 10, Vatra Dornei",
        "email": "contact@panaghia.ro",
        "rating": 5.0,
        "review_count": 3,
        "schedule": {
            "weekdays": "11:00 - 17:00",
            "weekend": "Închis"
        },
        "hero_title": "Mancare gatita zilnic,",
        "hero_title2": "gustoasa si satioasa",
        "hero_subtitle": "Autoservire & delivery rapid in Vatra Dornei",
        "hero_image": "https://customer-assets.emergentagent.com/job_food-delivery-240/artifacts/25k2bpta_4.jpg"
    }
    await db.restaurant_info.insert_one(restaurant_info)
    
    # Reviews
    reviews = [
        {"id": "review-1", "name": "Alexandru M.", "rating": 5, "text": "Mâncare delicioasă, ca la mama acasă! Recomand cu căldură!", "is_approved": True, "created_at": "2024-01-15T10:00:00+00:00"},
        {"id": "review-2", "name": "Elena D.", "rating": 5, "text": "Cel mai bun loc pentru mâncare tradițională în Vatra Dornei.", "is_approved": True, "created_at": "2024-01-10T14:30:00+00:00"},
        {"id": "review-3", "name": "Mihai P.", "rating": 5, "text": "Ciorba de burtă este fenomenală! Voi reveni cu siguranță.", "is_approved": True, "created_at": "2024-01-05T12:00:00+00:00"}
    ]
    await db.reviews.insert_many(reviews)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
