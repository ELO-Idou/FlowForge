"""Configuration module exposing strongly typed settings objects."""

from typing import Iterable, Union

from pydantic import ConfigDict, Field, model_validator
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Application-wide configuration values loaded from environment."""
    database_url: str = (
        "postgresql://automation_user:"
        "SecurePass123!@localhost:5432/automation_db"
    )
    redis_url: str = "redis://localhost:6379/0"
    gemini_api_key: str = ""
    gemini_model: str = "gemini-2.0-flash-exp"
    deepseek_api_key: str = ""
    deepseek_model: str = "deepseek-chat"
    ai_provider: str = "gemini"  # Options: "gemini" or "deepseek"
    secret_key: str = "change-me"
    allowed_origins: Union[list[str], str, None] = Field(
        default_factory=lambda: ["http://localhost:3000"]
    )
    n8n_base_url: str = "http://localhost:5678"
    n8n_api_key: str = ""
    n8n_basic_auth_user: str = ""
    n8n_basic_auth_password: str = ""
    environment: str = "development"
    debug: bool = False

    model_config = ConfigDict(env_file=".env")

    @staticmethod
    def _normalize_origins(
        value: Union[list[str], str, Iterable[str], None],
    ) -> list[str]:
        """Coerce any supported env format into a unique, trimmed list."""
        if value is None or value == "":
            return ["http://localhost:3000"]
        if isinstance(value, str):
            return [item.strip() for item in value.split(",") if item.strip()]
        if isinstance(value, Iterable):
            return [str(item).strip() for item in value if str(item).strip()]
        raise TypeError("Invalid allowed_origins configuration")

    @model_validator(mode="after")
    def _coerce_allowed_origins(self) -> "Settings":
        normalized = self._normalize_origins(self.allowed_origins)
        object.__setattr__(self, "allowed_origins", normalized)
        return self


settings = Settings()
