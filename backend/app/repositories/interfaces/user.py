from abc import abstractmethod
from typing import Optional
from app.domain.models.user import User
from app.repositories.interfaces.base import IBaseRepository


class IUserRepository(IBaseRepository[User]):
    """Interface for User-specific repository operations."""

    @abstractmethod
    def get_by_email(self, email: str) -> Optional[User]:
        """Find a user by their email address."""
        pass
