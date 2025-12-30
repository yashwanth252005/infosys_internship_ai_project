# backend/main.py
from dotenv import load_dotenv
import os
from pathlib import Path

# force load with absolute path
env_path = Path(__file__).resolve().parent / ".env"
print("Loading ENV FROM:", env_path)
load_dotenv(dotenv_path=env_path)

print("MODEL PATH FROM ENV AFTER LOADING:", os.getenv("MODEL_PATH"))


from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import data_api, predict, chat
from routes.users import router as users_router
from routes.orders import router as orders_router
from routes.chat_history import router as chat_history_router
from routes.chat_sessions import router as chat_sessions_router  # ← NEW
from utils.mongo import ensure_indexes

# from routers import data
app = FastAPI(title="DogBreedChat Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",  # Vite frontend
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Allow your frontend origin (set properly in production)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# app.include_router(data.router, prefix="/api/data", tags=["data"])
app.include_router(predict.router, prefix="/api/predict", tags=["predict"])
app.include_router(chat.router, prefix="/api/chat", tags=["chat"])
app.include_router(data_api.router, prefix="/api/data", tags=["data"])
app.include_router(users_router)
app.include_router(orders_router)
app.include_router(chat_history_router)
app.include_router(chat_sessions_router)  # ← NEW

@app.get("/")
def root():
    return {"status": "ok", "message": "DogBreedChat backend running"}

@app.on_event("startup")
async def startup_event():
    await ensure_indexes()