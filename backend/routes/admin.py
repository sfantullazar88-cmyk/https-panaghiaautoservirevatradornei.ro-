"""
Admin routes for Panaghia - Dashboard, Statistics, Delivery Management
"""
from datetime import datetime, timedelta, timezone
from typing import Optional, List
from fastapi import APIRouter, HTTPException, Depends, Query
from pydantic import BaseModel

from routes.auth import get_current_admin

router = APIRouter(prefix="/admin", tags=["Admin"])

# Database reference
db = None

def set_db(database):
    global db
    db = database


# ============== MODELS ==============

class DashboardStats(BaseModel):
    total_orders: int
    total_revenue: float
    orders_today: int
    revenue_today: float
    pending_orders: int
    popular_items: list
    orders_by_status: dict
    revenue_by_day: list


class DeliveryOrder(BaseModel):
    id: str
    order_number: str
    customer_name: str
    customer_phone: str
    address: str
    total: float
    status: str
    created_at: str
    items: list
    coordinates: Optional[dict] = None


# ============== DASHBOARD & STATS ==============

@router.get("/dashboard", response_model=DashboardStats)
async def get_dashboard_stats(current_user: dict = Depends(get_current_admin)):
    """Get dashboard statistics"""
    now = datetime.now(timezone.utc)
    today_start = now.replace(hour=0, minute=0, second=0, microsecond=0)
    
    # Total orders
    total_orders = await db.orders.count_documents({})
    
    # Total revenue
    pipeline = [
        {"$group": {"_id": None, "total": {"$sum": "$total"}}}
    ]
    revenue_result = await db.orders.aggregate(pipeline).to_list(1)
    total_revenue = revenue_result[0]["total"] if revenue_result else 0
    
    # Orders today
    orders_today = await db.orders.count_documents({
        "created_at": {"$gte": today_start.isoformat()}
    })
    
    # Revenue today
    pipeline_today = [
        {"$match": {"created_at": {"$gte": today_start.isoformat()}}},
        {"$group": {"_id": None, "total": {"$sum": "$total"}}}
    ]
    revenue_today_result = await db.orders.aggregate(pipeline_today).to_list(1)
    revenue_today = revenue_today_result[0]["total"] if revenue_today_result else 0
    
    # Pending orders
    pending_orders = await db.orders.count_documents({"status": {"$in": ["pending", "confirmed", "preparing"]}})
    
    # Popular items (top 5)
    popular_pipeline = [
        {"$unwind": "$items"},
        {"$group": {"_id": "$items.name", "count": {"$sum": "$items.quantity"}}},
        {"$sort": {"count": -1}},
        {"$limit": 5}
    ]
    popular_items = await db.orders.aggregate(popular_pipeline).to_list(5)
    
    # Orders by status
    status_pipeline = [
        {"$group": {"_id": "$status", "count": {"$sum": 1}}}
    ]
    status_result = await db.orders.aggregate(status_pipeline).to_list(10)
    orders_by_status = {item["_id"]: item["count"] for item in status_result}
    
    # Revenue by day (last 7 days)
    seven_days_ago = (now - timedelta(days=7)).isoformat()
    daily_pipeline = [
        {"$match": {"created_at": {"$gte": seven_days_ago}}},
        {"$addFields": {"date": {"$substr": ["$created_at", 0, 10]}}},
        {"$group": {"_id": "$date", "revenue": {"$sum": "$total"}, "orders": {"$sum": 1}}},
        {"$sort": {"_id": 1}}
    ]
    daily_result = await db.orders.aggregate(daily_pipeline).to_list(7)
    
    return DashboardStats(
        total_orders=total_orders,
        total_revenue=total_revenue,
        orders_today=orders_today,
        revenue_today=revenue_today,
        pending_orders=pending_orders,
        popular_items=[{"name": p["_id"], "count": p["count"]} for p in popular_items],
        orders_by_status=orders_by_status,
        revenue_by_day=[{"date": d["_id"], "revenue": d["revenue"], "orders": d["orders"]} for d in daily_result]
    )


@router.get("/orders")
async def get_admin_orders(
    status: Optional[str] = None,
    date_from: Optional[str] = None,
    date_to: Optional[str] = None,
    order_type: Optional[str] = None,
    limit: int = Query(default=50, le=200),
    skip: int = 0,
    current_user: dict = Depends(get_current_admin)
):
    """Get all orders with filters"""
    query = {}
    
    if status:
        query["status"] = status
    if order_type:
        query["order_type"] = order_type
    if date_from:
        query["created_at"] = {"$gte": date_from}
    if date_to:
        if "created_at" in query:
            query["created_at"]["$lte"] = date_to
        else:
            query["created_at"] = {"$lte": date_to}
    
    orders = await db.orders.find(query, {"_id": 0}).sort("created_at", -1).skip(skip).limit(limit).to_list(limit)
    total = await db.orders.count_documents(query)
    
    return {"orders": orders, "total": total, "limit": limit, "skip": skip}


@router.patch("/orders/{order_id}/status")
async def update_order_status_admin(
    order_id: str,
    status_data: dict,
    current_user: dict = Depends(get_current_admin)
):
    """Update order status (admin only)"""
    valid_statuses = ['pending', 'confirmed', 'preparing', 'ready', 'out_for_delivery', 'delivered', 'cancelled']
    new_status = status_data.get('status')
    
    if new_status not in valid_statuses:
        raise HTTPException(status_code=400, detail=f"Status invalid. Opțiuni: {', '.join(valid_statuses)}")
    
    result = await db.orders.find_one_and_update(
        {"id": order_id},
        {
            "$set": {
                "status": new_status,
                "updated_at": datetime.now(timezone.utc).isoformat(),
                "updated_by": current_user["email"]
            }
        },
        return_document=True
    )
    
    if not result:
        raise HTTPException(status_code=404, detail="Comandă negăsită")
    
    result.pop("_id", None)
    return result


# ============== DELIVERY MANAGEMENT ==============

@router.get("/delivery/orders")
async def get_delivery_orders(
    status: Optional[str] = Query(default=None),
    current_user: dict = Depends(get_current_admin)
):
    """Get delivery orders for map view"""
    query = {"order_type": "delivery"}
    
    if status:
        query["status"] = status
    else:
        # Default: show active deliveries
        query["status"] = {"$in": ["confirmed", "preparing", "ready", "out_for_delivery"]}
    
    orders = await db.orders.find(query, {"_id": 0}).sort("created_at", -1).to_list(100)
    
    # Format for map display
    delivery_orders = []
    for order in orders:
        delivery_orders.append({
            "id": order["id"],
            "order_number": order["order_number"],
            "customer_name": order["customer"]["name"],
            "customer_phone": order["customer"]["phone"],
            "address": order["customer"].get("address", ""),
            "notes": order["customer"].get("notes", ""),
            "total": order["total"],
            "status": order["status"],
            "created_at": order["created_at"],
            "items": order["items"],
            "coordinates": order.get("coordinates")  # Will be set when geocoded
        })
    
    return {"deliveries": delivery_orders, "total": len(delivery_orders)}


@router.patch("/delivery/orders/{order_id}/coordinates")
async def update_delivery_coordinates(
    order_id: str,
    coordinates: dict,
    current_user: dict = Depends(get_current_admin)
):
    """Update delivery coordinates (from geocoding)"""
    lat = coordinates.get("lat")
    lng = coordinates.get("lng")
    
    if lat is None or lng is None:
        raise HTTPException(status_code=400, detail="Coordonate invalide")
    
    result = await db.orders.find_one_and_update(
        {"id": order_id},
        {"$set": {"coordinates": {"lat": lat, "lng": lng}}},
        return_document=True
    )
    
    if not result:
        raise HTTPException(status_code=404, detail="Comandă negăsită")
    
    result.pop("_id", None)
    return result


# ============== MENU MANAGEMENT ==============

@router.post("/menu/categories")
async def create_category_admin(
    category: dict,
    current_user: dict = Depends(get_current_admin)
):
    """Create a new menu category (admin only)"""
    from models import MenuCategory, MenuCategoryCreate
    import uuid
    
    category_data = MenuCategoryCreate(**category)
    category_obj = MenuCategory(
        id=str(uuid.uuid4()),
        **category_data.model_dump()
    )
    doc = category_obj.model_dump()
    
    await db.menu_categories.insert_one(doc)
    return doc


@router.put("/menu/categories/{category_id}")
async def update_category_admin(
    category_id: str,
    category: dict,
    current_user: dict = Depends(get_current_admin)
):
    """Update a menu category (admin only)"""
    result = await db.menu_categories.find_one_and_update(
        {"id": category_id},
        {"$set": category},
        return_document=True
    )
    if not result:
        raise HTTPException(status_code=404, detail="Categorie negăsită")
    
    result.pop("_id", None)
    return result


@router.delete("/menu/categories/{category_id}")
async def delete_category_admin(
    category_id: str,
    current_user: dict = Depends(get_current_admin)
):
    """Delete a menu category (admin only)"""
    result = await db.menu_categories.delete_one({"id": category_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Categorie negăsită")
    return {"message": "Categorie ștearsă cu succes"}


@router.post("/menu/items")
async def create_item_admin(
    item: dict,
    current_user: dict = Depends(get_current_admin)
):
    """Create a new menu item (admin only)"""
    from models import MenuItem, MenuItemCreate
    import uuid
    
    item_data = MenuItemCreate(**item)
    item_obj = MenuItem(
        id=str(uuid.uuid4()),
        **item_data.model_dump()
    )
    doc = item_obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    doc['updated_at'] = doc['updated_at'].isoformat()
    
    await db.menu_items.insert_one(doc)
    return doc


@router.put("/menu/items/{item_id}")
async def update_item_admin(
    item_id: str,
    item: dict,
    current_user: dict = Depends(get_current_admin)
):
    """Update a menu item (admin only)"""
    item['updated_at'] = datetime.now(timezone.utc).isoformat()
    
    result = await db.menu_items.find_one_and_update(
        {"id": item_id},
        {"$set": item},
        return_document=True
    )
    if not result:
        raise HTTPException(status_code=404, detail="Produs negăsit")
    
    result.pop("_id", None)
    return result


@router.delete("/menu/items/{item_id}")
async def delete_item_admin(
    item_id: str,
    current_user: dict = Depends(get_current_admin)
):
    """Delete a menu item (admin only)"""
    result = await db.menu_items.delete_one({"id": item_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Produs negăsit")
    return {"message": "Produs șters cu succes"}


@router.put("/menu/daily/{menu_id}")
async def update_daily_menu_admin(
    menu_id: str,
    menu: dict,
    current_user: dict = Depends(get_current_admin)
):
    """Update daily menu (admin only)"""
    result = await db.daily_menu.find_one_and_update(
        {"id": menu_id},
        {"$set": menu},
        return_document=True
    )
    if not result:
        raise HTTPException(status_code=404, detail="Meniu zilnic negăsit")
    
    result.pop("_id", None)
    return result


# ============== REVIEWS MANAGEMENT ==============

@router.get("/reviews")
async def get_all_reviews_admin(
    approved: Optional[bool] = None,
    current_user: dict = Depends(get_current_admin)
):
    """Get all reviews (admin only)"""
    query = {}
    if approved is not None:
        query["is_approved"] = approved
    
    reviews = await db.reviews.find(query, {"_id": 0}).sort("created_at", -1).to_list(100)
    return {"reviews": reviews, "total": len(reviews)}


@router.patch("/reviews/{review_id}/approve")
async def approve_review_admin(
    review_id: str,
    approval: dict,
    current_user: dict = Depends(get_current_admin)
):
    """Approve or reject a review (admin only)"""
    result = await db.reviews.find_one_and_update(
        {"id": review_id},
        {"$set": {"is_approved": approval.get("is_approved", True)}},
        return_document=True
    )
    if not result:
        raise HTTPException(status_code=404, detail="Recenzie negăsită")
    
    result.pop("_id", None)
    return result


@router.delete("/reviews/{review_id}")
async def delete_review_admin(
    review_id: str,
    current_user: dict = Depends(get_current_admin)
):
    """Delete a review (admin only)"""
    result = await db.reviews.delete_one({"id": review_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Recenzie negăsită")
    return {"message": "Recenzie ștearsă cu succes"}
