"""Pydantic models for authentication requests and responses."""

from pydantic import BaseModel, EmailStr


class LoginResponse(BaseModel):
    """Serialized payload returned after successful authentication."""
    access_token: str
    token_type: str
    user_email: EmailStr


class RegisterRequest(BaseModel):
    """Incoming registration details captured from the signup form."""
    email: EmailStr
    password: str
    company: str
