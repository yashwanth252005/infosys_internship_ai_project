from fastapi import APIRouter, File, UploadFile, HTTPException

from backend.models.dog_model import DogModel
import os
print("MODEL PATH FROM ENV:", os.getenv("MODEL_PATH"))


router = APIRouter()

MODEL_PATH = os.getenv("MODEL_PATH", "../models/effnetv2_s_package.zip")
CLASS_IDX = os.getenv("CLASS_INDICES_PATH", "../json_files/class_indices.json")
# Initialize single global model instance (load on import).
dog_model = DogModel(MODEL_PATH, CLASS_IDX, device="cpu")

@router.post("/")
async def predict(file: UploadFile = File(...), topk: int = 1):
    contents = await file.read()
    try:
        results = dog_model.predict_from_bytes(contents, topk=topk)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    return {"predictions": results}