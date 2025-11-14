"""Application entrypoint configuring the FastAPI service and routes."""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .config import settings
from .api import auth, workflows, chat, n8n, probe

app = FastAPI(title="FlowForge Automation API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(workflows.router, prefix="/workflows", tags=["workflows"])
app.include_router(chat.router, prefix="/chat", tags=["chat"])
app.include_router(n8n.router, prefix="/n8n", tags=["n8n"])
app.include_router(probe.router, prefix="/probe", tags=["probe"])


@app.get("/health")
def health() -> dict[str, str]:
    """Lightweight readiness probe for uptime checks."""
    return {"status": "ok"}
