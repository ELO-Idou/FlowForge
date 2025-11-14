"""Generate a customer-support workflow using the DeepSeek service."""

from __future__ import annotations

import asyncio
import json
from pathlib import Path
from textwrap import dedent

from backend.app.schemas.workflow import ChatMessage, ChatRequest
from backend.app.services.deepseek_service import DeepSeekService

PROMPT = dedent(
    """
    Create a customer support automation workflow for Nuki smart locks.
    The workflow should:
      1. Start with a manual trigger for testing
      2. Extract customer issue text and classify it with a Code node
      3. Categorize issues into motor_blocked, battery_issue,
         door_not_opening, bluetooth_failure, bridge_offline
      4. Route to the appropriate response based on category
      5. Provide troubleshooting steps for each category
    Include JavaScript that returns category, confidence, and keywords_found.
    """
)

OUTPUT_FILE = Path("deepseek-generated-workflow.json")


def _build_request() -> ChatRequest:
    message = ChatMessage(id="1", role="user", content=PROMPT)
    return ChatRequest(messages=[message])


async def generate_workflow() -> None:
    """Call the DeepSeek service and persist the resulting blueprint."""
    service = DeepSeekService()
    request = _build_request()

    print("🤖 Generating workflow with DeepSeek...")
    try:
        blueprint = await service.generate_workflow(request)
    except RuntimeError as exc:  # pragma: no cover - dev script
        print(f"❌ DeepSeek failed: {exc}")
        return

    print(f"\n✅ Generated workflow: {blueprint.title}")
    print(f"📝 Description: {blueprint.description}")
    print(
        "⏱️  Time saved: "
        f"{blueprint.estimated_time_saved_minutes} minutes"
    )

    print(f"\n📊 Nodes ({len(blueprint.steps)}):")
    for step in blueprint.steps:
        summary = (
            f"  - {step.name} ({step.type}) v{step.type_version or 1}"
        )
        print(summary)
        if step.js_code:
            print("    ✓ Includes JavaScript code")

    print(f"\n🔗 Connections ({len(blueprint.edges)}):")
    for edge in blueprint.edges:
        print(f"  - {edge.source} → {edge.target}")

    OUTPUT_FILE.write_text(
        json.dumps(blueprint.model_dump(by_alias=True), indent=2),
        encoding="utf-8",
    )
    print(f"\n💾 Saved to {OUTPUT_FILE}")

    code_nodes = [step for step in blueprint.steps if step.js_code]
    if code_nodes:
        print(f"\n📜 Sample code from '{code_nodes[0].name}':")
        print("=" * 60)
        snippet = code_nodes[0].js_code or ""
        print(snippet[:500])
        if len(snippet) > 500:
            print("...")
        print("=" * 60)


def main() -> None:
    """Execute the async workflow generator."""
    asyncio.run(generate_workflow())


if __name__ == "__main__":
    main()
