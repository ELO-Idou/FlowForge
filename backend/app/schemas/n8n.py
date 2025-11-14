"""Pydantic schema for exporting workflows into n8n."""

from pydantic import BaseModel


class N8NExportRequest(BaseModel):
    """Payload describing a workflow export and required credentials."""
    workflow_id: str
    credentials: dict[str, str]
