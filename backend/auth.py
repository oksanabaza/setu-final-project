from fastapi import HTTPException, Depends, status
from fastapi.security import OAuth2PasswordBearer
from backend.models import User 
import jwt

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

# Function to verify the token
def verify_token(token: str):
    try:
        # JWT secret and algorithm
        payload = jwt.decode(token, "secret_key", algorithms=["HS256"])
        return payload  
    except jwt.PyJWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

# Dependency to get the current user from the token
def get_current_user(token: str = Depends(oauth2_scheme)):
    return verify_token(token)
