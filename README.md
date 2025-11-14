# FlowForge Automation Platform

AI-powered SaaS to turn natural language prompts into deployable n8n workflows. Built with React, FastAPI, and Docker.

## Getting Started

1. Install frontend deps: `cd frontend && npm install`.
2. Configure backend env: `cp backend/.env.example backend/.env` and populate secrets:
	- `GEMINI_API_KEY` with a valid Google Generative AI key.
	- `GEMINI_MODEL` (defaults to `gemini-2.0-flash-exp`).
	- Update `ALLOWED_ORIGINS` if hosting the UI elsewhere.
3. Install backend deps: `cd backend && pip install -r requirements.txt` (use the project venv).
4. Optional frontend env: create `frontend/.env` and set `VITE_API_URL=http://localhost:8000` if the API URL differs from the default.
5. Launch stack: `docker compose -f docker/docker-compose.yml up --build`.

## Production Demo Checklist

- Verify Gemini credentials by calling `POST /chat/generate-workflow` from the backend (returns a JSON blueprint).
- Run `npm run build` inside `frontend` to ensure the UI compiles with the live API wiring.
- From the `docker` folder, build the production images with `docker compose -f docker-compose.yml build` and start them using `docker compose up -d`.
- Log into the UI, generate a workflow, and confirm the chat loads the live Gemini response (the Zendesk fallback will appear if Gemini is unreachable).
- Use the "Download JSON" button to capture the live blueprint before opening n8n for the demo walkthrough.
- In n8n, import the downloaded JSON to validate node wiring ahead of the recorded demo.

## Key Features

- NUKI-inspired dark theme with yellow accents.
- Marketing landing page, dashboard, and chat-based workflow builder.
- Gemini 2.0 Flash integration for NLP blueprint generation.
- Export workflows directly into n8n with credential guidance.
- Unified Zendesk, Microsoft Dynamics 365, and Salesforce workflow blueprint with AI triage.
- Analytics dashboard highlighting automation coverage, SLA breaches, and AI-recommended actions.
