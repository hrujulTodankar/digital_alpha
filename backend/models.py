from sqlalchemy import Column, Integer, String, Numeric, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
import uuid
from backend.database import Base

class User(Base):
    __tablename__ = "users_v2"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    name = Column(String, index=True)
    coin_balance = Column(Integer, default=0)
    
    transactions = relationship("Transaction", back_populates="user")

class Transaction(Base):
    __tablename__ = "transactions_v2"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    user_id = Column(String, ForeignKey("users_v2.id"))
    date = Column(DateTime, index=True)
    merchant = Column(String)
    amount = Column(Numeric(10, 2))
    category = Column(String)
    status = Column(String)
    payment_method = Column(String)
    
    user = relationship("User", back_populates="transactions")

class Reward(Base):
    __tablename__ = "rewards_v2"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    name = Column(String, index=True)
    description = Column(Text)
    cost_in_coins = Column(Integer)
