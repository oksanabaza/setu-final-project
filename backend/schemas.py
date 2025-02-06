from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class UserBase(BaseModel):
    username: str
    email: str

class UserCreate(UserBase):
    password: str  

class User(UserBase):
    user_id: int

    class Config:
        orm_mode = True  

