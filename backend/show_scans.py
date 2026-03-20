import os
from dotenv import load_dotenv
from sqlalchemy import create_engine


load_dotenv()
db_url = os.getenv("DATABASE_URL")

engine = create_engine(db_url)

# Query joined with User table if possible
query = """
SELECT 
    ch.id as scan_id, 
    u.email as user_email, 
    ch.predicted_disease, 
    ch.confidence_score, 
    ch.timestamp 
FROM leaf_history_v2 ch
LEFT JOIN users u ON ch.user_id = u.user_id
ORDER BY ch.timestamp DESC
LIMIT 5;
"""

from sqlalchemy.sql import text

try:
    with engine.connect() as conn:
        result = conn.execute(text(query))
        rows = result.fetchall()
        
        print("\n🌿 RECENT AI SCANS BY USERS 🌿")
        print("-" * 70)
        if not rows:
             print("No scans found in the database yet!")
             
        for row in rows:
             email = row[1] if row[1] else "Guest"
             conf = f"{float(row[3])*100:.0f}%" if row[3] is not None else "N/A"
             print(f"User: {email}")
             print(f"↳ Diagnosed: {row[2]} ({conf} confidence)")
             print(f"↳ Time: {row[4]}\n")
        print("-" * 70)
except Exception as e:
    print(f"Error querying database: {e}")
