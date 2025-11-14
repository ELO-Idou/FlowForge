"""CRUD endpoints for managing workflow blueprints."""

from fastapi import APIRouter

from ..schemas.workflow import WorkflowBlueprint

router = APIRouter()


@router.get("/", response_model=list[WorkflowBlueprint])
async def list_workflows() -> list[WorkflowBlueprint]:
    """Return stored workflows (placeholder until persistence is wired)."""
    return []


@router.post("/", response_model=WorkflowBlueprint)
async def create_workflow(payload: WorkflowBlueprint) -> WorkflowBlueprint:
    """Store a workflow blueprint (placeholder passthrough)."""
    return payload
