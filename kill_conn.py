import os
from dotenv import load_dotenv
from sqlalchemy import create_engine, text

load_dotenv('.env')
engine = create_engine(os.getenv('DATABASE_URL'))
with engine.connect() as conn:
    try:
        conn.execute(text("SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE pid != pg_backend_pid();"))
        conn.commit()
        print('Killed active connections')
    except Exception as e:
        print(f'Error: {e}')
