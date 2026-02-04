from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
import os
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.schemas.schemas import PredictionResponse, ChatRequest
from app.services.ml_service import ml_service
from app.services.llm_service import llm_service
from app.models.models import ClassificationHistory
from datetime import datetime

router = APIRouter()

@router.post("/predict", response_model=PredictionResponse)
async def predict_disease(file: UploadFile = File(...), db: Session = Depends(get_db)):
    # 1. Save file to disk
    upload_dir = "uploads"
    os.makedirs(upload_dir, exist_ok=True)
    file_path = os.path.join(upload_dir, file.filename)
    
    with open(file_path, "wb") as buffer:
        content = await file.read()
        buffer.write(content)
        
    # 2. ML Prediction (pass the saved file path or content)
    # We pass the content bytes as before since ML service expects bytes
    prediction = ml_service.predict(content)
    
    # 3. LLM Explanation
    explanation = llm_service.get_disease_info(prediction["disease"])
    
    # 4. Save to DB
    db_record = ClassificationHistory(
        image_path=file_path, 
        predicted_disease=prediction["disease"],
        confidence_score=prediction["confidence"],
        timestamp=datetime.utcnow()
    )
    db.add(db_record)
    db.commit()
    db.refresh(db_record)
    
    return {
        "filename": file.filename,
        "disease": prediction["disease"],
        "confidence": prediction["confidence"],
        "llm_explanation": explanation,
        "timestamp": db_record.timestamp
    }

@router.post("/chat")
def chat_with_llm(request: ChatRequest):
    response = llm_service.chat(request.message)
    return {"response": response}

@router.get("/history")
def get_history(db: Session = Depends(get_db)):
    return db.query(ClassificationHistory).all()
