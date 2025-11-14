"""Pydantic schemas representing workflow blueprints and chat payloads."""

from typing import Any

from pydantic import BaseModel, ConfigDict, Field


class ChatMessage(BaseModel):
    """Chat message exchanged between user and assistant."""
    id: str
    role: str
    content: str


class ChatRequest(BaseModel):
    """Collection of chat messages sent to the AI service."""
    messages: list[ChatMessage]


class WorkflowNode(BaseModel):
    """Node definition containing metadata required for n8n."""
    id: str
    name: str
    type: str
    parameters: dict[str, Any] = Field(default_factory=dict)
    position: dict[str, int] | list[int] | None = None
    type_version: float | None = Field(None, alias="typeVersion")
    js_code: str | None = Field(None, alias="jsCode")
    credentials: dict[str, Any] | list[str] | str | None = None
    retry_on_fail: bool | None = Field(None, alias="retryOnFail")
    max_tries: int | None = Field(None, alias="maxTries")
    wait_between_tries: int | None = Field(None, alias="waitBetweenTries")
    always_output_data: bool | None = Field(None, alias="alwaysOutputData")
    continue_on_fail: bool | None = Field(None, alias="continueOnFail")
    notes: str | None = None
    notes_in_flow: bool | None = Field(None, alias="notesInFlow")
    disabled: bool | None = None


class WorkflowEdge(BaseModel):
    """Edge that connects two workflow nodes."""
    id: str
    source: str
    target: str
    connection_type: str | None = Field(None, alias="connectionType")
    source_output_index: int | None = Field(None, alias="sourceOutputIndex")
    target_input_index: int | None = Field(None, alias="targetInputIndex")


class WorkflowBlueprint(BaseModel):
    """Full workflow document produced by the automation generator."""
    id: str
    title: str
    description: str
    steps: list[WorkflowNode]
    edges: list[WorkflowEdge]
    credentials: list[str] | list[dict[str, Any]]
    estimated_time_saved_minutes: int = Field(
        alias="estimatedTimeSavedMinutes",
    )

    model_config = ConfigDict(populate_by_name=True)
