# backend/models/dog_model.py
import io, os
from PIL import Image
import torch
import torch.nn.functional as F
from pathlib import Path
import timm
import numpy as np
from torchvision import transforms
import albumentations as A
from albumentations.pytorch import ToTensorV2
import json

class DogModel:
    def __init__(self, model_path: str, class_indices_path: str, device: str = "cpu"):
        self.device = torch.device(device)
        self.model_path = model_path
        self.class_map = self._load_class_map(class_indices_path)
        # Adjust model name exactly as training; use the same timm model string
        self.model_name = 'efficientnetv2_rw_s.ra2_in1k'  # <-- match training
        self.num_classes = len(self.class_map)
        self.model = self._load_model_timm(self.model_path)
        self.model.to(self.device)
        self.model.eval()

        # Colab preprocessing (match exactly)
        self.INPUT_SIZE = 384
        self.tf = A.Compose([
            A.Resize(self.INPUT_SIZE, self.INPUT_SIZE),
            A.Normalize(mean=(0.485,0.456,0.406), std=(0.229,0.224,0.225)),
            ToTensorV2()
        ])

    def _load_class_map(self, path):
        with open(path, "r", encoding="utf-8") as f:
            data = json.load(f)
        # Your class_indices has synset keys -> integer index values
        # Convert to {index: breed_name}
        fixed_map = {}
        for synset, idx in data.items():
            breed_name = synset.split("-")[-1].replace("_", " ")
            fixed_map[int(idx)] = breed_name
        return fixed_map

    def _load_model_timm(self, path):
        # Load checkpoint (pth) into timm model
        if not os.path.exists(path):
            raise FileNotFoundError(f"Model file not found at {path}")
        # create model architecture
        model = timm.create_model(self.model_name, pretrained=False, num_classes=self.num_classes)
        ck = torch.load(path, map_location='cpu')
        # ck could be dict with 'model_state' or raw state_dict
        state = ck.get('model_state', ck) if isinstance(ck, dict) else ck
        # If state contains 'state_dict' nested, try to extract
        if isinstance(state, dict) and 'state_dict' in state:
            state = state['state_dict']
        # Try to load; allow missing keys (strict=False)
        try:
            model.load_state_dict(state, strict=False)
        except Exception as e:
            # some checkpoints have module. prefix: try to fix keys
            new_state = {}
            for k, v in state.items():
                nk = k.replace('module.', '')  # remove DataParallel prefix
                new_state[nk] = v
            model.load_state_dict(new_state, strict=False)
        return model

    def predict_from_bytes(self, image_bytes: bytes, topk: int = 5):
        img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        img_np = np.array(img)
        data = self.tf(image=img_np)
        x = data['image'].unsqueeze(0).to(self.device)  # 1,C,H,W
        with torch.no_grad():
            out = self.model(x)
            probs = F.softmax(out, dim=1).cpu().numpy()[0]
        topk_idx = probs.argsort()[-topk:][::-1]
        results = []
        for i in topk_idx:
            results.append({"breed": self.class_map.get(int(i), "Unknown"), "confidence": float(probs[i])})
        return results