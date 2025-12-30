# backend/routes/chat_sessions.py
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from datetime import datetime
from bson import ObjectId
from utils.mongo import chat_sessions, chat_history

router = APIRouter(prefix="/api/chat-sessions", tags=["Chat Sessions"])

class CreateSessionRequest(BaseModel):
    user_id: str
    session_name: str

class UpdateSessionRequest(BaseModel):
    session_name: str

@router.post("/")
async def create_session(data: CreateSessionRequest):
    """Create a new chat session"""
    try:
        # Check if user has an active session
        await chat_sessions.update_many(
            {"user_id": data.user_id, "is_active": True},
            {"$set": {"is_active": False}}
        )

        session_doc = {
            "user_id": data.user_id,
            "session_name": data.session_name,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
            "message_count": 0,
            "is_active": True
        }
        
        result = await chat_sessions.insert_one(session_doc)
        
        return {
            "session_id": str(result.inserted_id),
            "session_name": data.session_name,
            "message": "Session created"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/user/{user_id}")
async def get_user_sessions(user_id: str):
    """Get all chat sessions for a user"""
    try:
        cursor = chat_sessions.find(
            {"user_id": user_id}
        ).sort("updated_at", -1)

        sessions = []
        async for session in cursor:
            # Get last message preview
            last_message = await chat_history.find_one(
                {"session_id": str(session["_id"])},
                sort=[("created_at", -1)]
            )
            
            sessions.append({
                "_id": str(session["_id"]),
                "session_name": session["session_name"],
                "created_at": session["created_at"],
                "updated_at": session["updated_at"],
                "message_count": session.get("message_count", 0),
                "is_active": session.get("is_active", False),
                "last_message": last_message.get("message", "") if last_message else ""
            })

        return sessions
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{session_id}/messages")
async def get_session_messages(session_id: str):
    """Get all messages for a specific session"""
    try:
        cursor = chat_history.find(
            {"session_id": session_id}
        ).sort("created_at", 1)

        messages = []
        async for msg in cursor:
            messages.append({
                "_id": str(msg["_id"]),
                "role": msg["role"],
                "message": msg["message"],
                "image": msg.get("image"),
                "created_at": msg["created_at"]
            })

        return messages
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.put("/{session_id}")
async def update_session(session_id: str, data: UpdateSessionRequest):
    """Update session name"""
    try:
        result = await chat_sessions.update_one(
            {"_id": ObjectId(session_id)},
            {
                "$set": {
                    "session_name": data.session_name,
                    "updated_at": datetime.utcnow()
                }
            }
        )

        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Session not found")

        return {"message": "Session updated"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/{session_id}")
async def delete_session(session_id: str):
    """Delete a chat session and all its messages"""
    try:
        # Delete all messages in this session
        await chat_history.delete_many({"session_id": session_id})
        
        # Delete the session
        result = await chat_sessions.delete_one({"_id": ObjectId(session_id)})

        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Session not found")

        return {"message": "Session deleted"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/{session_id}/set-active")
async def set_active_session(session_id: str, user_id: str):
    """Set a session as active for the user"""
    try:
        # Deactivate all other sessions
        await chat_sessions.update_many(
            {"user_id": user_id, "is_active": True},
            {"$set": {"is_active": False}}
        )

        # Activate the selected session
        result = await chat_sessions.update_one(
            {"_id": ObjectId(session_id)},
            {"$set": {"is_active": True}}
        )

        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Session not found")

        return {"message": "Session activated"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
