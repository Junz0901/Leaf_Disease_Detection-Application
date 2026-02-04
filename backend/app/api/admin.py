import os
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.db.database import get_db
from app.models import models
from app.schemas import schemas
from app.api.auth import get_current_active_admin

router = APIRouter(
    dependencies=[Depends(get_current_active_admin)]
)

@router.get("/dashboard", response_model=schemas.DashboardStats)
def get_dashboard_stats(db: Session = Depends(get_db)):
    total_users = db.query(models.User).count()
    # Assuming 'diseases detected' means total number of history records
    diseases_detected = db.query(models.ClassificationHistory).count()
    datasets = db.query(models.Dataset).count()
    total_feedback = db.query(models.Feedback).count()
    
    recent_activity = db.query(models.ClassificationHistory)\
        .order_by(models.ClassificationHistory.timestamp.desc())\
        .limit(5)\
        .all()
        
    # Conform recent activity to schema manually if needed, or let Pydantic handle it
    # The models.ClassificationHistory has (image_path, predicted_disease, confidence_score, timestamp)
    # The schema PredictionResponse has (filename, disease, confidence, timestamp)
    # We need to map it or update map.
    
    activity_data = []
    for item in recent_activity:
        activity_data.append({
            "id": item.id,
            "filename": item.image_path,
            "disease": item.predicted_disease,
            "confidence": item.confidence_score,
            "timestamp": item.timestamp,
            "llm_explanation": None # or empty string
        })

    return {
        "total_users": total_users,
        "diseases_detected": diseases_detected,
        "datasets": datasets,
        "total_feedback": total_feedback,
        "recent_activity": activity_data
    }

# --- USER MANAGEMENT ---

@router.get("/users", response_model=List[schemas.User])
def read_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    users = db.query(models.User).offset(skip).limit(limit).all()
    return users

@router.get("/users/{user_id}", response_model=schemas.User)
def read_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.user_id == user_id).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.delete("/users/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.user_id == user_id).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    db.delete(user)
    db.commit()
    return None

from app.core import security

@router.post("/users", response_model=schemas.User)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    # Check if email exists
    if db.query(models.User).filter(models.User.email == user.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = security.get_password_hash(user.password)
    new_user = models.User(
        email=user.email,
        full_name=user.username,
        hashed_password=hashed_password,
        is_admin=user.is_admin
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@router.put("/users/{user_id}", response_model=schemas.User)
def update_user(user_id: int, user_update: schemas.UserUpdate, db: Session = Depends(get_db)):
    # Note: UserUpdate has optional password.
    
    user = db.query(models.User).filter(models.User.user_id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.email = user_update.email
    user.full_name = user_update.username
    user.is_admin = user_update.is_admin
    
    if user_update.password:
        user.hashed_password = security.get_password_hash(user_update.password)
    
    db.commit()
    db.refresh(user)
    return user

# --- HISTORY MANAGEMENT ---

@router.get("/history", response_model=List[schemas.PredictionResponse])
def read_history(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    history = db.query(models.ClassificationHistory).offset(skip).limit(limit).all()
    # Manual mapping needed because schema expects 'filename' but model has 'image_path'
    # Or update schema alias. For now, let's map it manually or trust Pydantic validation if names match?
    # Schema has 'filename', model has 'image_path'.
    # We should update schema to be consistent or map here.
    # Let's fix the schema in a previous step? No, let's just make sure the response model works.
    # Actually, PredictionResponse expects `filename`. Model has `image_path`.
    # Let's simple return the objects and hope Config from_attributes works if we alias?
    # Or better, let's just return a list of dicts that match the schema.
    res = []
    for h in history:
        res.append({
            "id": h.id,
            "filename": h.image_path,
            "disease": h.predicted_disease,
            "confidence": h.confidence_score,
            "timestamp": h.timestamp,
            "llm_explanation": "Saved record" 
        })
    return res

@router.delete("/history/{history_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_history_item(history_id: int, db: Session = Depends(get_db)):
    item = db.query(models.ClassificationHistory).filter(models.ClassificationHistory.id == history_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="History item not found")
    db.delete(item)
    db.commit()
    return None

# --- DATASET MANAGEMENT ---

import shutil
from fastapi import File, UploadFile, Form

@router.post("/datasets", response_model=schemas.Dataset)
def create_dataset(
    name: str = Form(...),
    description: str = Form(None),
    image_count: int = Form(0),
    class_count: int = Form(0),
    file: UploadFile = File(None),
    db: Session = Depends(get_db)
):
    file_path = None
    if file:
        upload_dir = "uploads/datasets"
        os.makedirs(upload_dir, exist_ok=True)
        file_path = os.path.join(upload_dir, file.filename)
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

    db_dataset = models.Dataset(
        name=name,
        description=description,
        image_count=image_count,
        class_count=class_count,
        file_path=file_path,
        dataset_type="Uploaded" # Or we could add a specific type if needed
    )
    db.add(db_dataset)
    db.commit()
    db.refresh(db_dataset)
    return db_dataset

@router.get("/datasets", response_model=List[schemas.Dataset])
def read_datasets(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return db.query(models.Dataset).offset(skip).limit(limit).all()

@router.get("/datasets/{dataset_id}", response_model=schemas.Dataset)
def read_dataset(dataset_id: int, db: Session = Depends(get_db)):
    dataset = db.query(models.Dataset).filter(models.Dataset.id == dataset_id).first()
    if not dataset:
        raise HTTPException(status_code=404, detail="Dataset not found")
    return dataset

@router.put("/datasets/{dataset_id}", response_model=schemas.Dataset)
def update_dataset(dataset_id: int, dataset_update: schemas.DatasetCreate, db: Session = Depends(get_db)):
    dataset = db.query(models.Dataset).filter(models.Dataset.id == dataset_id).first()
    if not dataset:
        raise HTTPException(status_code=404, detail="Dataset not found")
    
    for key, value in dataset_update.dict().items():
        setattr(dataset, key, value)
    
    db.commit()
    db.refresh(dataset)
    return dataset

@router.delete("/datasets/{dataset_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_dataset(dataset_id: int, db: Session = Depends(get_db)):
    dataset = db.query(models.Dataset).filter(models.Dataset.id == dataset_id).first()
    if not dataset:
        raise HTTPException(status_code=404, detail="Dataset not found")
    db.delete(dataset)
    db.commit()
    return None
