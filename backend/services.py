import logging
from typing import List, Optional
from qdrant_client import QdrantClient
from qdrant_client.http import models
from cohere import Client as CohereClient
import google.generativeai as genai
from config import settings


logger = logging.getLogger(__name__)


class RAGService:
    def __init__(self):
        # Initialize Qdrant client
        if settings.qdrant_api_key and settings.qdrant_url:
            self.qdrant_client = QdrantClient(
                url=settings.qdrant_url,
                api_key=settings.qdrant_api_key,
            )
        else:
            # For local development without cloud
            self.qdrant_client = QdrantClient(":memory:")  # In-memory for testing

        # Initialize Cohere client
        if settings.cohere_api_key:
            self.cohere_client = CohereClient(api_key=settings.cohere_api_key)
        else:
            raise ValueError("COHERE_API_KEY is required")

        # Initialize Google Gemini
        if settings.gemini_api_key:
            genai.configure(api_key=settings.gemini_api_key)
            self.gemini_model = genai.GenerativeModel(settings.gemini_model)
        else:
            raise ValueError("GEMINI_API_KEY is required")

        # Create collection if it doesn't exist
        self._ensure_collection_exists()

    def _ensure_collection_exists(self):
        """Ensure the Qdrant collection exists with the proper configuration."""
        try:
            # Check if collection exists
            collections = self.qdrant_client.get_collections()
            collection_names = [c.name for c in collections.collections]

            if settings.qdrant_collection_name not in collection_names:
                # Create the collection
                self.qdrant_client.create_collection(
                    collection_name=settings.qdrant_collection_name,
                    vectors_config=models.VectorParams(
                        size=settings.qdrant_vector_size,
                        distance=models.Distance.COSINE
                    )
                )
                logger.info(f"Created Qdrant collection: {settings.qdrant_collection_name}")
            else:
                logger.info(f"Qdrant collection exists: {settings.qdrant_collection_name}")
        except Exception as e:
            logger.error(f"Error ensuring collection exists: {e}")
            raise

    def embed_text(self, text: str) -> List[float]:
        """Generate embeddings for a text using Cohere."""
        try:
            response = self.cohere_client.embed(
                texts=[text],
                model=settings.cohere_model,
                input_type=settings.cohere_input_type
            )
            return response.embeddings[0]
        except Exception as e:
            logger.error(f"Error generating embeddings: {e}")
            raise

    def search_documents(self, query_embedding: List[float], limit: int = 5) -> List[dict]:
        """Search for relevant documents in Qdrant."""
        try:
            search_result = self.qdrant_client.search(
                collection_name=settings.qdrant_collection_name,
                query_vector=query_embedding,
                limit=limit
            )

            results = []
            for hit in search_result:
                results.append({
                    "id": hit.id,
                    "payload": hit.payload,
                    "score": hit.score
                })

            return results
        except Exception as e:
            logger.error(f"Error searching documents: {e}")
            raise

    def generate_response(self, context: str, query: str) -> str:
        """Generate a response using Google Gemini with the provided context."""
        try:
            prompt = f"""
            Context information is below.
            --------------------
            {context}
            --------------------
            Given the context information and not prior knowledge, answer the query.
            Query: {query}
            Answer:
            """

            response = self.gemini_model.generate_content(prompt)
            return response.text
        except Exception as e:
            logger.error(f"Error generating response: {e}")
            raise

    def add_document(self, text: str, doc_id: Optional[str] = None, metadata: Optional[dict] = None):
        """Add a document to the Qdrant collection."""
        try:
            # Generate embedding for the text
            embedding = self.embed_text(text)

            # Prepare the point
            point = models.PointStruct(
                id=doc_id or str(hash(text))[:16],  # Generate a simple ID if not provided
                vector=embedding,
                payload={
                    "text": text,
                    **(metadata or {})
                }
            )

            # Insert the point into the collection
            self.qdrant_client.upsert(
                collection_name=settings.qdrant_collection_name,
                points=[point]
            )

            logger.info(f"Added document to collection: {doc_id}")
        except Exception as e:
            logger.error(f"Error adding document: {e}")
            raise