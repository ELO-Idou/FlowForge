#!/bin/sh
set -eu

# Read password from Docker secret and start redis with it
REDIS_PASS_FILE="/run/secrets/redis_password"
if [ ! -f "$REDIS_PASS_FILE" ]; then
  echo "Redis password secret not found at $REDIS_PASS_FILE" >&2
  exit 1
fi
REDIS_PASS="$(cat "$REDIS_PASS_FILE" | tr -d '\r\n')"

exec redis-server --appendonly yes --requirepass "$REDIS_PASS"
