from datetime import datetime
from typing import List

from fastapi import APIRouter, Depends, HTTPException

from routes.auth import get_current_admin


router = APIRouter(prefix="/restaurant", tags=["Restaurant"])


# Referința la baza de date este setată din server.py
db = None


def set_db(database):
    global db
    db = database


# ============== RESTAURANT INFO ==============

@router.get("/info", response_model=dict)
async def get_restaurant_info():
    """Returnează informațiile publice ale restaurantului."""

    info = await db.restaurant_info.find_one({}, {"_id": 0})

    if not info:
        return {
            "id": "default",
            "name": "Panaghia",
            "tagline": "Autoservire Vatra Dornei",
            "phone": "0746 254 162",
            "address": "Str. Dornelor nr. 10, Vatra Dornei",
            "email": "contact@panaghia.ro",
            "rating": 5.0,
            "review_count": 0,
            "schedule": {
                "weekdays": "11:00 - 17:00",
                "weekend": "Închis",
            },
            "hero_title": "Mâncare gătită zilnic,",
            "hero_title2": "gustoasă și sățioasă",
            "hero_subtitle": (
                "Meniul zilei, autoservire și livrare în Vatra Dornei"
            ),
            "hero_image": (
                "https://customer-assets.emergentagent.com/"
                "job_food-delivery-240/artifacts/25k2bpta_4.jpg"
            ),
        }

    return info


@router.put("/info", response_model=dict)
async def update_restaurant_info(
    info: dict,
    current_user: dict = Depends(get_current_admin),
):
    """Actualizează informațiile restaurantului — numai pentru Admin."""

    result = await db.restaurant_info.find_one_and_update(
        {},
        {
            "$set": {
                **info,
                "updated_by": current_user["email"],
            }
        },
        upsert=True,
        return_document=True,
    )

    if not result:
        raise HTTPException(
            status_code=500,
            detail="Informațiile restaurantului nu au putut fi salvate",
        )

    result.pop("_id", None)
    return result


# ============== PUBLIC TEAM ==============

@router.get("/team", response_model=dict)
async def get_public_team():
    """Returnează numai membrii activi ai echipei."""

    members = (
        await db.team.find(
            {"active": True},
            {"_id": 0},
        )
        .sort("order", 1)
        .to_list(100)
    )

    return {"members": members}


# ============== PUBLIC REVIEWS ==============

@router.get("/reviews", response_model=List[dict])
async def get_public_reviews():
    """Returnează numai recenziile aprobate."""

    reviews = (
        await db.reviews.find(
            {"is_approved": True},
            {"_id": 0},
        )
        .sort("created_at", -1)
        .to_list(100)
    )

    for review in reviews:
        if isinstance(review.get("created_at"), str):
            review["created_at"] = datetime.fromisoformat(
                review["created_at"]
            )

    return reviews


@router.post("/reviews", response_model=dict)
async def create_review(review_data: dict):
    """Creează o recenzie nouă, neaprobată implicit."""

    from models import Review, ReviewCreate

    review_create = ReviewCreate(**review_data)
    review = Review(**review_create.model_dump())
    doc = review.model_dump()

    # Vizitatorul nu își poate aproba singur recenzia.
    doc["is_approved"] = False

    if hasattr(doc.get("created_at"), "isoformat"):
        doc["created_at"] = doc["created_at"].isoformat()

    await db.reviews.insert_one(doc)

    doc.pop("_id", None)

    return {
        "message": "Recenzia a fost trimisă și așteaptă aprobarea",
        "review": doc,
    }