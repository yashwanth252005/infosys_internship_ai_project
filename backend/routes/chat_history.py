# backend/routes/chat_history.py
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from datetime import datetime
from bson import ObjectId
from backend.utils.mongo import chat_history, chat_sessions

router = APIRouter(prefix="/api/chat-history", tags=["Chat History"])

class ChatMessage(BaseModel):
    user_id: str
    session_id: str  # ← NEW: Required session_id
    role: str      # user | bot
    message: str
    image: str | None = None

@router.post("/")
async def save_message(msg: ChatMessage):
    try:
        doc = {
            "user_id": msg.user_id,
            "session_id": msg.session_id,  # ← NEW: Save with session
            "role": msg.role,
            "message": msg.message,
            "image": msg.image,
            "created_at": datetime.utcnow()
        }
        await chat_history.insert_one(doc)
        
        # Update session's updated_at and message_count
        await chat_sessions.update_one(
            {"_id": ObjectId(msg.session_id)},
            {
                "$set": {"updated_at": datetime.utcnow()},
                "$inc": {"message_count": 1}
            }
        )
        
        return {"message": "Chat saved"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/user/{user_id}")
async def get_user_chats(user_id: str):
    """DEPRECATED: Get all messages for a user (use session-specific endpoint)"""
    try:
        cursor = chat_history.find(
            {"user_id": user_id}
        ).sort("created_at", 1)

        chats = []
        async for chat in cursor:
            chat["_id"] = str(chat["_id"])
            chats.append(chat)

        return chats
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))