"""Unit tests for the DeepSeek workflow generation service."""

from __future__ import annotations

from collections.abc import Iterator

import pytest

from app.schemas.workflow import ChatMessage, ChatRequest
from app.services.deepseek_service import JSON_ONLY_REMINDER, DeepSeekService


@pytest.fixture
def anyio_backend() -> str:
    """Force anyio to run tests against asyncio only."""
    return "asyncio"


def _service_stub() -> DeepSeekService:
    """Return a DeepSeekService instance without triggering __init__."""
    return DeepSeekService.__new__(DeepSeekService)  # type: ignore[misc]


def test_extract_json_payload_strips_code_fence() -> None:
    """Ensure fenced JSON responses parse cleanly."""
    service = _service_stub()
    raw_text = """```json\n{\n  \"id\": \"demo\"\n}\n```"""

    payload = getattr(service, "_extract_json_payload")(raw_text)

    assert payload == '{\n  "id": "demo"\n}'


def test_fix_missing_fields_populates_defaults() -> None:
    """Fill optional step metadata when omitted by the model."""
    service = _service_stub()
    partial = {
        "steps": [
            {"id": "webhook"},
            {"id": "switch", "name": "Switch Node"},
        ],
        "edges": [
            {"source": "webhook", "target": "switch"},
        ],
    }

    fixed = getattr(service, "_fix_missing_fields")(partial)

    assert fixed["steps"][0]["name"] == "Webhook"
    assert fixed["steps"][1]["name"] == "Switch Node"
    assert fixed["edges"][0]["id"] == "edge1"


@pytest.mark.anyio
async def test_generate_workflow_retries_until_valid() -> None:
    """Retry model output until valid JSON emerges."""
    service = _service_stub()

    attempts: list[list[dict[str, str]]] = []
    responses: Iterator[str] = iter(
        [
            "not-json-response",
            """
            {
              \"id\": \"support-routing\",
              \"title\": \"Route Customer Support Tickets\",
              \"description\": \"Routes inbound tickets by urgency.\",
              \"steps\": [
                {
                  \"id\": \"webhook\",
                  \"type\": \"n8n-nodes-base.webhook\",
                  \"parameters\": {},
                  \"typeVersion\": 2
                }
              ],
              \"edges\": [],
              \"credentials\": [],
              \"estimatedTimeSavedMinutes\": 20
            }
            """.strip(),
        ]
    )

    def fake_invoke(messages: list[dict[str, str]]) -> str:
        attempts.append(messages)
        return next(responses)

    setattr(service, "_invoke_deepseek", fake_invoke)

    payload = ChatRequest(
        messages=[
            ChatMessage(
                id="msg1",
                role="user",
                content="Generate a routing workflow.",
            )
        ]
    )

    blueprint = await service.generate_workflow(payload)

    assert blueprint.id == "support-routing"
    assert len(attempts) == 2
    assert attempts[1][0]["content"].endswith(JSON_ONLY_REMINDER)
