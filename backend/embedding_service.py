import logging
import cohere
from typing import List, Dict, Any
from config import settings

logger = logging.getLogger(__name__)


class EmbeddingService:
    def __init__(self):
        if not settings.cohere_api_key:
            raise ValueError("COHERE_API_KEY is required")

        self.client = cohere.Client(api_key=settings.cohere_api_key)
        self.model = "embed-english-v3.0"
        self.input_type = "search_document"

    def embed_text(self, text: str) -> List[float]:
        """
        Generate embedding for a single text
        """
        try:
            response = self.client.embed(
                texts=[text],
                model=self.model,
                input_type=self.input_type
            )
            return response.embeddings[0]
        except Exception as e:
            logger.error(f"Error generating embedding for text: {str(e)}")
            raise

    def embed_texts(self, texts: List[str]) -> List[List[float]]:
        """
        Generate embeddings for multiple texts
        """
        try:
            response = self.client.embed(
                texts=texts,
                model=self.model,
                input_type=self.input_type
            )
            return response.embeddings
        except Exception as e:
            logger.error(f"Error generating embeddings for texts: {str(e)}")
            raise

    def embed_query(self, query: str) -> List[float]:
        """
        Generate embedding for a query (with different input type)
        """
        try:
            response = self.client.embed(
                texts=[query],
                model=self.model,
                input_type="search_query"
            )
            return response.embeddings[0]
        except Exception as e:
            logger.error(f"Error generating query embedding: {str(e)}")
            raise