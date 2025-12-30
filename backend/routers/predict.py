# backend/routers/predict.py
from fastapi import APIRouter, File, UploadFile, HTTPException
import os

from models.dog_model import DogModel
from services.gemini_service import is_dog_image   # ✅ NEW IMPORT

print("MODEL PATH FROM ENV:", os.getenv("MODEL_PATH"))

router = APIRouter()

MODEL_PATH = os.getenv("MODEL_PATH", "../models/effnetv2_s_package.zip")
CLASS_IDX = os.getenv("CLASS_INDICES_PATH", "../json_files/class_indices.json")

# Initialize single global model instance (load on import).
dog_model = DogModel(MODEL_PATH, CLASS_IDX, device="cpu")


@router.post("/")
async def predict(file: UploadFile = File(...), topk: int = 1):

    # Read file bytes
    contents = await file.read()

    # --------------------------------------------------------
    # 🔥 NEW STEP: Validate whether uploaded image is a dog
    # --------------------------------------------------------
    try:
        dog_check = is_dog_image(contents)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Dog image validation failed: {e}")

    if not dog_check:
        return {
            "is_dog": False,
            "message": "It has been detected that the uploaded image is not a dog. Please upload a dog image."
        }

    # --------------------------------------------------------
    # If dog → continue with breed prediction
    # --------------------------------------------------------
    try:
        results = dog_model.predict_from_bytes(contents, topk=topk)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    return {
        "is_dog": True,
        "predictions": results
    }