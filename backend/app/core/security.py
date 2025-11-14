"""Utilities for issuing JWT access tokens."""

from importlib import import_module
from datetime import datetime, timedelta

from ..config import settings

jwt = import_module("jwt")


def create_access_token(subject: str, expires_minutes: int = 30) -> str:
    """Create a signed JWT access token."""
    expiry = datetime.utcnow() + timedelta(minutes=expires_minutes)
    token_payload = {"sub": subject, "exp": expiry}
    token = jwt.encode(token_payload, settings.secret_key, algorithm="HS256")
    return token
