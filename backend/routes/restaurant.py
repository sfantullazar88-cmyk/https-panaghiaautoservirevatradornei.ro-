from fastapi import APIRouter, HTTPException
from typing import List
from datetime import datetime, timezone

router = APIRouter(prefix="/restaurant", tags=["Restaurant"])


# This will be set from server.py
db = None


def set_db(database):
    global db
    db = database


# ============== RESTAURANT INFO ==============

@router.get("/info", response_model=dict)
async def get_restaurant_info():
    """Get restaurant information"""
    info = await db.restaurant_info.find_one({}, {"_id": 0})
    if not info:
        # Return default info if none exists
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
                "weekend": "Închis"
            },
            "hero_title": "Mancare gatita zilnic,",
            "hero_title2": "gustoasa si satioasa",
            "hero_subtitle": "Autoservire & delivery rapid in Vatra Dornei",
            "hero_image": "https://customer-assets.emergentagent.com/job_food-delivery-240/artifacts/25k2bpta_4.jpg"
        }
    return info


@router.put("/info", response_model=dict)
async def update_restaurant_info(info: dict):
    """Update restaurant information"""
    # Upsert the restaurant info (only one document)
    result = await db.restaurant_info.find_one_and_update(
        {},
        {"$set": info},
        upsert=True,
        return_document=True
    )
    
    result.pop("_id", None)
    return result


# ============== REVIEWS ==============

@router.get("/reviews", response_model=List[dict])
async def get_reviews(approved_only: bool = True):
    """Get all reviews"""
    query = {}
    if approved_only:
        query["is_approved"] = True
    
    reviews = await db.reviews.find(query, {"_id": 0}).sort("created_at", -1).to_list(100)
    
    # Convert datetime strings if needed
    for review in reviews:
        if isinstance(review.get('created_at'), str):
            review['created_at'] = datetime.fromisoformat(review['created_at'])
    
    return reviews


@router.post("/reviews", response_model=dict)
async def create_review(review_data: dict):
    """Create a new review"""
    from models import Review, ReviewCreate
    
    review_create = ReviewCreate(**review_data)
    review = Review(**review_create.model_dump())
    doc = review.model_dump()
    
    # Convert datetime to ISO string for MongoDB
    doc['created_at'] = doc['created_at'].isoformat()
    
    await db.reviews.insert_one(doc)
    
    # Update review count
    await db.restaurant_info.update_one(
        {},
        {"$inc": {"review_count": 1}}
    )
    
    doc.pop('_id', None)
    return doc


@router.delete("/reviews/{review_id}")
async def delete_review(review_id: str):
    """Delete a review"""
    result = await db.reviews.delete_one({"id": review_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Review not found")
    
    # Update review count
    await db.restaurant_info.update_one(
        {},
        {"$inc": {"review_count": -1}}
    )
    
    return {"message": "Review deleted successfully"}


@router.patch("/reviews/{review_id}/approve", response_model=dict)
async def approve_review(review_id: str, approval_data: dict):
    """Approve or reject a review"""
    result = await db.reviews.find_one_and_update(
        {"id": review_id},
        {"$set": {"is_approved": approval_data.get('is_approved', True)}},
        return_document=True
    )
    
    if not result:
        raise HTTPException(status_code=404, detail="Review not found")
    
    result.pop("_id", None)
    return result
