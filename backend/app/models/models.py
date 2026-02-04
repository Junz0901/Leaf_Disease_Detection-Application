from sqlalchemy import Column, Integer, String, DateTime, Float, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.database import Base

class Admin(Base):
    __tablename__ = "admin"

    admin_id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    password_hash = Column(String)
    role = Column(String, default="Admin")
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    last_login_at = Column(DateTime, nullable=True)

    @property
    def hashed_password(self):
        return self.password_hash

    @hashed_password.setter
    def hashed_password(self, value):
        self.password_hash = value

class User(Base):
    __tablename__ = "users"

    user_id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String, name="password_hash") # Map python attr to DB column
    phone_number = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    last_login_at = Column(DateTime, nullable=True)
    is_active = Column(Boolean, default=True)
    profile_picture_url = Column(String, nullable=True)
    is_admin = Column(Boolean, default=False)
    
    predictions = relationship("ClassificationHistory", back_populates="user")

    @property
    def username(self):
        return self.full_name
    
    @username.setter
    def username(self, value):
        self.full_name = value

class ClassificationHistory(Base):
    __tablename__ = "leaf_history_v2"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.user_id"), nullable=True)
    image_path = Column(String)
    predicted_disease = Column(String)
    confidence_score = Column(Float)
    timestamp = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="predictions")

class Feedback(Base):
    __tablename__ = "feedback"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.user_id"), nullable=True) # Optional, can be anonymous
    full_name = Column(String, nullable=True) # For anonymous users or explicit name
    email = Column(String, nullable=True)
    message = Column(String)
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User")

class Dataset(Base):
    __tablename__ = "dataset"

    id = Column(Integer, primary_key=True, index=True, name="dataset_id")
    name = Column(String, index=True)
    description = Column(String, nullable=True)
    dataset_type = Column(String, default="Leaf", name="source")
    file_path = Column(String, nullable=True, name="url")
    image_count = Column(Integer, default=0, name="total_images")
    class_count = Column(Integer, default=0, name="total_classes")
    created_at = Column(DateTime, default=datetime.utcnow)
