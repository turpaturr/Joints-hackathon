from typing import Optional, List
from fastapi import HTTPException, status
from app.domain.models.user import User
from app.domain.schemas.user import UserCreate, UserUpdate
from app.repositories.interfaces.user import IUserRepository
from app.services.base import BaseService


class UserService(BaseService[User]):
    """Service layer for User business logic."""

    def __init__(self, user_repo: IUserRepository):
        super().__init__(repository=user_repo)
        self.user_repo = user_repo

    def register_user(self, user_in: UserCreate) -> User:
        existing = self.user_repo.get_by_email(user_in.email)
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email is already registered",
            )
        
        # In production, hash the password (e.g. passlib / bcrypt)
        # For boilerplate simplicity, we store hashed_password
        user_data = user_in.model_dump() if hasattr(user_in, "model_dump") else user_in.dict()
        plain_password = user_data.pop("password")
        user_data["hashed_password"] = f"hashed_{plain_password}"
        
        return self.user_repo.create(user_data)

    def get_by_email(self, email: str) -> Optional[User]:
        return self.user_repo.get_by_email(email)
