import os
from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List

class Settings(BaseSettings):
    FORTYGUARD_MODE: str = "mock"
    FORTYGUARD_API_KEY: str = ""
    FORTYGUARD_BASE_URL: str = "https://api.fortyguard.com/v1"
    
    AI_PROVIDER: str = "mock"
    AI_API_KEY: str = ""
    
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    ALLOWED_ORIGINS: str = "http://localhost:5173,http://127.0.0.1:5173,http://localhost:3000"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )

    @property
    def cors_origins(self) -> List[str]:
        return [origin.strip() for origin in self.ALLOWED_ORIGINS.split(",") if origin.strip()]

settings = Settings()
