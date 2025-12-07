import json

class JSONStore:
    def __init__(self, breeds_path, diets_path, samples_path, class_idx_path):
        self.breeds = self._load_breeds(breeds_path)
        self.diets = self._load_diets(diets_path)
        self.samples = self._load_json(samples_path)
        self.sample_questions = self.samples   # required by chat.py
        self.class_indices = self._load_json(class_idx_path)

    # ------------------------------------
    # Normalization function (VERY IMPORTANT)
    # ------------------------------------
    def _normalize(self, name: str):
        if not name:
            return ""
        return (
            name.strip()
            .lower()
            .replace("_", " ")
            .replace("-", " ")
        )

    # ------------------------------------
    # Simple JSON loader
    # ------------------------------------
    def _load_json(self, path):
        with open(path, "r", encoding="utf-8") as f:
            return json.load(f)

    # ------------------------------------
    # BREEDS INFO LOADER (breeds_info.json)
    # Converts LIST → DICTIONARY (normalized)
    # ------------------------------------
    def _load_breeds(self, path):
        with open(path, "r", encoding="utf-8") as f:
            data = json.load(f)

        # CASE 1: LIST FORMAT
        if isinstance(data, list):
            fixed = {}
            for entry in data:
                breed = self._normalize(entry.get("Breed", ""))
                if breed:
                    fixed[breed] = entry
            return fixed

        # CASE 2: DICTIONARY FORMAT
        return {self._normalize(k): v for k, v in data.items()}

    # ------------------------------------
    # DIETS INFO LOADER (diets_info.json)
    # Converts LIST → DICTIONARY (normalized)
    # ------------------------------------
    def _load_diets(self, path):
        with open(path, "r", encoding="utf-8") as f:
            data = json.load(f)

        # CASE 1: LIST FORMAT
        if isinstance(data, list):
            fixed = {}
            for entry in data:
                breed = self._normalize(entry.get("name", ""))
                if breed:
                    fixed[breed] = entry.get("diet_plan")
            return fixed

        # CASE 2: DICTIONARY FORMAT
        fixed = {}
        for k, v in data.items():
            fixed[self._normalize(k)] = v
        return fixed

    # ------------------------------------
    # Helper: get breed info
    # ------------------------------------
    def get_breed_info(self, breed_name: str):
        key = self._normalize(breed_name)
        return self.breeds.get(key)

    # ------------------------------------
    # Helper: get diet plan
    # ------------------------------------
    def get_diet_plan(self, breed_name: str):
        key = self._normalize(breed_name)
        return self.diets.get(key)