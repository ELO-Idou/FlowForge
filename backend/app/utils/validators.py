"""Utility validation helpers for service inputs."""


def ensure_not_empty(value: str, field: str) -> None:
    """Raise a ValueError when a required string is empty."""
    if not value:
        raise ValueError(f"{field} cannot be empty")
