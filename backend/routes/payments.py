"""
Stripe Payment Integration for Panaghia
"""
from datetime import datetime, timezone
from typing import Optional
import os
import uuid

from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel

router = APIRouter(prefix="/payments", tags=["Payments"])

# Database reference
db = None

def set_db(database):
    global db
    db = database


# ============== MODELS ==============

class CreateCheckoutRequest(BaseModel):
    order_id: str
    origin_url: str


class CheckoutResponse(BaseModel):
    checkout_url: str
    session_id: str


class PaymentStatusResponse(BaseModel):
    status: str
    payment_status: str
    amount_total: float
    currency: str
    order_id: Optional[str] = None


# ============== ROUTES ==============

@router.post("/checkout", response_model=CheckoutResponse)
async def create_checkout_session(request: CreateCheckoutRequest, http_request: Request):
    """Create Stripe checkout session for an order"""
    from emergentintegrations.payments.stripe.checkout import (
        StripeCheckout, 
        CheckoutSessionRequest
    )
    
    # Get order
    order = await db.orders.find_one({"id": request.order_id}, {"_id": 0})
    if not order:
        raise HTTPException(status_code=404, detail="Comandă negăsită")
    
    # Check if already paid
    if order.get("payment_status") == "paid":
        raise HTTPException(status_code=400, detail="Comanda a fost deja plătită")
    
    # Get Stripe API key
    api_key = os.environ.get('STRIPE_SECRET_KEY')
    if not api_key:
        raise HTTPException(status_code=500, detail="Stripe nu este configurat")
    
    # Build URLs
    host_url = request.origin_url.rstrip('/')
    webhook_url = f"{str(http_request.base_url).rstrip('/')}/api/webhook/stripe"
    success_url = f"{host_url}/comanda/success?session_id={{CHECKOUT_SESSION_ID}}"
    cancel_url = f"{host_url}/comanda?cancelled=true"
    
    # Initialize Stripe
    stripe_checkout = StripeCheckout(api_key=api_key, webhook_url=webhook_url)
    
    # Create checkout session
    # Amount in RON (or EUR if RON not supported)
    amount = float(order["total"])
    
    checkout_request = CheckoutSessionRequest(
        amount=amount,
        currency="ron",  # Romanian Lei
        success_url=success_url,
        cancel_url=cancel_url,
        metadata={
            "order_id": order["id"],
            "order_number": order["order_number"],
            "customer_name": order["customer"]["name"],
            "customer_phone": order["customer"]["phone"]
        }
    )
    
    try:
        session = await stripe_checkout.create_checkout_session(checkout_request)
    except Exception as e:
        # If RON doesn't work, try EUR
        checkout_request.currency = "eur"
        session = await stripe_checkout.create_checkout_session(checkout_request)
    
    # Create payment transaction record
    transaction = {
        "id": str(uuid.uuid4()),
        "order_id": order["id"],
        "order_number": order["order_number"],
        "session_id": session.session_id,
        "amount": amount,
        "currency": checkout_request.currency,
        "payment_status": "pending",
        "status": "initiated",
        "customer_email": order["customer"].get("email"),
        "metadata": checkout_request.metadata,
        "created_at": datetime.now(timezone.utc).isoformat(),
        "updated_at": datetime.now(timezone.utc).isoformat()
    }
    
    await db.payment_transactions.insert_one(transaction)
    
    # Update order with session ID
    await db.orders.update_one(
        {"id": order["id"]},
        {
            "$set": {
                "stripe_session_id": session.session_id,
                "payment_status": "pending"
            }
        }
    )
    
    return CheckoutResponse(
        checkout_url=session.url,
        session_id=session.session_id
    )


@router.get("/status/{session_id}", response_model=PaymentStatusResponse)
async def get_payment_status(session_id: str):
    """Get payment status for a checkout session"""
    from emergentintegrations.payments.stripe.checkout import StripeCheckout
    
    api_key = os.environ.get('STRIPE_SECRET_KEY')
    if not api_key:
        raise HTTPException(status_code=500, detail="Stripe nu este configurat")
    
    stripe_checkout = StripeCheckout(api_key=api_key, webhook_url="")
    
    try:
        status = await stripe_checkout.get_checkout_status(session_id)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Eroare la verificarea statusului: {str(e)}")
    
    # Find transaction
    transaction = await db.payment_transactions.find_one({"session_id": session_id})
    order_id = transaction["order_id"] if transaction else None
    
    # Update transaction and order if payment completed
    if status.payment_status == "paid" and transaction:
        # Check if already processed
        if transaction.get("payment_status") != "paid":
            # Update transaction
            await db.payment_transactions.update_one(
                {"session_id": session_id},
                {
                    "$set": {
                        "payment_status": "paid",
                        "status": "completed",
                        "updated_at": datetime.now(timezone.utc).isoformat()
                    }
                }
            )
            
            # Update order
            await db.orders.update_one(
                {"id": order_id},
                {
                    "$set": {
                        "payment_status": "paid",
                        "payment_method": "card_online",
                        "status": "confirmed"  # Auto-confirm paid orders
                    }
                }
            )
    
    return PaymentStatusResponse(
        status=status.status,
        payment_status=status.payment_status,
        amount_total=status.amount_total / 100,  # Convert from cents
        currency=status.currency,
        order_id=order_id
    )


@router.post("/webhook/stripe")
async def stripe_webhook(request: Request):
    """Handle Stripe webhooks"""
    from emergentintegrations.payments.stripe.checkout import StripeCheckout
    
    api_key = os.environ.get('STRIPE_API_KEY')
    if not api_key:
        return {"status": "error", "message": "Stripe not configured"}
    
    stripe_checkout = StripeCheckout(api_key=api_key, webhook_url="")
    
    # Get raw body
    body = await request.body()
    signature = request.headers.get("Stripe-Signature")
    
    try:
        webhook_response = await stripe_checkout.handle_webhook(body, signature)
        
        # Process webhook
        if webhook_response.payment_status == "paid":
            session_id = webhook_response.session_id
            order_id = webhook_response.metadata.get("order_id")
            
            # Update transaction
            await db.payment_transactions.update_one(
                {"session_id": session_id},
                {
                    "$set": {
                        "payment_status": "paid",
                        "status": "completed",
                        "updated_at": datetime.now(timezone.utc).isoformat()
                    }
                }
            )
            
            # Update order
            if order_id:
                await db.orders.update_one(
                    {"id": order_id},
                    {
                        "$set": {
                            "payment_status": "paid",
                            "payment_method": "card_online",
                            "status": "confirmed"
                        }
                    }
                )
        
        return {"status": "success", "event_type": webhook_response.event_type}
    
    except Exception as e:
        print(f"Webhook error: {e}")
        return {"status": "error", "message": str(e)}
