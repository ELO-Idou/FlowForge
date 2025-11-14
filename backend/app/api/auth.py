"""Authentication routes for login and registration."""

from fastapi import APIRouter, Depends
from fastapi.security import OAuth2PasswordRequestForm

from ..schemas.auth import LoginResponse, RegisterRequest

router = APIRouter()


@router.post("/login", response_model=LoginResponse)
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
) -> LoginResponse:
    """Authenticate the user and issue a JWT (stub implementation)."""
    return LoginResponse(
        access_token="mock-token",
        token_type="bearer",
        user_email=form_data.username,
    )


@router.post("/register", response_model=LoginResponse)
async def register(payload: RegisterRequest) -> LoginResponse:
    """Register a new user and return a JWT (stub implementation)."""
    return LoginResponse(
        access_token="mock-token",
        token_type="bearer",
        user_email=payload.email,
    )
