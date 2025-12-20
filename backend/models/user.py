from datetime import datetime

def user_schema(user):
    return {
        "supabase_id": user["supabase_id"],
        "email": user["email"],
        "created_at": datetime.utcnow(),
        "last_login": datetime.utcnow(),
        "role": "user",
        "preferences": {},
    }