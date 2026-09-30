from typing import Generic, TypeVar, List, Optional, Any
from app.repositories.interfaces.base import IBaseRepository

T = TypeVar("T")


class BaseService(Generic[T]):
    """Base service class wrapping basic repository operations."""

    def __init__(self, repository: IBaseRepository[T]):
        self.repository = repository

    def get_by_id(self, id: Any) -> Optional[T]:
        return self.repository.get_by_id(id)

    def get_all(self, skip: int = 0, limit: int = 100) -> List[T]:
        return self.repository.get_all(skip=skip, limit=limit)

    def delete(self, id: Any) -> Optional[T]:
        return self.repository.delete(id)
