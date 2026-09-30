from fastapi import APIRouter
from app.api.mobile.v1.endpoints import users, consultations

mobile_v1_router = APIRouter(prefix="/v1")

# Include sub-routers for mobile clients
mobile_v1_router.include_router(users.router, prefix="/users", tags=["Mobile - Users"])
mobile_v1_router.include_router(consultations.router, prefix="/consultations", tags=["Mobile - Consultations"])
