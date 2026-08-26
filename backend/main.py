from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Optional

import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend import crud, models, schemas
from backend.database import engine, get_db

# Create all tables (if they don't exist)
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Financial App API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Should be restricted in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Hardcoded user_id for demo purposes since auth isn't in scope yet
DEMO_USER_ID = "00000000-0000-0000-0000-000000000000"

@app.get("/api/transactions", response_model=schemas.PaginatedTransactions)
def read_transactions(
    page: int = Query(1, ge=1),
    size: int = Query(20, ge=1, le=100),
    category: Optional[str] = None,
    month: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """
    Fetch paginated transactions.
    """
    skip = (page - 1) * size
    total, items = crud.get_transactions(db, user_id=DEMO_USER_ID, skip=skip, limit=size, category=category, month=month)
    return schemas.PaginatedTransactions(
        total=total,
        page=page,
        size=size,
        items=items
    )

@app.get("/api/coins")
def read_coins(db: Session = Depends(get_db)):
    """
    Fetch the user's current coin balance.
    """
    balance = crud.get_user_balance(db, user_id=DEMO_USER_ID)
    return {"coin_balance": balance}

@app.get("/api/rewards", response_model=List[schemas.RewardResponse])
def read_rewards(db: Session = Depends(get_db)):
    """
    Fetch the catalogue of rewards.
    """
    return crud.get_rewards(db)

@app.post("/api/redeem", response_model=schemas.RedeemResponse)
def redeem_reward(req: schemas.RedeemRequest, db: Session = Depends(get_db)):
    """
    Handles reward redemption.
    Execution Flow:
    1. Receives RedeemRequest with user_id and reward_id.
    2. Enters crud.redeem_reward where it fetches the user (with row lock) and reward.
    3. Validates existence of user and reward.
    4. Validates user balance against reward cost.
    5. Deducts coins, commits the transaction to PostgreSQL, and returns success response.
    """
    # Overriding the request user_id to our demo user for safety
    req.user_id = DEMO_USER_ID
    return crud.redeem_reward(db, req)

@app.get("/api/analytics/category", response_model=List[schemas.AnalyticsCategoryResponse])
def read_analytics_category(db: Session = Depends(get_db)):
    """
    Fetch spend analytics grouped by category.
    """
    return crud.get_analytics_category(db, user_id=DEMO_USER_ID)

@app.get("/api/analytics/monthly", response_model=List[schemas.AnalyticsMonthlyResponse])
def read_analytics_monthly(db: Session = Depends(get_db)):
    """
    Fetch spend analytics grouped by month.
    """
    return crud.get_analytics_monthly(db, user_id=DEMO_USER_ID)
