"""Chat-related endpoints for generating workflows via AI."""

import logging
from fastapi import APIRouter

from ..schemas.workflow import ChatRequest, WorkflowBlueprint
from ..services.workflow_executor import WorkflowExecutor

router = APIRouter()
executor = WorkflowExecutor()
logger = logging.getLogger(__name__)


@router.post("/generate-workflow", response_model=WorkflowBlueprint)
async def generate_workflow(payload: ChatRequest) -> WorkflowBlueprint:
    """Generate a workflow blueprint via the AI service."""
    try:
        logger.info(
            "Generating workflow with %d messages", len(payload.messages)
        )
        result = await executor.generate_workflow(payload)
        logger.info("Successfully generated workflow: %s", result.title)
        return result
    except Exception as e:
        logger.error(
            "Workflow generation failed: %s: %s",
            type(e).__name__,
            str(e),
        )
        raise
