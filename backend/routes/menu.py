from fastapi import APIRouter, HTTPException
from typing import List
from datetime import datetime, timezone

router = APIRouter(prefix="/menu", tags=["Menu"])


# This will be set from server.py
db = None


def set_db(database):
    global db
    db = database


# ============== CATEGORIES ==============

@router.get("/categories", response_model=List[dict])
async def get_categories():
    """Get all menu categories"""
    categories = await db.menu_categories.find({"is_active": True}, {"_id": 0}).sort("order", 1).to_list(100)
    return categories


@router.post("/categories", response_model=dict)
async def create_category(category: dict):
    """Create a new menu category"""
    from models import MenuCategory, MenuCategoryCreate
    
    category_data = MenuCategoryCreate(**category)
    category_obj = MenuCategory(**category_data.model_dump())
    doc = category_obj.model_dump()
    
    await db.menu_categories.insert_one(doc)
    return doc


@router.put("/categories/{category_id}", response_model=dict)
async def update_category(category_id: str, category: dict):
    """Update a menu category"""
    result = await db.menu_categories.find_one_and_update(
        {"id": category_id},
        {"$set": category},
        return_document=True
    )
    if not result:
        raise HTTPException(status_code=404, detail="Category not found")
    
    result.pop("_id", None)
    return result


@router.delete("/categories/{category_id}")
async def delete_category(category_id: str):
    """Delete a menu category (soft delete)"""
    result = await db.menu_categories.update_one(
        {"id": category_id},
        {"$set": {"is_active": False}}
    )
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Category not found")
    return {"message": "Category deleted successfully"}


# ============== MENU ITEMS ==============

@router.get("/items", response_model=List[dict])
async def get_menu_items(category_id: str = None, popular_only: bool = False):
    """Get all menu items, optionally filtered by category"""
    query = {"is_available": True}
    if category_id:
        query["category_id"] = category_id
    if popular_only:
        query["is_popular"] = True
    
    items = await db.menu_items.find(query, {"_id": 0}).to_list(1000)
    
    # Convert datetime strings if needed
    for item in items:
        if isinstance(item.get('created_at'), str):
            item['created_at'] = datetime.fromisoformat(item['created_at'])
        if isinstance(item.get('updated_at'), str):
            item['updated_at'] = datetime.fromisoformat(item['updated_at'])
    
    return items


@router.get("/items/{item_id}", response_model=dict)
async def get_menu_item(item_id: str):
    """Get a specific menu item"""
    item = await db.menu_items.find_one({"id": item_id}, {"_id": 0})
    if not item:
        raise HTTPException(status_code=404, detail="Menu item not found")
    return item


@router.post("/items", response_model=dict)
async def create_menu_item(item: dict):
    """Create a new menu item"""
    from models import MenuItem, MenuItemCreate
    
    item_data = MenuItemCreate(**item)
    item_obj = MenuItem(**item_data.model_dump())
    doc = item_obj.model_dump()
    
    # Convert datetime to ISO string for MongoDB
    doc['created_at'] = doc['created_at'].isoformat()
    doc['updated_at'] = doc['updated_at'].isoformat()
    
    await db.menu_items.insert_one(doc)
    return doc


@router.put("/items/{item_id}", response_model=dict)
async def update_menu_item(item_id: str, item: dict):
    """Update a menu item"""
    item['updated_at'] = datetime.now(timezone.utc).isoformat()
    
    result = await db.menu_items.find_one_and_update(
        {"id": item_id},
        {"$set": item},
        return_document=True
    )
    if not result:
        raise HTTPException(status_code=404, detail="Menu item not found")
    
    result.pop("_id", None)
    return result


@router.delete("/items/{item_id}")
async def delete_menu_item(item_id: str):
    """Delete a menu item (soft delete)"""
    result = await db.menu_items.update_one(
        {"id": item_id},
        {"$set": {"is_available": False}}
    )
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Menu item not found")
    return {"message": "Menu item deleted successfully"}


# ============== DAILY MENU ==============

@router.get("/daily", response_model=List[dict])
async def get_daily_menu():
    """Get all daily menus"""
    menus = await db.daily_menu.find({"is_active": True}, {"_id": 0}).to_list(10)
    return menus


@router.get("/daily/{day}", response_model=dict)
async def get_daily_menu_by_day(day: str):
    """Get daily menu for a specific day"""
    menu = await db.daily_menu.find_one({"day": day, "is_active": True}, {"_id": 0})
    if not menu:
        raise HTTPException(status_code=404, detail="Daily menu not found for this day")
    return menu


@router.post("/daily", response_model=dict)
async def create_daily_menu(menu: dict):
    """Create a new daily menu entry"""
    from models import DailyMenu, DailyMenuCreate
    
    menu_data = DailyMenuCreate(**menu)
    menu_obj = DailyMenu(**menu_data.model_dump())
    doc = menu_obj.model_dump()
    
    await db.daily_menu.insert_one(doc)
    return doc


@router.put("/daily/{menu_id}", response_model=dict)
async def update_daily_menu(menu_id: str, menu: dict):
    """Update a daily menu entry"""
    result = await db.daily_menu.find_one_and_update(
        {"id": menu_id},
        {"$set": menu},
        return_document=True
    )
    if not result:
        raise HTTPException(status_code=404, detail="Daily menu not found")
    
    result.pop("_id", None)
    return result


@router.delete("/daily/{menu_id}")
async def delete_daily_menu(menu_id: str):
    """Delete a daily menu entry"""
    result = await db.daily_menu.update_one(
        {"id": menu_id},
        {"$set": {"is_active": False}}
    )
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Daily menu not found")
    return {"message": "Daily menu deleted successfully"}
