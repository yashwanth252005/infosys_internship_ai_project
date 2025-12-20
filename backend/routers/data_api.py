from fastapi import APIRouter, HTTPException
import os
from backend.utils.json_loader import JSONStore

router = APIRouter()

# Load JSONStore (same paths as chat + predict)
BREEDS_JSON = os.getenv("BREEDS_JSON_PATH", "../json_files/basic_info_dogs/breeds_info.json")
DIETS_JSON = os.getenv("DIETS_JSON_PATH", "../json_files/diets_info/diets_info.json")
SAMPLE_Q = os.getenv("SAMPLE_QUESTIONS_PATH", "../json_files/sample_questions/sample_questions.json")
CLASS_IDX = os.getenv("CLASS_INDICES_PATH", "../json_files/class_indices.json")

store = JSONStore(BREEDS_JSON, DIETS_JSON, SAMPLE_Q, CLASS_IDX)

@router.get("/sample-questions")
def get_sample_questions():
    return {"questions": store.sample_questions}

@router.get("/all-breeds")
def get_all_breeds():
    return {"breeds": list(store.breeds.keys())}

@router.get("/diet/{breed_name}/{life_stage}")
def get_diet_info(breed_name: str, life_stage: str):
    info = store.get_diet_info(breed_name, life_stage)
    if not info:
        raise HTTPException(status_code=404, detail="Diet info not found")
    return info

# -------------------------
# GET BREED INFO
# -------------------------
@router.get("/breed/{breed_name}")
async def get_breed_info(breed_name: str):

    normalized = store._normalize(breed_name)
    data = store.get_breed_info(normalized)

    if not data:
        raise HTTPException(status_code=404, detail=f"Breed '{breed_name}' not found in database.")

    return {
        "breed": normalized,
        "data": data
    }


# -------------------------
# GET DIET INFO
# -------------------------
@router.get("/diet/{breed_name}")
async def get_diet_info(breed_name: str):

    normalized = store._normalize(breed_name)
    diet = store.get_diet_plan(normalized)

    if not diet:
        raise HTTPException(status_code=404, detail=f"Diet plan for '{breed_name}' not found.")

    return {
        "breed": normalized,
        "diet": diet
    }