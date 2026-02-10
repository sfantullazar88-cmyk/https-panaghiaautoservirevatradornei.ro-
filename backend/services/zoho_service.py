"""
Zoho CRM Integration Service for Panaghia
Syncs customer and order data to Zoho CRM
"""
import os
import httpx
import logging
from datetime import datetime, timezone, timedelta
from typing import Optional, Dict, Any

logger = logging.getLogger(__name__)

# Zoho Configuration
ZOHO_CLIENT_ID = os.environ.get('ZOHO_CLIENT_ID')
ZOHO_CLIENT_SECRET = os.environ.get('ZOHO_CLIENT_SECRET')
ZOHO_ACCOUNTS_URL = "https://accounts.zoho.eu"  # EU domain for Romania
ZOHO_API_URL = "https://www.zohoapis.eu/crm/v6"

# Database reference (set from server.py)
db = None

def set_db(database):
    global db
    db = database


async def exchange_authorization_code(auth_code: str) -> dict:
    """
    Exchange authorization code for access and refresh tokens.
    Should be called once during initial setup.
    """
    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"{ZOHO_ACCOUNTS_URL}/oauth/v2/token",
            params={
                "client_id": ZOHO_CLIENT_ID,
                "client_secret": ZOHO_CLIENT_SECRET,
                "grant_type": "authorization_code",
                "code": auth_code,
                "redirect_uri": "http://localhost:8000/api/zoho/callback",
            }
        )
        
        if response.status_code != 200:
            logger.error(f"Token exchange failed: {response.text}")
            raise Exception(f"Token exchange failed: {response.text}")
        
        token_data = response.json()
        
        # Store tokens in MongoDB
        await db.zoho_tokens.update_one(
            {"_id": "zoho_tokens"},
            {
                "$set": {
                    "access_token": token_data.get("access_token"),
                    "refresh_token": token_data.get("refresh_token"),
                    "expires_in": token_data.get("expires_in", 3600),
                    "created_at": datetime.now(timezone.utc),
                    "updated_at": datetime.now(timezone.utc)
                }
            },
            upsert=True
        )
        
        logger.info("Zoho CRM tokens stored successfully")
        return token_data


async def get_valid_access_token() -> Optional[str]:
    """
    Get a valid access token, refreshing if necessary.
    """
    token_doc = await db.zoho_tokens.find_one({"_id": "zoho_tokens"})
    
    if not token_doc or not token_doc.get("refresh_token"):
        logger.warning("No Zoho tokens found. Please initialize OAuth first.")
        return None
    
    # Check if token needs refresh (5 min buffer)
    created_at = token_doc.get("created_at", datetime.now(timezone.utc))
    expires_in = token_doc.get("expires_in", 3600)
    
    if isinstance(created_at, str):
        created_at = datetime.fromisoformat(created_at.replace('Z', '+00:00'))
    
    expiry_time = created_at + timedelta(seconds=expires_in - 300)
    
    if datetime.now(timezone.utc) >= expiry_time:
        return await _refresh_access_token(token_doc["refresh_token"])
    
    return token_doc.get("access_token")


async def _refresh_access_token(refresh_token: str) -> Optional[str]:
    """Refresh expired access token using refresh token."""
    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"{ZOHO_ACCOUNTS_URL}/oauth/v2/token",
            params={
                "client_id": ZOHO_CLIENT_ID,
                "client_secret": ZOHO_CLIENT_SECRET,
                "grant_type": "refresh_token",
                "refresh_token": refresh_token,
            }
        )
        
        if response.status_code != 200:
            logger.error(f"Token refresh failed: {response.text}")
            return None
        
        token_data = response.json()
        
        # Update tokens in MongoDB
        await db.zoho_tokens.update_one(
            {"_id": "zoho_tokens"},
            {
                "$set": {
                    "access_token": token_data["access_token"],
                    "expires_in": token_data.get("expires_in", 3600),
                    "updated_at": datetime.now(timezone.utc)
                }
            }
        )
        
        logger.info("Zoho access token refreshed successfully")
        return token_data["access_token"]


async def sync_customer_to_zoho(customer_data: Dict[str, Any]) -> Optional[str]:
    """
    Create or update a contact in Zoho CRM.
    Returns the Zoho contact ID.
    """
    access_token = await get_valid_access_token()
    if not access_token:
        logger.warning("No valid Zoho access token - skipping customer sync")
        return None
    
    headers = {
        "Authorization": f"Zoho-oauthtoken {access_token}",
        "Content-Type": "application/json"
    }
    
    # Prepare contact data
    contact_payload = {
        "data": [
            {
                "Last_Name": customer_data.get("name", "Client"),
                "Email": customer_data.get("email", ""),
                "Phone": customer_data.get("phone", ""),
                "Mailing_Street": customer_data.get("address", ""),
                "Mailing_City": "Vatra Dornei",
                "Description": f"Client Panaghia - {customer_data.get('notes', '')}"
            }
        ]
    }
    
    try:
        async with httpx.AsyncClient() as client:
            # First check if contact exists by phone
            existing = await _find_contact_by_phone(
                customer_data.get("phone", ""),
                access_token
            )
            
            if existing:
                # Update existing contact
                contact_id = existing
                response = await client.put(
                    f"{ZOHO_API_URL}/Contacts/{contact_id}",
                    headers=headers,
                    json=contact_payload,
                    timeout=30.0
                )
            else:
                # Create new contact
                response = await client.post(
                    f"{ZOHO_API_URL}/Contacts",
                    headers=headers,
                    json=contact_payload,
                    timeout=30.0
                )
            
            if response.status_code in (200, 201):
                result = response.json()
                if result.get("data"):
                    contact_id = result["data"][0].get("details", {}).get("id")
                    logger.info(f"Customer synced to Zoho CRM: {contact_id}")
                    return contact_id
            else:
                logger.error(f"Zoho CRM contact sync failed: {response.status_code} - {response.text}")
                
    except Exception as e:
        logger.error(f"Error syncing customer to Zoho CRM: {e}")
    
    return None


async def sync_order_to_zoho(order_data: Dict[str, Any], contact_id: Optional[str] = None) -> Optional[str]:
    """
    Create a deal in Zoho CRM for the order.
    Returns the Zoho deal ID.
    """
    access_token = await get_valid_access_token()
    if not access_token:
        logger.warning("No valid Zoho access token - skipping order sync")
        return None
    
    headers = {
        "Authorization": f"Zoho-oauthtoken {access_token}",
        "Content-Type": "application/json"
    }
    
    # Map order status to deal stage
    stage_mapping = {
        "pending": "Qualification",
        "confirmed": "Needs Analysis",
        "preparing": "Value Proposition",
        "ready": "Proposal/Price Quote",
        "delivered": "Closed Won",
        "cancelled": "Closed Lost"
    }
    
    current_status = order_data.get("status", "pending")
    deal_stage = stage_mapping.get(current_status, "Qualification")
    
    # Build items description
    items_desc = "\n".join([
        f"- {item.get('name', 'Produs')} x{item.get('quantity', 1)} = {item.get('price', 0) * item.get('quantity', 1)} lei"
        for item in order_data.get("items", [])
    ])
    
    customer = order_data.get("customer", {})
    
    # Prepare deal data
    deal_payload = {
        "data": [
            {
                "Deal_Name": f"Comandă #{order_data.get('order_number', 'N/A')}",
                "Stage": deal_stage,
                "Amount": float(order_data.get("total", 0)),
                "Closing_Date": datetime.now(timezone.utc).strftime("%Y-%m-%d"),
                "Description": f"""
Comandă Panaghia #{order_data.get('order_number', 'N/A')}

Client: {customer.get('name', 'N/A')}
Telefon: {customer.get('phone', 'N/A')}
Tip: {order_data.get('order_type', 'pickup')}
Plată: {order_data.get('payment_method', 'cash')}

Produse:
{items_desc}

Adresă: {customer.get('address', 'N/A')}
Observații: {customer.get('notes', '')}
                """.strip()
            }
        ]
    }
    
    # Add contact association if available
    if contact_id:
        deal_payload["data"][0]["Contact_Name"] = contact_id
    
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{ZOHO_API_URL}/Deals",
                headers=headers,
                json=deal_payload,
                timeout=30.0
            )
            
            if response.status_code in (200, 201):
                result = response.json()
                if result.get("data"):
                    deal_id = result["data"][0].get("details", {}).get("id")
                    logger.info(f"Order synced to Zoho CRM as deal: {deal_id}")
                    
                    # Save deal_id to order in database
                    if deal_id and db:
                        await db.orders.update_one(
                            {"id": order_data.get("id")},
                            {"$set": {"zoho_deal_id": deal_id}}
                        )
                    
                    return deal_id
            else:
                logger.error(f"Zoho CRM deal sync failed: {response.status_code} - {response.text}")
                
    except Exception as e:
        logger.error(f"Error syncing order to Zoho CRM: {e}")
    
    return None


async def update_deal_status(deal_id: str, new_status: str) -> bool:
    """
    Update the stage of a deal based on order status.
    """
    access_token = await get_valid_access_token()
    if not access_token:
        return False
    
    headers = {
        "Authorization": f"Zoho-oauthtoken {access_token}",
        "Content-Type": "application/json"
    }
    
    stage_mapping = {
        "pending": "Qualification",
        "confirmed": "Needs Analysis",
        "preparing": "Value Proposition",
        "ready": "Proposal/Price Quote",
        "delivered": "Closed Won",
        "cancelled": "Closed Lost"
    }
    
    deal_stage = stage_mapping.get(new_status, "Qualification")
    
    payload = {
        "data": [
            {"Stage": deal_stage}
        ]
    }
    
    try:
        async with httpx.AsyncClient() as client:
            response = await client.put(
                f"{ZOHO_API_URL}/Deals/{deal_id}",
                headers=headers,
                json=payload,
                timeout=30.0
            )
            
            if response.status_code == 200:
                logger.info(f"Deal {deal_id} status updated to {deal_stage}")
                return True
            else:
                logger.error(f"Failed to update deal status: {response.text}")
                
    except Exception as e:
        logger.error(f"Error updating deal status: {e}")
    
    return False


async def _find_contact_by_phone(phone: str, access_token: str) -> Optional[str]:
    """Search for existing contact by phone number."""
    if not phone:
        return None
    
    headers = {
        "Authorization": f"Zoho-oauthtoken {access_token}",
        "Content-Type": "application/json"
    }
    
    try:
        async with httpx.AsyncClient() as client:
            # Search by phone
            response = await client.get(
                f"{ZOHO_API_URL}/Contacts/search",
                headers=headers,
                params={"phone": phone},
                timeout=30.0
            )
            
            if response.status_code == 200:
                result = response.json()
                if result.get("data") and len(result["data"]) > 0:
                    return result["data"][0].get("id")
                    
    except Exception as e:
        logger.error(f"Error searching for contact: {e}")
    
    return None


async def initialize_zoho_oauth(auth_code: str) -> dict:
    """
    Initialize Zoho OAuth with authorization code.
    Call this once to set up the integration.
    """
    try:
        token_data = await exchange_authorization_code(auth_code)
        return {
            "success": True,
            "message": "Zoho CRM OAuth initialized successfully",
            "expires_in": token_data.get("expires_in", 3600)
        }
    except Exception as e:
        return {
            "success": False,
            "message": str(e)
        }


async def get_zoho_status() -> dict:
    """Check Zoho CRM integration status."""
    token_doc = await db.zoho_tokens.find_one({"_id": "zoho_tokens"})
    
    if not token_doc:
        return {
            "connected": False,
            "message": "Zoho CRM not configured. Please initialize OAuth."
        }
    
    access_token = await get_valid_access_token()
    
    return {
        "connected": access_token is not None,
        "last_updated": token_doc.get("updated_at", "N/A"),
        "message": "Zoho CRM connected" if access_token else "Token expired or invalid"
    }
