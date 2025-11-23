import sys
import io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

from db.database import get_db
from sqlalchemy import text

def migrate():
    db = next(get_db())
    try:
        with open('migrations/versions/add_request_traces.sql', 'r') as f:
            sql = f.read()
        
        for statement in sql.split(';'):
            if statement.strip():
                db.execute(text(statement))
        
        db.commit()
        print("Migration completed: request_traces table created")
    except Exception as e:
        print(f"Migration failed: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    migrate()
