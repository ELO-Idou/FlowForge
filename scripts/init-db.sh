#!/usr/bin/env bash
set -euo pipefail

psql "$DATABASE_URL" -f docker/init-db.sql
