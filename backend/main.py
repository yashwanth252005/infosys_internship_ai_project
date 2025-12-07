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
from backend.routers import data, predict, chat
from backend.routers import data_api

app = FastAPI(title="DogBreedChat Backend")

# Allow your frontend origin (set properly in production)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(data.router, prefix="/api/data", tags=["data"])
app.include_router(predict.router, prefix="/api/predict", tags=["predict"])
app.include_router(chat.router, prefix="/api/chat", tags=["chat"])
app.include_router(data_api.router, prefix="/api/data", tags=["data"])

@app.get("/")
def root():
    return {"status": "ok", "message": "DogBreedChat backend running"}