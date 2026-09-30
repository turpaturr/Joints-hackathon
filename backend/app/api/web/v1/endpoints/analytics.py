from fastapi import APIRouter, Depends
from app.api.dependencies.auth import require_role
from app.domain.models.user import UserRole
from app.domain.schemas.common import APIResponse

router = APIRouter()


@router.get("/summary")
def get_dashboard_summary(
    current_user: dict = Depends(require_role(UserRole.ADMIN)),
):
    """Web admin dashboard statistics summary."""
    return APIResponse(
        success=True,
        message="Analytics retrieved successfully",
        data={
            "total_doctors": 24,
            "total_patients": 310,
            "active_home_visits": 5,
            "completed_consultations": 142,
        },
    )
