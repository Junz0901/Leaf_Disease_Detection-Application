import os
import sys

# Ensure backend directory is in python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv
from app.models import models
from app.core.security import get_password_hash

# Load env vars
load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
db = SessionLocal()

def create_user():
    print("\n--- Create New Admin/User ---")
    username = input("Enter Username: ").strip()
    email = input("Enter Email: ").strip()
    password = input("Enter Password: ").strip()
    role_input = input("Is this an Admin user? (y/n): ").strip().lower()
    is_admin = role_input == 'y'

    if not username or not email or not password:
        print("Error: All fields are required.")
        return

    # Check existence
    existing = db.query(models.User).filter((models.User.full_name == username) | (models.User.email == email)).first()
    if existing:
        print(f"Error: User with username '{username}' or email '{email}' already exists.")
        return

    # Hash Password
    hashed_password = get_password_hash(password)

    new_user = models.User(
        full_name=username,
        email=email,
        hashed_password=hashed_password,
        is_admin=is_admin
    )

    try:
        db.add(new_user)
        db.commit()
        print(f"\n✅ User '{username}' created successfully!")
        print(f"Role: {'Admin' if is_admin else 'User'}")
    except Exception as e:
        print(f"Error creating user: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    create_user()
