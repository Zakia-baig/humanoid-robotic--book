import logging
from typing import List, Dict, Any, Optional
from qdrant_client import QdrantClient
from qdrant_client.http import models
from qdrant_client.models import PointStruct
from config import settings

logger = logging.getLogger(__name__)


class QdrantService:
    def __init__(self):
        # Try to initialize with cloud Qdrant first
        if settings.qdrant_url and settings.qdrant_api_key:
            try:
                # Initialize Qdrant client with cloud
                self.client = QdrantClient(
                    url=settings.qdrant_url,
                    api_key=settings.qdrant_api_key,
                    prefer_grpc=True
                )
                logger.info("Connected to Qdrant Cloud successfully")
            except Exception as e:
                logger.warning(f"Failed to connect to Qdrant Cloud: {e}. Using local in-memory storage as fallback.")
                # Fallback to local in-memory storage
                self.client = QdrantClient(":memory:")
        else:
            logger.info("QDRANT credentials not provided. Using local in-memory storage.")
            # Use local in-memory storage
            self.client = QdrantClient(":memory:")

        self.collection_name = settings.qdrant_collection_name
        self.vector_size = settings.qdrant_vector_size

        # Ensure collection exists
        self._ensure_collection_exists()

    def _ensure_collection_exists(self):
        """
        Ensure the collection exists with proper configuration
        """
        try:
            # Check if collection exists
            collections = self.client.get_collections()
            collection_names = [c.name for c in collections.collections]

            if self.collection_name not in collection_names:
                # Create the collection
                self.client.create_collection(
                    collection_name=self.collection_name,
                    vectors_config=models.VectorParams(
                        size=self.vector_size,
                        distance=models.Distance.COSINE
                    )
                )
                logger.info(f"Created Qdrant collection: {self.collection_name}")
            else:
                logger.info(f"Qdrant collection exists: {self.collection_name}")
        except Exception as e:
            logger.warning(f"Error ensuring collection exists (this may be expected with in-memory storage): {e}")
            # For in-memory storage, we'll try to create the collection directly
            try:
                self.client.create_collection(
                    collection_name=self.collection_name,
                    vectors_config=models.VectorParams(
                        size=self.vector_size,
                        distance=models.Distance.COSINE
                    )
                )
                logger.info(f"Created Qdrant collection in memory: {self.collection_name}")
            except Exception as e2:
                logger.info(f"Collection may already exist or in-memory mode is active: {e2}")

    def store_embeddings(self, chunks: List[Dict[str, Any]]):
        """
        Store document chunks with their embeddings in Qdrant
        """
        try:
            points = []
            for chunk in chunks:
                point = PointStruct(
                    id=chunk["id"],
                    vector=chunk["embedding"],
                    payload={
                        "content": chunk["content"],
                        "metadata": chunk["metadata"]
                    }
                )
                points.append(point)

            # Upsert points into the collection
            self.client.upsert(
                collection_name=self.collection_name,
                points=points
            )

            logger.info(f"Stored {len(points)} embeddings in Qdrant")
        except Exception as e:
            logger.error(f"Error storing embeddings in Qdrant: {str(e)}")
            raise

    def search(self, query_embedding: List[float], limit: int = 5) -> List[Dict[str, Any]]:
        """
        Search for similar documents based on query embedding
        """
        try:
            search_results = self.client.query_points(
                collection_name=self.collection_name,
                query=query_embedding,
                limit=limit
            )

            results = []
            for hit in search_results.points:
                result = {
                    "id": hit.id,
                    "content": hit.payload["content"],
                    "metadata": hit.payload["metadata"],
                    "score": hit.score
                }
                results.append(result)

            logger.info(f"Found {len(results)} similar documents")
            return results
        except Exception as e:
            logger.warning(f"Error searching in Qdrant: {str(e)}")
            # Return empty results if search fails
            return []

    def delete_collection(self):
        """
        Delete the entire collection (useful for re-indexing)
        """
        try:
            self.client.delete_collection(self.collection_name)
            logger.info(f"Deleted Qdrant collection: {self.collection_name}")
        except Exception as e:
            logger.error(f"Error deleting collection: {str(e)}")
            raise

    def count_points(self) -> int:
        """
        Count the number of points in the collection
        """
        try:
            count_result = self.client.count(
                collection_name=self.collection_name
            )
            return count_result.count
        except Exception as e:
            logger.warning(f"Error counting points: {str(e)}")
            return 0