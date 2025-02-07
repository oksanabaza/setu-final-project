from fastapi import APIRouter, Depends, HTTPException
from backend.models.models import User
from backend.schemas.schemas import *
from sqlalchemy.orm import Session
from backend.schemas import schemas
from backend.database import get_db
from passlib.context import CryptContext
from backend.security import pwd_context


router = APIRouter()

# @router.post("/signup")
# async def signup(user: UserSignup):
#     # Signup logic here (creating the user, hashing password, etc.)
#     return {"message": "User created successfully!"}
@router.post("/signup")
def signup(user: schemas.UserSignup, db: Session = Depends(get_db)):
    hashed_password = pwd_context.hash(user.password)
    db_user = User(username=user.username, email=user.email, password_hash=hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return {"message": "User created successfully"}