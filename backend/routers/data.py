from fastapi import APIRouter, HTTPException
import os
from utils.json_loader import JSONStore

router = APIRouter()

# paths from environment
import os
BREEDS_JSON = os.getenv("BREEDS_JSON_PATH", "../json_files/basic_info_dogs/breeds_info.json")
DIETS_JSON = os.getenv("DIETS_JSON_PATH", "../json_files/diets_info/diets_info.json")
SAMPLE_Q = os.getenv("SAMPLE_QUESTIONS_PATH", "../json_files/sample_questions/sample_questions.json")
CLASS_IDX = os.getenv("CLASS_INDICES_PATH", "../json_files/class_indices.json")

store = JSONStore(BREEDS_JSON, DIETS_JSON, SAMPLE_Q, CLASS_IDX)

@router.get("/sample-questions")
def get_sample_questions():
    return {"questions": store.sample_questions}

@router.get("/breed/{breed_name}")
def get_breed_info(breed_name: str):
    info = store.get_breed_info(breed_name)
    if not info:
        raise HTTPException(status_code=404, detail="Breed info not found")
    return info

@router.get("/diet/{breed_name}/{life_stage}")
def get_diet_info(breed_name: str, life_stage: str):
    info = store.get_diet_info(breed_name, life_stage)
    if not info:
        raise HTTPException(status_code=404, detail="Diet info not found")
    return info

@router.get("/all-breeds")
def get_all_breeds():
    return {"breeds": list(store.breeds.keys())}