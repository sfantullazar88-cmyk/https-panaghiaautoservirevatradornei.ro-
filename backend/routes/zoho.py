"""
Zoho CRM Routes for Panaghia Admin
"""
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Optional
import os

router = APIRouter(prefix="/zoho", tags=["Zoho CRM"])

# Database reference
db = None

def set_db(database):
    global db
    db = database


class ZohoInitRequest(BaseModel):
    auth_code: str


@router.post("/initialize")
async def initialize_zoho(request: ZohoInitRequest):
    """
    Initialize Zoho CRM OAuth with authorization code.
    This should be called once during initial setup.
    """
    from services.zoho_service import initialize_zoho_oauth
    
    result = await initialize_zoho_oauth(request.auth_code)
    
    if not result["success"]:
        raise HTTPException(status_code=400, detail=result["message"])
    
    return result


@router.get("/status")
async def get_zoho_status():
    """Check Zoho CRM integration status."""
    from services.zoho_service import get_zoho_status as check_status
    
    return await check_status()


@router.post("/sync-customer")
async def sync_customer_manually(customer_data: dict):
    """Manually sync a customer to Zoho CRM (for testing)."""
    from services.zoho_service import sync_customer_to_zoho
    
    contact_id = await sync_customer_to_zoho(customer_data)
    
    if contact_id:
        return {"success": True, "zoho_contact_id": contact_id}
    else:
        raise HTTPException(status_code=500, detail="Failed to sync customer to Zoho CRM")


@router.post("/sync-order")
async def sync_order_manually(order_data: dict):
    """Manually sync an order to Zoho CRM (for testing)."""
    from services.zoho_service import sync_order_to_zoho
    
    deal_id = await sync_order_to_zoho(order_data)
    
    if deal_id:
        return {"success": True, "zoho_deal_id": deal_id}
    else:
        raise HTTPException(status_code=500, detail="Failed to sync order to Zoho CRM")
