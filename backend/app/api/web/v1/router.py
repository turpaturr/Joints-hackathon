from fastapi import APIRouter
from app.api.web.v1.endpoints import users, analytics

web_v1_router = APIRouter(prefix="/v1")

# Include sub-routers for web clients (Admin/Doctor Portal)
web_v1_router.include_router(users.router, prefix="/users", tags=["Web - Users"])
web_v1_router.include_router(analytics.router, prefix="/analytics", tags=["Web - Analytics"])
