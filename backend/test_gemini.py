import os
import base64
import json
import requests
from dotenv import load_dotenv

load_dotenv()
api_key = os.getenv("LLM_API_KEY")

prompt_text = "You are a rigorous plant disease expert AI. The user has uploaded an image. " \
              "1) If the image is CLEARLY NOT a plant or leaf (e.g. computer mouse, desk, face), respond with: " \
              "{\"disease\": \"Not a Plant\", \"confidence\": 1.0}. " \
              "2) If it IS a plant, identify the species and the disease (or 'healthy'). " \
              "Format the disease string as 'PlantName - DiseaseName' (e.g., 'Basil - Healthy', 'Tomato - Early Blight'). " \
              "Provide a realistic confidence score between 0.6 and 1.0. " \
              "You MUST return ONLY a valid JSON object with exactly two keys: 'disease' (string) and 'confidence' (float). Do not include markdown blocks."

payload = {
    "contents": [
        {
            "parts": [
                {"text": prompt_text},
            ]
        }
    ],
    "generationConfig": {
        "temperature": 0.2,
        "response_mime_type": "application/json",
    }
}

try:
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={api_key}"
    headers = {"Content-Type": "application/json"}
    response = requests.post(url, headers=headers, json=payload)
    print("STATUS:", response.status_code)
    print("TEXT:", response.text)
except Exception as e:
    print(f"Error: {e}")
