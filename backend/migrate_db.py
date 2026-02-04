from app.db.database import engine, Base
from sqlalchemy import text

def update_db():
    print("Updating database schema...")
    
    # 1. Create new tables (Dataset)
    Base.metadata.create_all(bind=engine)
    print("✅ New tables created (if any).")

    # 2. Add is_admin column to leaf_users if it doesn't exist
    with engine.connect() as conn:
        conn = conn.execution_options(isolation_level="AUTOCOMMIT")
        try:
            # Check if column exists (PostgreSQL specific query, or generic try/except)
            # Simplest approach: Try to add it, ignore error if exists
            conn.execute(text("ALTER TABLE leaf_users ADD COLUMN is_admin BOOLEAN DEFAULT FALSE"))
            print("✅ Added 'is_admin' column to 'leaf_users'.")
        except Exception as e:
            if "duplicate column" in str(e) or "already exists" in str(e):
                print("ℹ️ 'is_admin' column already exists.")
            else:
                print(f"⚠️ Could not add column (might already exist or other error): {e}")

if __name__ == "__main__":
    update_db()
