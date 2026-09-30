from fastapi import APIRouter, Depends
from app.api.dependencies.services import get_user_service
from app.api.dependencies.auth import get_current_user
from app.services.user_service import UserService

router = APIRouter()


@router.get("/profile")
def get_mobile_user_profile(
    current_user: dict = Depends(get_current_user),
    user_service: UserService = Depends(get_user_service),
):
    """Get active user profile for mobile client."""
    return {
        "status": "success",
        "user": current_user,
    }
