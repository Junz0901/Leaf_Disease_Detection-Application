import sys
import os
from sqlalchemy import text

# Add the current directory to sys.path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.db.database import engine

def inspect_counts():
    with engine.connect() as connection:
        user_count = connection.execute(text("SELECT COUNT(*) FROM users")).scalar()
        history_count = connection.execute(text("SELECT COUNT(*) FROM leaf_history_v2")).scalar()
        dataset_count = connection.execute(text("SELECT COUNT(*) FROM dataset")).scalar()
        
        print(f"Users: {user_count}")
        print(f"History/Analysis: {history_count}")
        print(f"Datasets: {dataset_count}")

if __name__ == "__main__":
    inspect_counts()
