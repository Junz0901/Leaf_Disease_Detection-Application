import os
from sqlalchemy import create_engine, inspect
from dotenv import load_dotenv

load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    print("No DATABASE_URL")
    exit(1)

try:
    engine = create_engine(DATABASE_URL)
    inspector = inspect(engine)
    if inspector.has_table('dataset'):
        columns = inspector.get_columns('dataset')
        print("Columns in 'dataset':")
        for c in columns:
            print(f"- {c['name']} ({c['type']})")
    else:
        print("Table 'leaf_datasets' does not exist.")
except Exception as e:
    print(f"Error: {e}")
