from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    # Qdrant configuration
    qdrant_api_key: Optional[str] = None
    qdrant_url: Optional[str] = None
    qdrant_host: Optional[str] = None
    qdrant_port: Optional[int] = None
    qdrant_collection_name: str = "documents"
    qdrant_vector_size: int = 1024

    # Cohere configuration
    cohere_api_key: Optional[str] = None
    cohere_model: str = "embed-english-v3.0"
    cohere_input_type: str = "search_document"

    # Google Gemini configuration
    gemini_api_key: Optional[str] = None
    gemini_model: str = "gemini-1.0-pro"

    # Application configuration
    host: str = "0.0.0.0"
    port: int = 8000
    debug: bool = False

    class Config:
        env_file = ".env"
        case_sensitive = False


# Create a single instance of settings
settings = Settings()