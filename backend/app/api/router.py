from fastapi import APIRouter
from app.api.mobile.v1.router import mobile_v1_router
from app.api.web.v1.router import web_v1_router

api_router = APIRouter()

# Mobile routes: /api/mobile/v1/...
api_router.include_router(mobile_v1_router, prefix="/mobile")

# Web routes: /api/web/v1/...
api_router.include_router(web_v1_router, prefix="/web")


@api_router.get("/health", tags=["Health"])
def health_check():
    """Health check endpoint to verify API readiness."""
    return {"status": "ok", "service": "Connect API"}
