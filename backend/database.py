import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv

load_dotenv()

# We will default to a local postgres DB named 'financial_app' with standard postgres credentials
SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL", "postgresql+pg8000://postgres:postgres@localhost:5432/financial_app")

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
