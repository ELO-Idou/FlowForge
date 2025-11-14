"""Utility functions for interpreting chat prompts."""

from ..schemas.workflow import ChatRequest


def parse_prompt(payload: ChatRequest) -> dict[str, str]:
    """Extract key fields from the chat prompt (stub implementation)."""
    last_message = payload.messages[-1].content if payload.messages else ""
    return {"summary": last_message}
