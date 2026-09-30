from typing import List
from fastapi import APIRouter, Depends, status
from app.api.dependencies.services import get_user_service
from app.api.dependencies.auth import get_current_user, require_role
from app.domain.models.user import UserRole
from app.domain.schemas.user import UserCreate, UserResponse
from app.domain.schemas.common import APIResponse
from app.services.user_service import UserService

router = APIRouter()


@router.post("/", response_model=APIResponse[dict], status_code=status.HTTP_201_CREATED)
def create_user(
    user_in: UserCreate,
    user_service: UserService = Depends(get_user_service),
):
    """Admin / Web endpoint to register a new user or doctor."""
    user = user_service.register_user(user_in)
    return APIResponse(
        success=True,
        message="User successfully registered",
        data={"id": user.id, "email": user.email, "role": user.role},
    )


@router.get("/", response_model=APIResponse[List[dict]])
def list_users(
    skip: int = 0,
    limit: int = 20,
    current_user: dict = Depends(require_role(UserRole.ADMIN)),
    user_service: UserService = Depends(get_user_service),
):
    """Admin endpoint to list all registered users with pagination."""
    users = user_service.get_all(skip=skip, limit=limit)
    user_list = [
        {"id": u.id, "email": u.email, "full_name": u.full_name, "role": u.role}
        for u in users
    ]
    return APIResponse(success=True, message="Users fetched", data=user_list)
