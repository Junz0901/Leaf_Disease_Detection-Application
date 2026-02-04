from app.db.database import engine
from app.models import models
from sqlalchemy.orm import Session
import sys

def make_admin(email):
    with Session(engine) as db:
        user = db.query(models.User).filter(models.User.email == email).first()
        if user:
            user.is_admin = True
            db.commit()
            print(f"✅ User '{email}' is now an Admin!")
        else:
            print(f"❌ User '{email}' not found.")

if __name__ == "__main__":
    if len(sys.argv) > 1:
        make_admin(sys.argv[1])
    else:
        print("Usage: python make_admin.py <email>")
