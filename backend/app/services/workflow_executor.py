"""Coordinator combining NLP parsing and AI workflow generation."""

from fastapi import HTTPException

from ..schemas.workflow import ChatRequest, WorkflowBlueprint
from .deepseek_service import DeepSeekService
from .nlp_parser import parse_prompt


class WorkflowExecutor:
    """Facade orchestrating prompt parsing and blueprint generation."""
    def __init__(self) -> None:
        self.ai_service = DeepSeekService()

    async def generate_workflow(
        self,
        payload: ChatRequest,
    ) -> WorkflowBlueprint:
        """Parse the prompt and delegate generation to the AI service."""
        parsed_prompt = parse_prompt(payload)
        _ = parsed_prompt  # placeholder until prompt enrichment is applied
        try:
            return await self.ai_service.generate_workflow(payload)
        except RuntimeError as exc:
            raise HTTPException(status_code=503, detail=str(exc)) from exc
