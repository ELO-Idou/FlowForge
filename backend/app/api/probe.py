"""Connectivity probe endpoints for external dependencies."""

import time
from typing import Any

from fastapi import APIRouter, status

from ..config import Settings
from ..services.n8n_client import N8NClient, N8NClientError


router = APIRouter()


@router.get("/deepseek", status_code=status.HTTP_200_OK)
async def probe_deepseek() -> dict[str, Any]:
    """Minimal DeepSeek probe.

    - Verifies API key presence
    - Attempts a tiny chat completion with max_tokens=1
    - Returns latency and error details without raising
    """
    settings = Settings()
    result: dict[str, Any] = {
        "configured": bool(settings.deepseek_api_key),
        "model": settings.deepseek_model,
        "ok": False,
    }

    if not settings.deepseek_api_key:
        result["error"] = "DeepSeek API key is not configured"
        return result

    try:
        # Lazy import to avoid hard dependency in environments without OpenAI
        import importlib

        openai_module = importlib.import_module("openai")
        client_factory = getattr(openai_module, "OpenAI")
        client = client_factory(
            api_key=settings.deepseek_api_key,
            base_url="https://api.deepseek.com",
            timeout=10.0,
        )

        start = time.perf_counter()
        _ = client.chat.completions.create(
            model=settings.deepseek_model,
            messages=[{"role": "user", "content": "ping"}],
            max_tokens=1,
            temperature=0.0,
            stream=False,
        )
        latency_ms = int((time.perf_counter() - start) * 1000)
        result.update({"ok": True, "latency_ms": latency_ms})
    except Exception as exc:  # pragma: no cover - network/SDK errors
        result.update({"ok": False, "error": str(exc)})

    return result


@router.get("/n8n", status_code=status.HTTP_200_OK)
async def probe_n8n() -> dict[str, Any]:
    """n8n connectivity probe using the existing health endpoint."""
    client = N8NClient()
    try:
        status_payload = await client.get_status()
        return {"ok": True, "status": status_payload}
    except N8NClientError as exc:  # pragma: no cover - network failure branch
        return {"ok": False, "error": str(exc)}
