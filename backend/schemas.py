from pydantic import BaseModel, ConfigDict
from typing import List, Optional
from datetime import datetime
from decimal import Decimal

# User schemas
class UserBase(BaseModel):
    name: str

class UserResponse(UserBase):
    id: str
    coin_balance: int
    model_config = ConfigDict(from_attributes=True)

# Transaction schemas
class TransactionBase(BaseModel):
    merchant: str
    amount: Decimal
    category: str
    status: str
    payment_method: str
    date: datetime

class TransactionResponse(TransactionBase):
    id: str
    user_id: str
    model_config = ConfigDict(from_attributes=True)

class PaginatedTransactions(BaseModel):
    total: int
    page: int
    size: int
    items: List[TransactionResponse]

# Reward schemas
class RewardBase(BaseModel):
    name: str
    description: str
    cost_in_coins: int

class RewardResponse(RewardBase):
    id: str
    model_config = ConfigDict(from_attributes=True)

class RedeemRequest(BaseModel):
    user_id: str
    reward_id: str

class RedeemResponse(BaseModel):
    success: bool
    message: str
    new_balance: int

class AnalyticsCategoryResponse(BaseModel):
    category: str
    total: float

class AnalyticsMonthlyResponse(BaseModel):
    month: str
    total: float
