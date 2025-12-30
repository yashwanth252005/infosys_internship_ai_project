# backend/routers/chat.py
from fastapi import APIRouter, HTTPException, UploadFile, File, Form
import os

from services.gemini_service import ask_gemini, is_dog_image
from utils.json_loader import JSONStore
from models.dog_model import DogModel

router = APIRouter()

# -------------------------------------------------
# ENV PATHS
# -------------------------------------------------
BREEDS_JSON = os.getenv("BREEDS_JSON_PATH", "../json_files/basic_info_dogs/breeds_info.json")
DIETS_JSON = os.getenv("DIETS_JSON_PATH", "../json_files/diets_info/diets_info.json")
SAMPLE_Q = os.getenv("SAMPLE_QUESTIONS_PATH", "../json_files/sample_questions/sample_questions.json")
CLASS_IDX = os.getenv("CLASS_INDICES_PATH", "../json_files/class_indices.json")
MODEL_PATH = os.getenv("MODEL_PATH", "../models/best_top1_90.4645_ep5.pth")

store = JSONStore(BREEDS_JSON, DIETS_JSON, SAMPLE_Q, CLASS_IDX)
dog_model = DogModel(MODEL_PATH, CLASS_IDX, device="cpu")

# -------------------------------------------------
# HELPERS
# -------------------------------------------------
def extract_breed_from_message(message: str):
    msg = message.lower()
    for breed_key in store.breeds.keys():
        if breed_key in msg:
            return breed_key
    return None


def is_breed_identification_question(message: str) -> bool:
    msg = message.lower().strip()

    exact_patterns = [
        "what is the breed",
        "what breed is this",
        "what breed is the dog",
        "which breed is this",
        "identify the breed",
        "breed name of the dog",
        "what is the breed name"
    ]

    return any(p in msg for p in exact_patterns)


# -------------------------------------------------
# CHAT ENDPOINT
# -------------------------------------------------
@router.post("/message")
async def chat_message(
    message: str = Form(...),
    image: UploadFile | None = File(None)
):
    # Swagger bug fix
    if image is not None and isinstance(image, UploadFile) and image.filename == "":
        image = None
    if isinstance(image, str):
        image = None

    breed_info = None
    diet_info = None
    predicted_breed = None
    detected_breed_key = None

    # -------------------------------------------------
    # 🖼️ IMAGE FLOW
    # -------------------------------------------------
    if image:
        img_bytes = await image.read()

        # 1️⃣ Validate dog image
        try:
            is_dog = is_dog_image(img_bytes)
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Dog image validation failed: {e}")

        if not is_dog:
            return {
                "predicted_breed": None,
                "breed_used": None,
                "answer": "It has been detected that the uploaded image is not a dog. Please upload a dog image.",
                "source_data_used": {
                    "breed_provided": False,
                    "diet_provided": False
                }
            }

        # 2️⃣ Predict breed
        preds = dog_model.predict_from_bytes(img_bytes, topk=1)
        if preds:
            predicted_breed = preds[0]["breed"]
            confidence = preds[0]["confidence"]

            detected_breed_key = predicted_breed.lower().replace("_", " ").strip()
            breed_info = store.get_breed_info(detected_breed_key)
            diet_info = store.get_diet_plan(detected_breed_key)

            # ⭐ IMAGE-SPECIFIC QUESTION → DIRECT ANSWER
            if is_breed_identification_question(message):
                return {
                    "predicted_breed": predicted_breed,
                    "confidence": round(confidence, 4),
                    "answer": f"The dog in the image is a {predicted_breed}.",
                    "source": "image_classification_model"
                }

    # -------------------------------------------------
    # 📝 TEXT FLOW
    # -------------------------------------------------
    if not detected_breed_key:
        detected_breed_key = extract_breed_from_message(message)

    if detected_breed_key and not breed_info:
        breed_info = store.get_breed_info(detected_breed_key)

    if detected_breed_key and not diet_info:
        diet_info = store.get_diet_plan(detected_breed_key)

    # -------------------------------------------------
    # 🤖 GEMINI FALLBACK
    # -------------------------------------------------
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