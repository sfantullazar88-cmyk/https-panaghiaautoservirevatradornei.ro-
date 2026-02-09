from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
from datetime import datetime, timezone
import uuid


# ============== MENU MODELS ==============

class MenuCategory(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    slug: str
    icon: str = "default"
    order: int = 0
    is_active: bool = True


class MenuCategoryCreate(BaseModel):
    name: str
    slug: str
    icon: str = "default"
    order: int = 0
    is_active: bool = True


class MenuItem(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    category_id: str
    name: str
    description: str
    price: float
    image: str
    is_popular: bool = False
    is_available: bool = True
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class MenuItemCreate(BaseModel):
    category_id: str
    name: str
    description: str
    price: float
    image: str
    is_popular: bool = False
    is_available: bool = True


class MenuItemUpdate(BaseModel):
    category_id: Optional[str] = None
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    image: Optional[str] = None
    is_popular: Optional[bool] = None
    is_available: Optional[bool] = None


# ============== ORDER MODELS ==============

class OrderItem(BaseModel):
    menu_item_id: str
    name: str
    price: float
    quantity: int


class CustomerInfo(BaseModel):
    name: str
    phone: str
    email: Optional[str] = None
    address: Optional[str] = None
    notes: Optional[str] = None


class Order(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    order_number: str = Field(default_factory=lambda: f"ORD-{datetime.now(timezone.utc).strftime('%Y%m%d%H%M%S')}-{str(uuid.uuid4())[:4].upper()}")
    items: List[OrderItem]
    customer: CustomerInfo
    total: float
    status: str = "pending"  # pending, confirmed, preparing, ready, delivered, cancelled
    order_type: str = "pickup"  # pickup, delivery
    payment_method: str = "cash"  # cash, card
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class OrderCreate(BaseModel):
    items: List[OrderItem]
    customer: CustomerInfo
    order_type: str = "pickup"
    payment_method: str = "cash"


class OrderStatusUpdate(BaseModel):
    status: str


# ============== DAILY MENU MODELS ==============

class DailyMenu(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    day: str  # Luni, Marti, etc.
    soup: str
    main: str
    is_active: bool = True


class DailyMenuCreate(BaseModel):
    day: str
    soup: str
    main: str
    is_active: bool = True


class DailyMenuUpdate(BaseModel):
    day: Optional[str] = None
    soup: Optional[str] = None
    main: Optional[str] = None
    is_active: Optional[bool] = None


# ============== RESTAURANT INFO MODELS ==============

class RestaurantSchedule(BaseModel):
    weekdays: str
    weekend: str


class RestaurantInfo(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    tagline: str
    phone: str
    address: str
    email: str
    rating: float = 5.0
    review_count: int = 0
    schedule: RestaurantSchedule
    hero_title: str
    hero_title2: str
    hero_subtitle: str
    hero_image: str


class RestaurantInfoUpdate(BaseModel):
    name: Optional[str] = None
    tagline: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    email: Optional[str] = None
    schedule: Optional[RestaurantSchedule] = None
    hero_title: Optional[str] = None
    hero_title2: Optional[str] = None
    hero_subtitle: Optional[str] = None
    hero_image: Optional[str] = None


# ============== REVIEW MODELS ==============

class Review(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    rating: int = Field(ge=1, le=5)
    text: str
    is_approved: bool = True
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class ReviewCreate(BaseModel):
    name: str
    rating: int = Field(ge=1, le=5)
    text: str
