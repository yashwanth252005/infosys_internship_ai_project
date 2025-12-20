# backend/models/dog_model.py
import io
import os
import json
from PIL import Image
import torch
import torch.nn.functional as F
import timm
import numpy as np
from torchvision import transforms


class DogModel:
    def __init__(self, model_path: str, class_indices_path: str, device: str = "cpu"):
        self.device = torch.device(device)
        self.model_path = model_path

        # -------------------------------
        # Load class index
        # -------------------------------
        self.idx2class = self._load_class_map(class_indices_path)
        self.num_classes = len(self.idx2class)

        # -------------------------------
        # Model config (NEW MODEL)
        # -------------------------------
        self.model_name = "mobilenetv3_large_100"
        self.model = None  # lazy load

        # -------------------------------
        # Preprocessing (MobileNetV3)
        # -------------------------------
        self.preprocess = transforms.Compose([
            transforms.Resize((224, 224)),
            transforms.ToTensor()
        ])

    # -------------------------------------------------
    # Load class index JSON
    # Expected format:
    # { "affenpinscher": 0, "afghan_hound": 1, ... }
    # -------------------------------------------------
    def _load_class_map(self, path: str):
        with open(path, "r", encoding="utf-8") as f:
            data = json.load(f)

        # Convert → {index: breed_name}
        idx2class = {int(v): k.replace("_", " ") for k, v in data.items()}
        return idx2class

    # -------------------------------------------------
    # Lazy model loader
    # -------------------------------------------------
    def _load_model(self):
        if self.model is not None:
            return

        if not os.path.exists(self.model_path):
            raise FileNotFoundError(f"Model file not found: {self.model_path}")

        print("🔹 Loading dog breed model...")

        model = timm.create_model(
            self.model_name,
            pretrained=False,
            num_classes=self.num_classes
        )

        ckpt = torch.load(self.model_path, map_location=self.device)

        # Support different checkpoint styles
        state = ckpt.get("state", ckpt) if isinstance(ckpt, dict) else ckpt
        model.load_state_dict(state, strict=False)

        model.to(self.device)
        model.eval()

        self.model = model
        print("✅ Dog breed model loaded successfully")

    # -------------------------------------------------
    # Predict from image bytes
    # -------------------------------------------------
    def predict_from_bytes(self, image_bytes: bytes, topk: int = 5):
        self._load_model()

        img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        x = self.preprocess(img).unsqueeze(0).to(self.device)

        with torch.no_grad():
            outputs = self.model(x)
            probs = torch.softmax(outputs, dim=1)[0].cpu().numpy()

        topk_idx = probs.argsort()[-topk:][::-1]

        results = []
        for idx in topk_idx:
            results.append({
                "breed": self.idx2class.get(int(idx), "Unknown"),
                "confidence": float(probs[idx])
            })

        return results