"""
Stripe Payment Integration for Panaghia
"""
from datetime import datetime, timezone
from typing import Optional
import os
import uuid

import stripe
from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel

router = APIRouter(prefix="/payments", tags=["Payments"])

db = None

def set_db(database):
    global db
    db = database


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


@router.post("/checkout", response_model=CheckoutResponse)
async def create_checkout_session(request: CreateCheckoutRequest, http_request: Request):
    order = await db.orders.find_one({"id": request.order_id}, {"_id": 0})
    if not order:
        raise HTTPException(status_code=404, detail="Comandă negăsită")

    if order.get("payment_status") == "paid":
        raise HTTPException(status_code=400, detail="Comanda a fost deja plătită")

    api_key = os.environ.get("STRIPE_SECRET_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="Stripe nu este configurat")

    stripe.api_key = api_key

    host_url = request.origin_url.rstrip("/")
    success_url = f"{host_url}/comanda/success?session_id={{CHECKOUT_SESSION_ID}}"
    cancel_url = f"{host_url}/comanda?cancelled=true"

    amount = float(order.get("total", 0))
    amount_cents = int(round(amount * 100))

    if amount_cents <= 0:
        raise HTTPException(status_code=400, detail="Total comandă invalid")

    metadata = {
        "order_id": order["id"],
        "order_number": str(order.get("order_number", "")),
        "customer_name": order.get("customer", {}).get("name", ""),
        "customer_phone": order.get("customer", {}).get("phone", "")
    }

    try:
        session = stripe.checkout.Session.create(
            payment_method_types=["card"],
            mode="payment",
            line_items=[
                {
                    "price_data": {
                        "currency": "ron",
                        "product_data": {
                            "name": f"Comandă Panaghia #{order.get('order_number', '')}",
                        },
                        "unit_amount": amount_cents,
                    },
                    "quantity": 1,
                }
            ],
            success_url=success_url,
            cancel_url=cancel_url,
            metadata=metadata,
        )
        currency = "ron"
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Eroare Stripe: {str(e)}")

    transaction = {
        "id": str(uuid.uuid4()),
        "order_id": order["id"],
        "order_number": order.get("order_number"),
        "session_id": session.id,
        "amount": amount,
        "currency": currency,
        "payment_status": "pending",
        "status": "initiated",
        "customer_email": order.get("customer", {}).get("email"),
        "metadata": metadata,
        "created_at": datetime.now(timezone.utc).isoformat(),
        "updated_at": datetime.now(timezone.utc).isoformat()
    }

    await db.payment_transactions.insert_one(transaction)

    await db.orders.update_one(
        {"id": order["id"]},
        {
            "$set": {
                "stripe_session_id": session.id,
                "payment_status": "pending"
            }
        }
    )

    return CheckoutResponse(
        checkout_url=session.url,
        session_id=session.id
    )


@router.get("/status/{session_id}", response_model=PaymentStatusResponse)
async def get_payment_status(session_id: str):
    api_key = os.environ.get("STRIPE_SECRET_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="Stripe nu este configurat")

    stripe.api_key = api_key

    try:
        session = stripe.checkout.Session.retrieve(session_id)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Eroare la verificarea statusului: {str(e)}")

    transaction = await db.payment_transactions.find_one({"session_id": session_id})
    order_id = transaction["order_id"] if transaction else None

    if session.payment_status == "paid" and transaction:
        if transaction.get("payment_status") != "paid":
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

    return PaymentStatusResponse(
        status=session.status,
        payment_status=session.payment_status,
        amount_total=(session.amount_total or 0) / 100,
        currency=session.currency,
        order_id=order_id
    )


@router.post("/webhook/stripe")
async def stripe_webhook(request: Request):
    payload = await request.body()
    sig_header = request.headers.get("stripe-signature")
    webhook_secret = os.environ.get("STRIPE_WEBHOOK_SECRET")

    try:
        if webhook_secret and sig_header:
            event = stripe.Webhook.construct_event(payload, sig_header, webhook_secret)
        else:
            event = await request.json()
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Webhook invalid: {str(e)}")

    event_type = event.get("type")
    data_object = event.get("data", {}).get("object", {})

    if event_type == "checkout.session.completed":
        session_id = data_object.get("id")

        transaction = await db.payment_transactions.find_one({"session_id": session_id})
        if transaction:
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

            await db.orders.update_one(
                {"id": transaction["order_id"]},
                {
                    "$set": {
                        "payment_status": "paid",
                        "payment_method": "card_online",
                        "status": "confirmed"
                    }
                }
            )

    return {"status": "success"}