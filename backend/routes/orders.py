# backend/routes/orders.py
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List
from datetime import datetime
from utils.mongo import orders

router = APIRouter(prefix="/api/orders", tags=["Orders"])

class OrderItem(BaseModel):
    id: str
    name: str
    price: float
    quantity: int
    image: str

class OrderCreate(BaseModel):
    user_id: str   # supabase user id
    items: List[OrderItem]
    total: float

@router.post("/")
async def create_order(order: OrderCreate):
    try:
        order_doc = {
            "user_id": order.user_id,
            "items": [item.dict() for item in order.items],
            "total": order.total,
            "created_at": datetime.utcnow(),
            "status": "placed"
        }

        await orders.insert_one(order_doc)
        return {"message": "Order placed successfully"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@router.get("/user/{user_id}")
async def get_user_orders(user_id: str):
    try:
        cursor = orders.find(
            {"user_id": user_id}
        ).sort("created_at", -1)

        user_orders = []
        async for order in cursor:
            order["_id"] = str(order["_id"])
            user_orders.append(order)

        return user_orders

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))