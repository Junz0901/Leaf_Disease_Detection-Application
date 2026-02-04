import os
from sqlalchemy import create_engine, inspect
from dotenv import load_dotenv

load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")
engine = create_engine(DATABASE_URL)
inspector = inspect(engine)

print("Tables in DB:", inspector.get_table_names())
if 'users' in inspector.get_table_names():
    print("Table 'users' exists.")
    print("Columns:", [c['name'] for c in inspector.get_columns('users')])
else:
    print("Table 'users' does NOT exist.")

if 'leaf_users' in inspector.get_table_names():
    print("Table 'leaf_users' exists (Current App Table).")
