from abc import ABC, abstractmethod
from typing import Generic, TypeVar, Optional, List, Any

T = TypeVar("T")


class IBaseRepository(ABC, Generic[T]):
    """Generic repository interface defining standard CRUD operations."""

    @abstractmethod
    def get_by_id(self, id: Any) -> Optional[T]:
        """Retrieve a single record by its primary key ID."""
        pass

    @abstractmethod
    def get_all(self, skip: int = 0, limit: int = 100) -> List[T]:
        """Retrieve all records with pagination support."""
        pass

    @abstractmethod
    def create(self, obj_in: Any) -> T:
        """Create and persist a new record."""
        pass

    @abstractmethod
    def update(self, db_obj: T, obj_in: Any) -> T:
        """Update an existing record."""
        pass

    @abstractmethod
    def delete(self, id: Any) -> Optional[T]:
        """Delete a record by its primary key ID."""
        pass
