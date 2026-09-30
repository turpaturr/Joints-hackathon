from typing import Optional
from sqlmodel import SQLModel, Field

# Contoh Model Tabel
class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    email: str = Field(index=True, unique=True)
    full_name: Optional[str] = None
    is_active: bool = Field(default=True)
