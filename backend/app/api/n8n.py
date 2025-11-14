"""Endpoints for interacting with the n8n orchestration layer."""

from fastapi import APIRouter, HTTPException, status

from ..schemas.workflow import WorkflowBlueprint
from ..services.n8n_client import N8NClient, N8NClientError
from ..services.n8n_converter import to_n8n_payload

router = APIRouter()
client = N8NClient()


@router.get("/status")
async def n8n_status() -> dict[str, object]:
    """Proxy the n8n health endpoint and return the upstream response."""
    try:
        return await client.get_status()
    except N8NClientError as exc:  # pragma: no cover - network failure branch
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=str(exc),
        ) from exc


@router.post("/workflows", response_model=dict[str, object])
async def deploy_workflow(payload: WorkflowBlueprint) -> dict[str, object]:
    """Create a workflow in n8n using the converted blueprint payload."""
    try:
        response = await client.deploy_workflow(payload)
        return {
            "workflow": response,
        }
    except N8NClientError as exc:  # pragma: no cover - network failure branch
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=str(exc),
        ) from exc


@router.post("/convert", response_model=dict[str, object])
async def convert_workflow(payload: WorkflowBlueprint) -> dict[str, object]:
    """Return the n8n-compatible workflow document without deploying it."""
    converted = to_n8n_payload(payload)
    return {"workflow": converted}
