from fastapi import HTTPException, status, Depends
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from backend.models.models import User
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.crud.crud import *
import os

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

# Secret and algorithm used for JWT
# DATABASE_URL = os.getenv("DATABASE_URL")
SECRET_KEY =  os.getenv("SECRET_KEY")
ALGORITHM =  os.getenv("ALGORITHM")
# ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30  # Set token expiration time

def create_access_token(data: dict):
    """Generate a JWT token."""
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

# def get_current_user(token: str = Depends(oauth2_scheme)):
#     """Decodes the token and retrieves the user data from the DB."""
#     credentials_exception = HTTPException(
#         status_code=status.HTTP_401_UNAUTHORIZED,
#         detail="Could not validate credentials",
#         headers={"WWW-Authenticate": "Bearer"},
#     )
#     try:
#         payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
#         username: str = payload.get("sub")
#         if username is None:
#             raise credentials_exception
#         token_data = get_user_by_username(username)  # Fetch the user from DB
#     except JWTError:
#         raise credentials_exception
#     if token_data is None:
#         raise credentials_exception
#     return token_data  # Return the user information
def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    try:
        # Decode the JWT token
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token has no username",
                headers={"WWW-Authenticate": "Bearer"},
            )
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Fetch the user from the database using the username from the token
    user = db.query(User).filter(User.username == username).first()
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return user