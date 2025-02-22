from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class UserBase(BaseModel):
    username: str
    email: str

class UserSignup(UserBase):
    password: str  

class User(UserBase):
    user_id: int

    class Config:
        orm_mode = True  

class UserLogin(BaseModel):
    username: str
    password: str