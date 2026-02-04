import sys
import os
from datetime import datetime

# Add the current directory to sys.path so we can import app
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.db.database import SessionLocal, engine, Base
from app.models import models

from sqlalchemy import text

def seed_feedback():
    # Ensure tables exist
    print("Registered tables:", models.Base.metadata.tables.keys())
    
    # Drop feedback table to fix schema mismatch
    with engine.connect() as connection:
        connection.execute(text("DROP TABLE IF EXISTS feedback CASCADE"))
        connection.commit()
    
    models.Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    print("Seeding feedback data...")
    
    dummy_feedbacks = [
        {
            "full_name": "John Doe",
            "email": "john@example.com",
            "message": "Great app! The disease detection is very accurate.",
            "is_read": False,
            "created_at": datetime.now()
        },
        {
            "full_name": "Jane Smith",
            "email": "jane@example.com",
            "message": "It would be nice to have more disease types covered.",
            "is_read": False,
            "created_at": datetime.now()
        },
        {
            "full_name": "Alice Johnson",
            "email": "alice@example.com",
            "message": "Found a bug in the upload feature on mobile.",
            "is_read": True,
            "created_at": datetime.now()
        },
        {
            "full_name": "Bob Brown",
            "email": "bob@example.com",
            "message": "How can I export the results?",
            "is_read": False,
            "created_at": datetime.now()
        }
    ]

    try:
        for data in dummy_feedbacks:
            feedback = models.Feedback(**data)
            db.add(feedback)
        
        db.commit()
        print("Successfully added 4 dummy feedback entries.")
    except Exception as e:
        print(f"Error seeding data: {str(e).splitlines()[0]}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_feedback()
