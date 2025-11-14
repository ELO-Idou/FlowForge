"""Async client for interacting with an external n8n instance."""

import logging
from typing import Any

import httpx

from ..config import settings
from ..schemas.workflow import WorkflowBlueprint
from .n8n_converter import to_n8n_payload


logger = logging.getLogger(__name__)


class N8NClientError(RuntimeError):
    """Raised when communication with the n8n API fails."""


class N8NClient:
    """Thin wrapper that issues authenticated requests to the n8n REST API."""

    def __init__(
        self,
        base_url: str | None = None,
        timeout: float = 10.0,
    ) -> None:
        self._base_url = base_url or settings.n8n_base_url.rstrip("/")
        self._timeout = timeout
        self._headers: dict[str, str] = {}
        if settings.n8n_api_key:
            self._headers["X-N8N-API-KEY"] = settings.n8n_api_key
            self._headers["n8n-api-key"] = settings.n8n_api_key
        # Optional Basic Auth (useful when n8n has BASIC_AUTH active)
        self._auth: httpx.Auth | None = None
        if settings.n8n_basic_auth_user and settings.n8n_basic_auth_password:
            self._auth = httpx.BasicAuth(
                settings.n8n_basic_auth_user,
                settings.n8n_basic_auth_password,
            )

    async def get_status(self) -> dict[str, Any]:
        """Return health information reported by the target n8n instance."""
        try:
            async with httpx.AsyncClient(
                base_url=self._base_url,
                headers=self._headers,
                auth=self._auth,
                timeout=self._timeout,
            ) as client:
                response = await client.get("/healthz")
                response.raise_for_status()
                if response.content:
                    return response.json()
                return {"status": "ok"}
        except httpx.HTTPStatusError as exc:
            # pragma: no cover - simple pass-through
            detail = exc.response.text
            message = (
                f"n8n responded with status "
                f"{exc.response.status_code}: {detail}"
            )
            raise N8NClientError(message) from exc
        except httpx.HTTPError as exc:
            # pragma: no cover - simple pass-through
            raise N8NClientError("Unable to reach the n8n instance") from exc

    async def deploy_workflow(
        self,
        blueprint: WorkflowBlueprint,
    ) -> dict[str, Any]:
        """Create a workflow in n8n using the supplied blueprint definition."""
        payload = to_n8n_payload(blueprint)
        try:
            async with httpx.AsyncClient(
                base_url=self._base_url,
                headers=self._headers,
                auth=self._auth,
                timeout=self._timeout,
            ) as client:
                logger.debug(
                    "Deploying workflow to n8n",
                    extra={"payload": payload},
                )
                response = await client.post("/api/v1/workflows", json=payload)
                response.raise_for_status()
                data = response.json()
                workflow_id = data.get("id")
                if workflow_id:
                    data["url"] = f"{self._base_url}/workflow/{workflow_id}"
                return data
        except httpx.HTTPStatusError as exc:
            # pragma: no cover - surface upstream error details
            detail = exc.response.text
            raise N8NClientError(
                f"n8n responded with status {exc.response.status_code}: {detail}"
            ) from exc
        except httpx.HTTPError as exc:
            # pragma: no cover - simple pass-through
            raise N8NClientError("Unable to reach the n8n instance") from exc
