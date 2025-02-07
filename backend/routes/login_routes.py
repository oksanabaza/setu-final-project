# from fastapi import APIRouter, Depends, HTTPException
# from sqlalchemy.orm import Session
# from backend import models, schemas
# from backend.crud import authenticate_user
# from backend.database import get_db
# from passlib.context import CryptContext

# router = APIRouter()
# pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# @router.post("/login")
# def login(user_login: schemas.UserLogin, db: Session = Depends(get_db)):
#     user = authenticate_user(db, user_login.username, user_login.password)
#     return {"message": f"Welcome {user.username}"}
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.schemas import schemas
from backend.crud.crud import *
from backend.database import get_db
from passlib.context import CryptContext
from datetime import datetime, timedelta
from jose import JWTError, jwt
import os

# from backend.models.models import models

# Secret key for encoding the JWT token (make sure this is a secret and private)
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")

router = APIRouter()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def create_access_token(data: dict, expires_delta: timedelta = timedelta(hours=1)):
    to_encode = data.copy()
    expire = datetime.utcnow() + expires_delta
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

@router.post("/login")
def login(user_login: schemas.UserLogin, db: Session = Depends(get_db)):
    # Authenticate user with the provided username and password
    user = authenticate_user(db, user_login.username, user_login.password)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid username or password")
    
    # Generate JWT token
    access_token = create_access_token(data={"sub": user.username})

    # Return the token in the response
    return {"access_token": access_token, "token_type": "bearer"}
