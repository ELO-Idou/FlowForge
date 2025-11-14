"""SQLAlchemy model for workflow blueprints owned by users."""

from sqlalchemy import Column, DateTime, ForeignKey, String, Text, text
from sqlalchemy.dialects.postgresql import JSONB

from .base import Base


class Workflow(Base):
    """Automation workflow definition captured from Gemini output."""
    __tablename__ = "workflows"

    id = Column(String, primary_key=True)
    owner_id = Column(String, ForeignKey("users.id"), nullable=False)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    blueprint = Column(JSONB, nullable=False)
    created_at = Column(
        DateTime(timezone=True),
        server_default=text("CURRENT_TIMESTAMP"),
    )
