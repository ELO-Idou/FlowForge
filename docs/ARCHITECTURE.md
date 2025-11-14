# System Architecture

- **Frontend**: React + TypeScript + Vite, delivers marketing site, dashboard, and chat UI.
- **Backend**: FastAPI orchestrates Gemini interactions and workflow persistence.
- **Automation Engine**: n8n receives exported workflows for execution.
- **Infrastructure**: Docker Compose coordinates containers with PostgreSQL and Redis.
