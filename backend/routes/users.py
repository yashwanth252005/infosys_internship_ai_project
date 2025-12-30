# backend/routes/users.py
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from datetime import datetime
from utils.mongo import users

router = APIRouter(prefix="/api/users", tags=["Users"])

class UserSyncSchema(BaseModel):
    email: str
    supabase_id: str

@router.post("/sync")
async def sync_user(payload: UserSyncSchema):
    try:
        existing_user = await users.find_one({"email": payload.email})

        if existing_user:
            # Update supabase_id if changed
            await users.update_one(
                {"email": payload.email},
                {"$set": {"supabase_id": payload.supabase_id}}
            )
            return {"status": "exists"}

        await users.insert_one({
            "email": payload.email,
            "supabase_id": payload.supabase_id,
            "created_at": datetime.utcnow(),
        })

        return {"status": "created"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))