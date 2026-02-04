import os
from sqlalchemy import create_engine, text
from dotenv import load_dotenv

load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")
engine = create_engine(DATABASE_URL)

try:
    with engine.connect() as conn:
        with conn.begin():
            conn.execute(text("DROP TABLE IF EXISTS leaf_history CASCADE"))
            conn.execute(text("DROP TABLE IF EXISTS leaf_users CASCADE"))
            print("✅ Dropped 'leaf_history' and 'leaf_users'.")
except Exception as e:
    print(f"Error dropping tables: {e}")
