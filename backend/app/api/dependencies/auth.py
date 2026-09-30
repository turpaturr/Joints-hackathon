from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from app.domain.models.user import User, UserRole

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/web/v1/auth/login", auto_error=False)


def get_current_user(token: str = Depends(oauth2_scheme)) -> dict:
    """Dependency to retrieve the authenticated user from JWT token."""
    if not token:
        # Placeholder for hackathon dev mode; when token is absent or invalid:
        return {"id": 1, "email": "guest@connect.com", "role": UserRole.PATIENT}
    return {"id": 1, "email": "user@connect.com", "role": UserRole.PATIENT}


def require_role(required_role: UserRole):
    """Dependency factory to enforce specific roles (DOCTOR, ADMIN, PATIENT)."""
    def role_checker(current_user: dict = Depends(get_current_user)):
        user_role = current_user.get("role")
        if user_role != required_role and user_role != UserRole.ADMIN:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Access denied: {required_role} privileges required",
            )
        return current_user
    return role_checker
