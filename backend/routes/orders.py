from fastapi import APIRouter, HTTPException
from typing import List
from datetime import datetime, timezone

router = APIRouter(prefix="/orders", tags=["Orders"])


# This will be set from server.py
db = None


def set_db(database):
    global db
    db = database


@router.get("/", response_model=List[dict])
async def get_orders(status: str = None, limit: int = 50):
    """Get all orders, optionally filtered by status"""
    query = {}
    if status:
        query["status"] = status
    
    orders = await db.orders.find(query, {"_id": 0}).sort("created_at", -1).to_list(limit)
    
    # Convert datetime strings if needed
    for order in orders:
        if isinstance(order.get('created_at'), str):
            order['created_at'] = datetime.fromisoformat(order['created_at'])
        if isinstance(order.get('updated_at'), str):
            order['updated_at'] = datetime.fromisoformat(order['updated_at'])
    
    return orders


@router.get("/{order_id}", response_model=dict)
async def get_order(order_id: str):
    """Get a specific order by ID"""
    order = await db.orders.find_one({"id": order_id}, {"_id": 0})
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order


@router.get("/number/{order_number}", response_model=dict)
async def get_order_by_number(order_number: str):
    """Get a specific order by order number"""
    order = await db.orders.find_one({"order_number": order_number}, {"_id": 0})
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order


@router.post("/", response_model=dict)
async def create_order(order_data: dict):
    """Create a new order"""
    from models import Order, OrderCreate, OrderItem, CustomerInfo
    
    # Calculate total
    total = sum(item['price'] * item['quantity'] for item in order_data.get('items', []))
    
    # Create order object
    order_create = OrderCreate(
        items=[OrderItem(**item) for item in order_data.get('items', [])],
        customer=CustomerInfo(**order_data.get('customer', {})),
        order_type=order_data.get('order_type', 'pickup'),
        payment_method=order_data.get('payment_method', 'cash')
    )
    
    order = Order(
        **order_create.model_dump(),
        total=total
    )
    
    doc = order.model_dump()
    
    # Convert datetime to ISO string for MongoDB
    doc['created_at'] = doc['created_at'].isoformat()
    doc['updated_at'] = doc['updated_at'].isoformat()
    
    await db.orders.insert_one(doc)
    
    # Return without _id
    doc.pop('_id', None)
    
    # Send email notification (async, don't block response)
    try:
        from services.email_service import send_new_order_notification
        import asyncio
        asyncio.create_task(send_new_order_notification(doc))
    except Exception as e:
        # Log but don't fail the order creation
        import logging
        logging.error(f"Failed to queue email notification: {e}")
    
    # Sync to Zoho CRM (async, don't block response)
    try:
        from services.zoho_service import sync_customer_to_zoho, sync_order_to_zoho
        import asyncio
        
        async def sync_to_zoho():
            # First sync customer
            customer_data = doc.get('customer', {})
            contact_id = await sync_customer_to_zoho(customer_data)
            # Then sync order with contact reference
            await sync_order_to_zoho(doc, contact_id)
        
        asyncio.create_task(sync_to_zoho())
    except Exception as e:
        import logging
        logging.error(f"Failed to queue Zoho CRM sync: {e}")
    
    return doc


@router.patch("/{order_id}/status", response_model=dict)
async def update_order_status(order_id: str, status_data: dict):
    """Update order status"""
    valid_statuses = ['pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled']
    new_status = status_data.get('status')
    
    if new_status not in valid_statuses:
        raise HTTPException(status_code=400, detail=f"Invalid status. Must be one of: {', '.join(valid_statuses)}")
    
    result = await db.orders.find_one_and_update(
        {"id": order_id},
        {
            "$set": {
                "status": new_status,
                "updated_at": datetime.now(timezone.utc).isoformat()
            }
        },
        return_document=True
    )
    
    if not result:
        raise HTTPException(status_code=404, detail="Order not found")
    
    result.pop("_id", None)
    
    # Sync status update to Zoho CRM (async)
    zoho_deal_id = result.get("zoho_deal_id")
    if zoho_deal_id:
        try:
            from services.zoho_service import update_deal_status
            import asyncio
            asyncio.create_task(update_deal_status(zoho_deal_id, new_status))
        except Exception as e:
            import logging
            logging.error(f"Failed to sync status to Zoho CRM: {e}")
    
    return result


@router.delete("/{order_id}")
async def cancel_order(order_id: str):
    """Cancel an order"""
    order = await db.orders.find_one({"id": order_id})
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    if order.get('status') in ['delivered', 'cancelled']:
        raise HTTPException(status_code=400, detail="Cannot cancel this order")
    
    await db.orders.update_one(
        {"id": order_id},
        {
            "$set": {
                "status": "cancelled",
                "updated_at": datetime.now(timezone.utc).isoformat()
            }
        }
    )
    
    return {"message": "Order cancelled successfully"}
