# backend/utils/mongo.py
from motor.motor_asyncio import AsyncIOMotorClient
import os

MONGO_URI = os.getenv("MONGO_URI")
DB_NAME = os.getenv("MONGO_DB_NAME", "dog_project")

if not MONGO_URI:
    raise RuntimeError("MONGO_URI not set in environment variables")

client = AsyncIOMotorClient(MONGO_URI)
db = client[DB_NAME]

# Collections
users = db["users"]
chat_history = db["chat_history"]
chat_sessions = db["chat_sessions"]  # ← NEW: For chat session management
predictions = db["predictions"]
orders = db["orders"]

# ✅ Ensure indexes (runs once, Mongo ignores duplicates)
async def ensure_indexes():
    await users.create_index("email", unique=True)
    await chat_sessions.create_index([("user_id", 1), ("created_at", -1)])
    await chat_history.create_index([("user_id", 1), ("session_id", 1), ("created_at", 1)])