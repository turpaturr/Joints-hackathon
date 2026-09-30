import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.router import api_router
from app.db.base import Base
from app.db.session import engine

# Configure basic logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("connect-backend")

# Initialize FastAPI application
app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url=f"{settings.API_V1_STR}/docs",
    redoc_url=f"{settings.API_V1_STR}/redoc",
)

# Set up CORS middleware for Vue (Web) and React Native (Mobile)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Connect all modular API routes
app.include_router(api_router, prefix=settings.API_V1_STR)


@app.on_event("startup")
def on_startup():
    """Startup events such as auto-creating tables if not using migrations."""
    logger.info("Starting up Connect Backend...")
    try:
        # Create tables automatically for rapid development if connection succeeds
        Base.metadata.create_all(bind=engine)
        logger.info("Database tables verified.")
    except Exception as e:
        logger.warning(
            f"Could not connect to database at startup ({e}). "
            "Ensure PostgreSQL is running and DATABASE_URL is configured."
        )


@app.get("/")
def root():
    return {
        "app": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "docs_url": f"{settings.API_V1_STR}/docs",
        "mobile_v1_base": f"{settings.API_V1_STR}/mobile/v1",
        "web_v1_base": f"{settings.API_V1_STR}/web/v1",
        "message": "Selamat datang di Backend Connect API!",
    }


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)