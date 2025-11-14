"""DeepSeek AI service for workflow generation using OpenAI-compatible API."""

import importlib
import json
import logging
import os
import re
from datetime import datetime
import time
import random
from pathlib import Path
from typing import Any

from ..config import Settings
from ..schemas.workflow import ChatRequest, WorkflowBlueprint

try:  # pragma: no cover - optional dependency for best-effort repairs
    from json_repair import repair_json  # type: ignore[import-not-found]
except ImportError:  # pragma: no cover - optional dependency
    repair_json = None

# Two-stage DeepSeek instruction set for blueprint-first generation
SYSTEM_INSTRUCTION = (
    "You are an elite n8n workflow engineer.\n"
    "\n"
    "Operate every request in two explicit stages.\n"
    "\n"
    "PHASE 1 - BLUEPRINT (default response)\n"
    "- Output only the workflow blueprint JSON and wait for approval.\n"
    "- Include keys: id, title, description, steps, edges, credentials,\n"
    "  estimatedTimeSavedMinutes.\n"
    "- Populate each step with id (kebab-case), name, allowed type, integer\n"
    "  typeVersion, parameters, optional jsCode, and position null.\n"
    "- Default step credentials to {} unless the user provides details.\n"
    "- Use only allowed node types. There is no Switch node; always use\n"
    "  n8n-nodes-base.if.\n"
    "- Leave unknown parameters as {} and explain expectations in step notes\n"
    "  when clarification is needed.\n"
    "- Supply a complete edges array. Each edge needs id, source, target,\n"
    "  sourceOutputIndex (default 0), and targetInputIndex (default 0).\n"
    "- List required credentials at the blueprint root or [] when none are\n"
    "  needed.\n"
    "- Keep expressions literal, for example {{ $json.email }}.\n"
    "- Leave positions null so downstream auto-layout can place nodes.\n"
    "\n"
    "PHASE 2 - EXECUTION JSON (after user says Convert or Stage 2)\n"
    "- Emit raw n8n import JSON with no surrounding commentary.\n"
    "- Target n8n version 1.118.1. Avoid deprecated or future fields.\n"
    "- Ensure every node uses integer typeVersion values valid for 1.118.1.\n"
    "- Keep node credential objects empty {} so operators can bind them.\n"
    "- Model HTTP Request nodes with this structure:\n"
    "    {\n"
    "      \"authentication\": \"genericCredentialType\" |\n"
    "        \"predefinedCredentialType\" | \"none\",\n"
    "      \"headerParametersUi\": {\"parameters\": []},\n"
    "      \"queryParametersUi\": {\"parameters\": []},\n"
    "      \"bodyParametersUi\": {\"parameters\": []},\n"
    "      \"options\": {}\n"
    "    }\n"
    "- Never wrap the execution JSON in code fences or extra text.\n"
    "\n"
    "GENERAL RULES\n"
    "- Supported node types:\n"
    "    n8n-nodes-base.cron\n"
    "    n8n-nodes-base.httpRequest\n"
    "    n8n-nodes-base.if\n"
    "    n8n-nodes-base.merge\n"
    "    n8n-nodes-base.code\n"
    "    n8n-nodes-base.wait\n"
    "    n8n-nodes-base.hubspot\n"
    "    n8n-nodes-base.stripe\n"
    "    n8n-nodes-base.slack\n"
    "    n8n-nodes-base.emailSend\n"
    "    n8n-nodes-base.zendesk\n"
    "    n8n-nodes-base.googleSheets\n"
    "- If a request needs an unsupported node, state that and ask for an\n"
    "  alternative.\n"
    "- Keep ids lowercase kebab-case. Never invent credentials or API keys.\n"
    "- Leave parameters blank when unsure and note what information is\n"
    "  required.\n"
    "- Always include explicit edges; do not assume implicit connections.\n"
    "\n"
    "FAIL-SAFE BEHAVIOUR\n"
    "- Ask clarifying questions when instructions conflict or data is\n"
    "  missing.\n"
    "- When guessing is unavoidable, produce a minimal safe blueprint and\n"
    "  flag open decisions.\n"
    "- Keep every response under 14000 characters.\n"
)

MEMORY_PRESET = (
    "Persistent memory:\n"
    "- User runs n8n version 1.118.1 and needs workflows inside that range.\n"
    "- Generation always occurs in two steps: Stage 1 blueprint then Stage 2\n"
    "  JSON after approval.\n"
    "- Leave unknown parameters as {} and explain expectations in notes.\n"
    "- Never invent node types, credentials, or API tokens.\n"
    "- Use lowercase hyphenated ids and preserve expressions like\n"
    "  {{ $json.field }}.\n"
    "- Always emit explicit edges so the converter can map connections.\n"
    "- typeVersion values must be integers supported by n8n 1.118.1.\n"
)

JSON_ONLY_REMINDER = (
  "Respond with a single valid JSON object matching the WorkflowBlueprint "
  "schema. Do not include markdown fences, commentary, or trailing commas."
)
MAX_RESPONSE_ATTEMPTS = 2

DEFAULT_DATA_DIR = Path(__file__).resolve().parents[2] / "data"
DATA_ROOT = Path(os.getenv("DATA_DIR", str(DEFAULT_DATA_DIR)))
FAILURE_DUMP_DIR = DATA_ROOT / "deepseek_failures"

logger = logging.getLogger(__name__)


class DeepSeekService:
    """Service for generating workflow blueprints using DeepSeek AI."""

    def __init__(self) -> None:
        settings = Settings()
        if not settings.deepseek_api_key:
            raise RuntimeError("DeepSeek API key is not configured.")

        try:
            openai_module = importlib.import_module("openai")
        except ImportError as exc:  # pragma: no cover - optional dependency
            message = (
                "The 'openai' package is required to call the DeepSeek API."
                " Install it with `pip install openai`."
            )
            raise RuntimeError(message) from exc

        try:
            client_factory: Any = getattr(openai_module, "OpenAI")
        except AttributeError as exc:  # pragma: no cover - defensive guard
            message = (
                "The installed 'openai' package does not expose an OpenAI"
                " client. Install a version that provides the OpenAI class."
            )
            raise RuntimeError(message) from exc

        self.client = client_factory(
            api_key=settings.deepseek_api_key,
            base_url="https://api.deepseek.com",
            timeout=180.0,  # 3 minutes timeout
        )
        self.model = settings.deepseek_model

    async def generate_workflow(
        self,
        payload: ChatRequest,
    ) -> WorkflowBlueprint:
        """Generate a workflow blueprint from chat messages using DeepSeek."""
        if not payload.messages:
            raise RuntimeError("At least one chat message is required.")

        # Build messages with system instruction
        base_messages = [
            {"role": "system", "content": SYSTEM_INSTRUCTION},
            {"role": "system", "content": MEMORY_PRESET},
        ]
        base_messages.extend(
            {"role": msg.role, "content": msg.content}
            for msg in payload.messages
        )

        last_raw_text = ""
        last_error: Exception | None = None

        for attempt in range(1, MAX_RESPONSE_ATTEMPTS + 1):
            attempt_messages = [dict(message) for message in base_messages]
            if attempt > 1:
                attempt_messages[0]["content"] = (
                    SYSTEM_INSTRUCTION + "\n\n" + JSON_ONLY_REMINDER
                )

            raw_text = self._invoke_deepseek(attempt_messages)
            last_raw_text = raw_text
            clean_text = self._clean_json_text(raw_text)

            try:
                payload_text = self._extract_json_payload(clean_text).strip()
                data = self._parse_json_string(payload_text)
                data = self._fix_missing_fields(data)
                return WorkflowBlueprint.model_validate(data)
            except (json.JSONDecodeError, RuntimeError) as exc:
                last_error = exc
                logger.warning(
                    "DeepSeek response parsing failed on attempt %d/%d: %s. "
                    "Snippet: %s",
                    attempt,
                    MAX_RESPONSE_ATTEMPTS,
                    exc,
                    raw_text[:200].replace("\n", " "),
                )

        error_preview = last_raw_text[:300].replace("\n", " ")
        if last_raw_text:
            failure_path = self._persist_failure_payload(last_raw_text)
            if failure_path:
                logger.info(
                    "DeepSeek failure payload saved to %s",
                    failure_path,
                )

        error_msg = (
            "DeepSeek returned invalid JSON after retries. "
            f"Last error: {last_error}. Response preview: {error_preview}"
        )
        raise RuntimeError(error_msg) from last_error

    def _invoke_deepseek(self, messages: list[dict[str, str]]) -> str:
        """Call the DeepSeek API and return the raw text response.

        Retries transient network/HTTP errors with exponential backoff.
        """
        max_attempts = 3
        base_delay = 1.0

        for attempt in range(1, max_attempts + 1):
            try:
                response = self.client.chat.completions.create(
                    model=self.model,
                    messages=messages,
                    temperature=0.2,
                    top_p=0.9,
                    stream=False,
                    # Allow larger payloads for complex blueprints.
                    max_tokens=6000,
                    stop=["```", "</json>"],
                    response_format={"type": "json_object"},
                )
                if (
                    not response.choices
                    or not response.choices[0].message.content
                ):
                    raise RuntimeError("DeepSeek returned an empty response.")

                raw_text = response.choices[0].message.content.strip()
                if not raw_text:
                    raise RuntimeError(
                        "DeepSeek response content is empty after strip"
                    )
                return raw_text
            except Exception as exc:  # pragma: no cover - network/SDK errors
                # Only retry for the first two attempts
                if attempt < max_attempts:
                    # Exponential backoff with jitter
                    delay = base_delay * (2 ** (attempt - 1))
                    jitter = random.uniform(0, 0.25 * delay)
                    sleep_time = delay + jitter
                    logger.warning(
                        (
                            "DeepSeek call failed (attempt %d/%d): %s. "
                            "Retrying in %.2fs"
                        ),
                        attempt,
                        max_attempts,
                        exc,
                        sleep_time,
                    )
                    # This call is sync inside an async flow; time.sleep is ok
                    time.sleep(sleep_time)
                    continue
                error_msg = f"DeepSeek API call failed: {str(exc)}"
                raise RuntimeError(error_msg) from exc

    def _extract_json_payload(self, raw_text: str) -> str:
        """Extract the JSON payload from mixed text responses."""
        if not raw_text:
            raise RuntimeError("DeepSeek response payload is empty.")

        # Fast path: looks like pure JSON
        trimmed = raw_text.strip()
        if trimmed.startswith("{") and trimmed.endswith("}"):
            return trimmed

        # Look for a JSON code block or inline object
        start = trimmed.find("{")
        end = trimmed.rfind("}")
        if start == -1 or end == -1 or end <= start:
            raise RuntimeError(
                "DeepSeek response did not contain a JSON object."
            )

        return trimmed[start:end + 1]

    def _fix_missing_fields(self, data: dict) -> dict:
        """Fix common missing fields in AI response."""
        # Coerce steps to a list of dicts when AI returns a mapping
        if "steps" in data:
            steps_val = data["steps"]
            if isinstance(steps_val, dict):
                # Use values in insertion order; keep only dict-like steps
                data["steps"] = [
                    v for v in steps_val.values() if isinstance(v, dict)
                ]
            elif isinstance(steps_val, (str, int, float)):
                data["steps"] = []
            elif not isinstance(steps_val, list):
                data["steps"] = []

            # Fix steps - add missing 'name' fields
            for i, step in enumerate(data["steps"]):
                if not isinstance(step, dict):
                    continue
                if "name" not in step and "id" in step:
                    # Use ID as name (capitalize and replace hyphens)
                    step["name"] = step["id"].replace("-", " ").title()
                elif "name" not in step:
                    step["name"] = f"Step {i + 1}"

        # Coerce edges to a list when AI returns a mapping
        if "edges" in data:
            edges_val = data["edges"]
            if isinstance(edges_val, dict):
                data["edges"] = [
                    v for v in edges_val.values() if isinstance(v, dict)
                ]
            elif isinstance(edges_val, (str, int, float)):
                data["edges"] = []
            elif not isinstance(edges_val, list):
                data["edges"] = []

            # Fix edges - add missing 'id' fields
            for i, edge in enumerate(data["edges"]):
                if not isinstance(edge, dict):
                    continue
                if "id" not in edge:
                    edge["id"] = f"edge{i + 1}"

        return data

    def _clean_json_text(self, raw_text: str) -> str:
        """Strip fences and normalize quotes before JSON parsing."""
        text = raw_text.strip()
        text = re.sub(r"^```(?:json)?\s*", "", text)
        text = re.sub(r"\s*```$", "", text)
        text = text.replace("“", '"').replace("”", '"').replace("’", "'")
        return text.strip()

    def _looks_truncated(self, payload_text: str) -> bool:
        """Detect obviously truncated JSON payloads."""
        stripped = payload_text.strip()
        brace_mismatch = stripped.count("{") != stripped.count("}")
        return not stripped.endswith("}") or brace_mismatch

    def _parse_json_string(self, payload_text: str) -> dict:
        """Parse JSON with optional repair and truncation guard."""
        if self._looks_truncated(payload_text):
            raise RuntimeError("DeepSeek response appears truncated.")

        try:
            return json.loads(payload_text)
        except json.JSONDecodeError as exc:
            if not repair_json:
                raise

            try:
                repaired = repair_json(payload_text)
            except (ValueError, json.JSONDecodeError) as repair_exc:
                raise exc from repair_exc

            if self._looks_truncated(repaired):
                raise RuntimeError(
                    "DeepSeek response appears truncated after repair."
                ) from exc

            try:
                return json.loads(repaired)
            except json.JSONDecodeError as repaired_exc:
                raise exc from repaired_exc

    def _persist_failure_payload(self, raw_text: str) -> Path | None:
        """Persist the last raw response to disk for troubleshooting."""
        try:
            FAILURE_DUMP_DIR.mkdir(parents=True, exist_ok=True)
            timestamp = datetime.utcnow().strftime("%Y%m%dT%H%M%SZ")
            file_path = FAILURE_DUMP_DIR / f"failure_{timestamp}.json"
            file_path.write_text(raw_text, encoding="utf-8")
            return file_path
        except OSError as exc:  # pragma: no cover - best effort logging
            logger.debug("Failed to persist DeepSeek payload: %s", exc)
            return None
