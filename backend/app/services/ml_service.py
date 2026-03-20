import os
import base64
import json
import requests
from dotenv import load_dotenv

load_dotenv()

DISEASE_CLASSES = [
    "Apple___Apple_scab", "Apple___Black_rot", "Apple___Cedar_apple_rust", "Apple___healthy",
    "Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot", "Corn_(maize)___Common_rust_", "Corn_(maize)___Northern_Leaf_Blight", "Corn_(maize)___healthy",
    "Grape___Black_rot", "Grape___Esca_(Black_Measles)", "Grape___Leaf_blight_(Isariopsis_Leaf_Spot)", "Grape___healthy",
    "Potato___Early_blight", "Potato___Late_blight", "Potato___healthy",
    "Tomato___Bacterial_spot", "Tomato___Early_blight", "Tomato___Late_blight", "Tomato___Leaf_Mold", "Tomato___Septoria_leaf_spot", "Tomato___Spider_mites Two-spotted_spider_mite", "Tomato___Target_Spot", "Tomato___Tomato_Yellow_Leaf_Curl_Virus", "Tomato___Tomato_mosaic_virus", "Tomato___healthy"
]

class MLService:
    def __init__(self):
        # We fetch the API key from your completely updated .env file!
        self.api_key = os.getenv("LLM_API_KEY")
        self.api_url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={self.api_key}"

    def predict(self, image_bytes: bytes):
        try:
            if not self.api_key or self.api_key == "your_llm_api_key_here":
                return {
                    "disease": "Missing API Key", 
                    "confidence": 0.0
                }

            # 1. Encode the image so Gemini can read it over the internet!
            encoded_image = base64.b64encode(image_bytes).decode('utf-8')

            # 2. Incredible upgrade: We no longer limit to 25 classes! 
            # We tell Gemini to identify ANY plant and ANY disease accurately!
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
                            {
                                "inline_data": {
                                    "mime_type": "image/jpeg",
                                    "data": encoded_image
                                }
                            }
                        ]
                    }
                ],
                "generationConfig": {
                    "temperature": 0.2,
                    "response_mime_type": "application/json", # Forces Gemini to output pure JSON!
                }
            }

            headers = {"Content-Type": "application/json"}
            
            # 3. Call the incredibly fast Google Gemini API
            response = requests.post(self.api_url, headers=headers, json=payload)
            response.raise_for_status()
            
            response_data = response.json()
            raw_text = response_data['candidates'][0]['content']['parts'][0]['text'].strip()
            
            # Cleanup any markdown artifacts just in case
            if raw_text.startswith("```json"):
                raw_text = raw_text[7:]
            if raw_text.endswith("```"):
                raw_text = raw_text[:-3]
                
            prediction = json.loads(raw_text.strip())
            
            return {
                "disease": prediction.get("disease", "Unknown"),
                "confidence": prediction.get("confidence", 0.0)
            }

        except Exception as e:
            print(f"Error during Gemini API prediction: {e}")
            return {
                "disease": "Error processing image",
                "confidence": 0.0
            }

ml_service = MLService()
