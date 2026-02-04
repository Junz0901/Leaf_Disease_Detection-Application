import sys
import os
from datetime import datetime, timedelta
import random

# Add the current directory to sys.path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.db.database import SessionLocal, engine, Base
from app.models import models

def seed_history():
    print("Checking tables...")
    # Ensure tables exist
    models.Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    print("Seeding classification history...")

    diseases = ["Healthy", "Early Blight", "Late Blight", "Powdery Mildew", "Rust"]
    
    try:
        # Get a valid user ID (or None if no users)
        user = db.query(models.User).first()
        user_id = user.user_id if user else None
        
        history_entries = []
        for i in range(10):
            entry = models.ClassificationHistory(
                user_id=user_id,
                image_path=f"uploads/leaf_{i}.jpg",
                predicted_disease=random.choice(diseases),
                confidence_score=round(random.uniform(0.7, 0.99), 2),
                timestamp=datetime.utcnow() - timedelta(hours=i*2)
            )
            history_entries.append(entry)
            
        db.add_all(history_entries)
        db.commit()
        print(f"Successfully added {len(history_entries)} history entries.")
        
    except Exception as e:
        print(f"Error seeding data: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_history()
