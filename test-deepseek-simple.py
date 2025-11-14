#!/usr/bin/env python3
"""Quick test of DeepSeek workflow generation."""

# pylint: disable=invalid-name

import asyncio
import httpx


async def test_deepseek():
    """Test DeepSeek via the backend API."""
    url = "http://localhost:8000/chat/generate-workflow"

    payload = {
        "messages": [
            {
                "id": "msg1",
                "role": "user",
                "content": (
                    "Create a simple n8n workflow: Webhook trigger that "
                    "receives customer support ticket, extracts issue using "
                    "Code node, routes by urgency using Switch node "
                    "(high/low), sends Slack notification for high urgency."
                ),
            }
        ]
    }

    async with httpx.AsyncClient(timeout=60.0) as client:
        try:
            response = await client.post(url, json=payload)
            print(f"Status: {response.status_code}")

            if response.status_code == 200:
                data = response.json()
                print("✅ SUCCESS!")
                print(f"Workflow: {data.get('title')}")
                print(f"Steps: {len(data.get('steps', []))}")
                print(f"Description: {data.get('description')}")
            else:
                print(f"❌ ERROR: {response.text}")

        except httpx.RequestError as exc:
            print(f"❌ EXCEPTION: {type(exc).__name__}: {exc}")

if __name__ == "__main__":
    asyncio.run(test_deepseek())
