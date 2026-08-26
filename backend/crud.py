from sqlalchemy.orm import Session
from sqlalchemy import func, extract
from . import models, schemas
from fastapi import HTTPException

def get_transactions(db: Session, user_id: str, skip: int = 0, limit: int = 100, category: str = None, month: str = None):
    query = db.query(models.Transaction).filter(models.Transaction.user_id == user_id)
    
    if category:
        query = query.filter(models.Transaction.category == category)
    if month:
        # Expected format YYYY-MM
        year, m = month.split('-')
        query = query.filter(
            extract('year', models.Transaction.date) == int(year),
            extract('month', models.Transaction.date) == int(m)
        )
        
    total = query.count()
    items = query.order_by(models.Transaction.date.desc()).offset(skip).limit(limit).all()
    return total, items

def get_user_balance(db: Session, user_id: str):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user.coin_balance

def get_rewards(db: Session):
    return db.query(models.Reward).all()

def redeem_reward(db: Session, req: schemas.RedeemRequest):
    # 1. Fetch user and reward inside a transaction with lock (for_update)
    user = db.query(models.User).filter(models.User.id == req.user_id).with_for_update().first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    reward = db.query(models.Reward).filter(models.Reward.id == req.reward_id).first()
    if not reward:
        raise HTTPException(status_code=404, detail="Reward not found")
        
    # 2. Check balance
    if user.coin_balance < reward.cost_in_coins:
        raise HTTPException(status_code=400, detail="Insufficient coin balance")
        
    # 3. Deduct balance
    user.coin_balance -= reward.cost_in_coins
    
    # 4. Commit transaction
    db.commit()
    
    return schemas.RedeemResponse(
        success=True, 
        message=f"Successfully redeemed {reward.name}",
        new_balance=user.coin_balance
    )

def get_analytics_category(db: Session, user_id: str):
    results = db.query(
        models.Transaction.category,
        func.sum(models.Transaction.amount).label('total')
    ).filter(models.Transaction.user_id == user_id).group_by(models.Transaction.category).all()
    
    return [{"category": r.category, "total": float(r.total)} for r in results]

def get_analytics_monthly(db: Session, user_id: str):
    if db.bind.dialect.name == 'sqlite':
        results = db.query(
            func.strftime('%Y-%m', models.Transaction.date).label('month'),
            func.sum(models.Transaction.amount).label('total')
        ).filter(models.Transaction.user_id == user_id).group_by('month').order_by('month').all()
        return [{"month": r.month if r.month else "", "total": float(r.total)} for r in results]
    else:
        results = db.query(
            func.date_trunc('month', models.Transaction.date).label('month'),
            func.sum(models.Transaction.amount).label('total')
        ).filter(models.Transaction.user_id == user_id).group_by('month').order_by('month').all()
        return [{"month": r.month.strftime('%Y-%m') if r.month else "", "total": float(r.total)} for r in results]
