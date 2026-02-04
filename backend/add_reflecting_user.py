import sys
import os

sys.path.append(os.getcwd())

from app.db.database import SessionLocal
from app.models.models import User
from app.core.security import get_password_hash

try:
    db = SessionLocal()
    # Check if exists
    if db.query(User).filter(User.username == 'custom_pg_user').first():
        print("User 'custom_pg_user' already exists.")
    else:
        u = User(
            username='custom_pg_user', 
            email='custom@pg.com', 
            hashed_password=get_password_hash('12345'), 
            is_admin=False 
        )
        db.add(u)
        db.commit()
        print("Successfully created user 'custom_pg_user' in 'leaf_users' table.")
except Exception as e:
    print(f"Error: {e}")
finally:
    db.close()
