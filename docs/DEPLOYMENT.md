# Deployment Guide

1. Populate environment variables in `backend/.env` and Docker secrets.
2. Run `docker compose -f docker/docker-compose.prod.yml up --build -d`.
3. Configure DNS and HTTPS termination for frontend and backend endpoints.
