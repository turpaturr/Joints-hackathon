import os
from dotenv import load_dotenv
from sqlmodel import SQLModel, create_engine, Session

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "")

if DATABASE_URL.startswith("postgresql://"):
    DATABASE_URL = DATABASE_URL.replace("postgresql://", "postgresql+psycopg2://", 1)

engine = create_engine(DATABASE_URL, echo=True) if DATABASE_URL else None

def init_db():
    """Otomatis membuat semua tabel di Postgres berdasarkan model Python."""
    if engine:
        SQLModel.metadata.create_all(engine)
    else:
        print("[Database Warning]: DATABASE_URL belum di-set di file .env")

def get_session():
    """Dependency FastAPI untuk memberikan session database per HTTP request."""
    if not engine:
        raise ValueError("DATABASE_URL belum di-set di file .env")
    with Session(engine) as session:
        yield session