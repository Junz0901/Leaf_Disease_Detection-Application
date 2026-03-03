from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class UserBase(BaseModel):
    email: str
    username: str

class UserCreate(UserBase):
    password: str
    is_admin: bool = False

class UserUpdate(UserBase):
    password: Optional[str] = None
    is_admin: bool = False
    is_active: Optional[bool] = None

class User(UserBase):
    user_id: int
    is_admin: bool = False
    is_active: bool = True
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

class DatasetBase(BaseModel):
    name: str
    description: Optional[str] = None
    dataset_type: Optional[str] = "Leaf"

class DatasetCreate(DatasetBase):
    image_count: int = 0
    class_count: int = 0
    path: Optional[str] = None

class Dataset(DatasetBase):
    id: int
    image_count: int
    class_count: int
    class_count: int
    created_at: datetime
    class Config:
        from_attributes = True

class PredictionResponse(BaseModel):
    id: int
    filename: str
    disease: str
    confidence: float
    llm_explanation: Optional[str] = None
    timestamp: datetime

    class Config:
        from_attributes = True

class ChatRequest(BaseModel):
    message: str
    context: Optional[str] = None

class FeedbackBase(BaseModel):
    message: str
    full_name: Optional[str] = None
    email: Optional[str] = None

class FeedbackCreate(FeedbackBase):
    pass

class Feedback(FeedbackBase):
    id: int
    user_id: Optional[int] = None
    is_read: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

class DashboardStats(BaseModel):
    total_users: int
    diseases_detected: int
    datasets: int
    total_feedback: int
    recent_activity: list[PredictionResponse]
