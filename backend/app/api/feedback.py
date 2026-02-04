from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.db.database import get_db
from app.models import models
from app.schemas import schemas

router = APIRouter(
    prefix="/feedback",
    tags=["feedback"],
)

@router.get("/", response_model=List[schemas.Feedback])
def get_feedback(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    feedback = db.query(models.Feedback).order_by(models.Feedback.created_at.desc()).offset(skip).limit(limit).all()
    return feedback

@router.post("/", response_model=schemas.Feedback)
def create_feedback(feedback: schemas.FeedbackCreate, db: Session = Depends(get_db)):
    db_feedback = models.Feedback(**feedback.dict())
    db.add(db_feedback)
    db.commit()
    db.refresh(db_feedback)
    return db_feedback

@router.put("/{feedback_id}/read", response_model=schemas.Feedback)
def mark_feedback_as_read(feedback_id: int, db: Session = Depends(get_db)):
    feedback = db.query(models.Feedback).filter(models.Feedback.id == feedback_id).first()
    if not feedback:
        raise HTTPException(status_code=404, detail="Feedback not found")
    feedback.is_read = True
    db.commit()
    db.refresh(feedback)
    return feedback
