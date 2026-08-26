import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv

load_dotenv()

raw_db_url = os.environ.get("DATABASE_URL")
if raw_db_url:
    if raw_db_url.startswith("postgres://"):
        raw_db_url = raw_db_url.replace("postgres://", "postgresql+pg8000://", 1)
    elif raw_db_url.startswith("postgresql://"):
        raw_db_url = raw_db_url.replace("postgresql://", "postgresql+pg8000://", 1)

# We will default to a local postgres DB named 'financial_app' with standard postgres credentials
SQLALCHEMY_DATABASE_URL = raw_db_url or "postgresql+pg8000://postgres:postgres@localhost:5432/financial_app"

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
