from fastapi import APIRouter, Depends
from backend.auth import get_current_user  # Dependency to check if user is authenticated

router = APIRouter()

@router.get("/dashboard")
async def dashboard(current_user: dict = Depends(get_current_user)):
   
    return {"message": f"Welcome {current_user['username']} to your dashboard!"}

@router.get("/profile")
async def profile(current_user: dict = Depends(get_current_user)):
   
    return {"profile": current_user}
