from fastapi import APIRouter, Depends
from backend.auth import get_current_user  # Dependency to check if user is authenticated
from backend.models.models import User

router = APIRouter()

@router.get("/dashboard")
def get_dashboard(current_user: User = Depends(get_current_user)):
    return {"message": f"Welcome {current_user.username} to your dashboard!"}

@router.get("/profile")
def get_profile(current_user: User = Depends(get_current_user)):
    return {"profile": current_user}
