"""SQLAlchemy model representing application users."""

from sqlalchemy import Column, DateTime, String, text

from .base import Base


class User(Base):
    """Persisted user with credentials and audit metadata."""
    __tablename__ = "users"

    id = Column(String, primary_key=True)
    email = Column(String, unique=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    created_at = Column(
        DateTime(timezone=True),
        server_default=text("CURRENT_TIMESTAMP"),
    )
