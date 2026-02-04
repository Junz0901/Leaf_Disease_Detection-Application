import numpy as np
import os
import cv2
import random

# List of classes your model will eventually predict
DISEASE_CLASSES = [
    "Apple___Apple_scab", "Apple___Black_rot", "Apple___Cedar_apple_rust", "Apple___healthy",
    "Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot", "Corn_(maize)___Common_rust_", "Corn_(maize)___Northern_Leaf_Blight", "Corn_(maize)___healthy",
    "Grape___Black_rot", "Grape___Esca_(Black_Measles)", "Grape___Leaf_blight_(Isariopsis_Leaf_Spot)", "Grape___healthy",
    "Potato___Early_blight", "Potato___Late_blight", "Potato___healthy",
    "Tomato___Bacterial_spot", "Tomato___Early_blight", "Tomato___Late_blight", "Tomato___Leaf_Mold", "Tomato___Septoria_leaf_spot", "Tomato___Spider_mites Two-spotted_spider_mite", "Tomato___Target_Spot", "Tomato___Tomato_Yellow_Leaf_Curl_Virus", "Tomato___Tomato_mosaic_virus", "Tomato___healthy"
]

class MLService:
    def __init__(self):
        self.model = None
        self.model_path = os.path.join("app", "models", "leaf_disease_model.h5") # Default path
        self._load_model()

    def _load_model(self):
        try:
            if os.path.exists(self.model_path):
                import tensorflow as tf
                self.model = tf.keras.models.load_model(self.model_path)
                print(f"✅ Success: Loaded model from {self.model_path}")
            else:
                print(f"⚠️ Warning: Model file not found at {self.model_path}. Using Mock Predictions.")
        except Exception as e:
            print(f"❌ Error loading model: {e}. Defaulting to Mock Predictions.")
            self.model = None

    def preprocess_image(self, image_bytes: bytes):
        """
        Real image preprocessing using OpenCV.
        Even without the model, this ensures the input file is a valid image.
        """
        # Convert bytes to numpy array
        nparr = np.frombuffer(image_bytes, np.uint8)
        
        # Decode image
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        if img is None:
            raise ValueError("Could not decode image")

        # Resize to standard model input size (e.g., 224x224)
        img_resized = cv2.resize(img, (224, 224))
        
        # Normalize to [0, 1]
        img_normalized = img_resized / 255.0
        
        # Add batch dimension (1, 224, 224, 3)
        img_batch = np.expand_dims(img_normalized, axis=0)
        
        return img_batch

    def predict(self, image_bytes: bytes):
        try:
            # 1. Real Preprocessing
            processed_image = self.preprocess_image(image_bytes)
            
            # 2. Prediction (Mock logic until model is loaded)
            if self.model:
                # predictions = self.model.predict(processed_image)
                # predicted_class = DISEASE_CLASSES[np.argmax(predictions)]
                # confidence = float(np.max(predictions))
                pass
            else:
                # Simulate processing time
                import time
                time.sleep(1)
                
                # DATA_MOCK: Return a random disease for demo purposes
                predicted_class = random.choice(DISEASE_CLASSES)
                confidence = round(random.uniform(0.70, 0.99), 2)

            return {
                "disease": predicted_class,
                "confidence": confidence
            }
        except Exception as e:
            print(f"Error during prediction: {e}")
            raise e

ml_service = MLService()
