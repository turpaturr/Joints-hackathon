from typing import Optional
from sqlalchemy.orm import Session
from app.domain.models.user import User
from app.repositories.interfaces.user import IUserRepository
from app.repositories.implementations.base import BaseRepository


class UserRepository(BaseRepository[User], IUserRepository):
    """SQLAlchemy implementation of User repository."""

    def __init__(self, db: Session):
        super().__init__(model=User, db=db)

    def get_by_email(self, email: str) -> Optional[User]:
        return self.db.query(User).filter(User.email == email).first()
