import json
import os
import random
from datetime import datetime, timedelta
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

from .models import Base, User, Transaction, Reward

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql+pg8000://postgres:postgres@localhost:5432/financial_app")

def ensure_database_exists():
    base_url = "/".join(DATABASE_URL.split("/")[:-1])
    db_name = DATABASE_URL.split("/")[-1]
    
    try:
        engine = create_engine(f"{base_url}/postgres", isolation_level="AUTOCOMMIT")
        with engine.connect() as conn:
            exists = conn.execute(text(f"SELECT 1 FROM pg_catalog.pg_database WHERE datname = '{db_name}'")).fetchone()
            if not exists:
                print(f"Creating database {db_name}...")
                conn.execute(text(f"CREATE DATABASE {db_name}"))
    except Exception as e:
        print(f"Warning: Could not check/create database: {e}")

def parse_date(ts):
    if isinstance(ts, (int, float)):
        return datetime.fromtimestamp(ts / 1000.0)
    try:
        return datetime.fromisoformat(ts.replace("Z", "+00:00").replace("+05:30", ""))
    except ValueError:
        pass
    try:
        return datetime.strptime(ts, "%d/%m/%Y %H:%M:%S")
    except ValueError:
        pass
    try:
        return datetime.strptime(ts, "%Y-%m-%d")
    except ValueError:
        pass
    return datetime.utcnow()

def seed_database():
    from backend.database import engine, SessionLocal
    
    print("Creating tables...")
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    
    DEMO_USER_ID = "00000000-0000-0000-0000-000000000000"
    
    try:
        print("Seeding user...")
        demo_user = User(
            id=DEMO_USER_ID,
            name="Test User",
            coin_balance=1500
        )
        db.add(demo_user)
        
        print("Seeding rewards...")
        rewards = [
            Reward(name="$5 Amazon Gift Card", description="Digital gift card", cost_in_coins=500),
            Reward(name="$10 Uber Credit", description="Ride credit", cost_in_coins=1000),
            Reward(name="1 Month Spotify Premium", description="Music subscription", cost_in_coins=1200),
            Reward(name="$20 Target Gift Card", description="Digital gift card", cost_in_coins=2000),
            Reward(name="AirPods Pro Raffle Ticket", description="1 entry into raffle", cost_in_coins=100)
        ]
        db.add_all(rewards)
        db.flush() 
        
        print("Seeding transactions...")
        import os
        current_dir = os.path.dirname(os.path.abspath(__file__))
        json_path = os.path.join(current_dir, "transactions.json")
        with open(json_path, "r") as f:
            tx_data = json.load(f)
            
        txs = []
        for tx in tx_data:
            txs.append(Transaction(
                user_id=DEMO_USER_ID,
                merchant=tx.get("merchant", "Unknown"),
                amount=tx.get("amount", 0.0),
                category=tx.get("category") or "Other",
                status=tx.get("status", "pending"),
                payment_method=tx.get("payment_method", "Unknown"),
                date=parse_date(tx.get("timestamp"))
            ))
            
        print(f"Inserting {len(txs)} transactions. This might take a moment...")
        db.bulk_save_objects(txs)
        db.commit()
        print("Seeding complete!")
        
    except Exception as e:
        print(f"Error seeding database: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
