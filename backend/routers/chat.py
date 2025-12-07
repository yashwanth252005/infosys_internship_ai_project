from fastapi import APIRouter, HTTPException, UploadFile, File, Form
import os
from backend.services.gemini_service import ask_gemini
from backend.utils.json_loader import JSONStore
from backend.models.dog_model import DogModel

router = APIRouter()

# env paths
BREEDS_JSON = os.getenv("BREEDS_JSON_PATH", "../json_files/basic_info_dogs/breeds_info.json")
DIETS_JSON = os.getenv("DIETS_JSON_PATH", "../json_files/diets_info/diets_info.json")
SAMPLE_Q = os.getenv("SAMPLE_QUESTIONS_PATH", "../json_files/sample_questions/sample_questions.json")
CLASS_IDX = os.getenv("CLASS_INDICES_PATH", "../json_files/class_indices.json")
MODEL_PATH = os.getenv("MODEL_PATH", "../models/best_top1_90.4645_ep5.pth")

store = JSONStore(BREEDS_JSON, DIETS_JSON, SAMPLE_Q, CLASS_IDX)
dog_model = DogModel(MODEL_PATH, CLASS_IDX, device="cpu")


def extract_breed_from_message(message: str):
    msg = message.lower()
    for breed_key in store.breeds.keys():  # already normalized
        if breed_key in msg:
            return breed_key
    return None


@router.post("/message")
async def chat_message(
    message: str = Form(...),
    image: UploadFile | None = File(None)
):
    # 🔥 FIX FOR SWAGGER EMPTY STRING BUG
    # Swagger sends image="" → treat it as no file
    if image is not None and isinstance(image, UploadFile) and image.filename == "":
        image = None

    # Safety check: if Swagger sends image as raw empty string (str)
    if isinstance(image, str):
        image = None

    breed_info = None
    diet_info = None
    predicted_breed = None
    detected_breed_key = None

    # 🖼️ CASE 1 — Image provided
    if image:
        img_bytes = await image.read()
        preds = dog_model.predict_from_bytes(img_bytes, topk=1)
        if preds:
            predicted_breed = preds[0]["breed"]
            key = predicted_breed.lower().replace("_", " ").strip()
            detected_breed_key = key
            breed_info = store.get_breed_info(key)
            diet_info = store.get_diet_plan(key)

    # 📝 CASE 2 — Extract breed from text
    if not detected_breed_key:
        detected_breed_key = extract_breed_from_message(message)

    if detected_breed_key and not breed_info:
        breed_info = store.get_breed_info(detected_breed_key)

    if detected_breed_key and not diet_info:
        diet_info = store.get_diet_plan(detected_breed_key)

    # 🤖 Ask Gemini
    try:
        answer = ask_gemini(
            message,
            breed_info=breed_info,
            diet_info=diet_info,
            sample_questions=store.sample_questions
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Gemini call failed: {e}")

    return {
        "predicted_breed": predicted_breed,
        "breed_used": detected_breed_key,
        "answer": answer,
        "source_data_used": {
            "breed_provided": bool(breed_info),
            "diet_provided": bool(diet_info)
        }
    }