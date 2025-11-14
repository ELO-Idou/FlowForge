"""SQLAlchemy model tracking workflow execution runs."""

from sqlalchemy import Column, DateTime, ForeignKey, String, text
from sqlalchemy.dialects.postgresql import JSONB

from .base import Base


class Execution(Base):
    """Historical run entry storing status and optional metrics."""
    __tablename__ = "executions"

    id = Column(String, primary_key=True)
    workflow_id = Column(String, ForeignKey("workflows.id"), nullable=False)
    status = Column(String, nullable=False)
    metrics = Column(JSONB, nullable=True)
    created_at = Column(
        DateTime(timezone=True),
        server_default=text("CURRENT_TIMESTAMP"),
    )
