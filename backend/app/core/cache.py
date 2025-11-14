"""Redis cache utilities for creating shared connections."""

import redis

from ..config import settings


def get_redis_client() -> redis.Redis:
    """Instantiate a Redis client using the configured connection string."""
    return redis.Redis.from_url(settings.redis_url)
