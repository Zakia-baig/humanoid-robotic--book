import logging
import google.generativeai as genai
from typing import List, Dict, Any
from config import settings
from document_loader import DocumentLoader
from chunking import TextChunker
from embedding_service import EmbeddingService
from qdrant_service import QdrantService

logger = logging.getLogger(__name__)


class RAGService:
    def __init__(self):
        # Initialize all required services
        self.embedding_service = EmbeddingService()
        self.qdrant_service = QdrantService()
        self.document_loader = DocumentLoader()
        self.chunker = TextChunker()

        # Configure Google Gemini
        if not settings.gemini_api_key:
            raise ValueError("GEMINI_API_KEY is required")

        genai.configure(api_key=settings.gemini_api_key)
        self.gemini_model = genai.GenerativeModel(settings.gemini_model)

    def load_and_index_documents(self, force_reload: bool = False):
        """
        Load documents from the docs directory, chunk them, generate embeddings, and store in Qdrant
        """
        try:
            if force_reload:
                logger.info("Force reload requested - deleting existing collection")
                self.qdrant_service.delete_collection()
                # Recreate the collection
                self.qdrant_service._ensure_collection_exists()

            # Check if collection is empty or reload is forced
            current_count = self.qdrant_service.count_points()
            if current_count > 0 and not force_reload:
                logger.info(f"Collection already has {current_count} points. Skipping reload unless force_reload=True")
                return {"documents_loaded": current_count, "status": "skipped"}

            # Load documents
            documents = self.document_loader.load_documents()
            if not documents:
                logger.warning("No documents found to load")
                return {"documents_loaded": 0, "status": "no_documents"}

            # Chunk documents
            all_chunks = self.chunker.chunk_documents(documents)

            # Generate embeddings for all chunks
            texts_to_embed = [chunk["content"] for chunk in all_chunks]
            embeddings = self.embedding_service.embed_texts(texts_to_embed)

            # Add embeddings to chunks
            for i, chunk in enumerate(all_chunks):
                chunk["embedding"] = embeddings[i]

            # Store in Qdrant
            self.qdrant_service.store_embeddings(all_chunks)

            return {
                "documents_loaded": len(all_chunks),
                "status": "completed"
            }
        except Exception as e:
            logger.error(f"Error loading and indexing documents: {str(e)}")
            raise

    def query(self, query_text: str, context_length: int = 5) -> Dict[str, Any]:
        """
        Process a query using RAG - retrieve relevant documents and generate response
        """
        try:
            # Generate embedding for the query
            query_embedding = self.embedding_service.embed_query(query_text)

            # Search for relevant documents
            search_results = self.qdrant_service.search(query_embedding, limit=context_length)

            if not search_results:
                return {
                    "response": "I couldn't find any relevant information in the book content to answer your question.",
                    "sources": [],
                    "tokens_used": 0
                }

            # Build context from search results
            context_parts = []
            sources = []
            for result in search_results:
                context_parts.append(result["content"])
                sources.append({
                    "id": result["id"],
                    "score": result["score"],
                    "content_preview": result["content"][:200] + "..." if len(result["content"]) > 200 else result["content"]
                })

            context = "\n\n".join(context_parts)

            # Generate response using Gemini with the context
            prompt = f"""
            Context information is below.
            --------------------
            {context}
            --------------------
            Given the context information and not prior knowledge, answer the query.
            If the context doesn't contain enough information to answer the query, say so.
            Query: {query_text}
            Answer:
            """

            response = self.gemini_model.generate_content(prompt)

            # Extract text from response (handle potential safety filtering)
            if response.candidates:
                response_text = response.candidates[0].content.parts[0].text
            else:
                response_text = "The response was blocked due to safety filters."

            return {
                "response": response_text,
                "sources": sources,
                "tokens_used": len(response_text.split())
            }
        except Exception as e:
            logger.error(f"Error processing query: {str(e)}")
            raise

    def query_selected_text(self, selected_text: str, question: str) -> Dict[str, Any]:
        """
        Process a query based on selected text
        """
        try:
            # Generate response using Gemini with the selected text as context
            prompt = f"""
            Context information is below.
            --------------------
            {selected_text}
            --------------------
            Given the context information, answer the following question.
            Question: {question}
            Answer:
            """

            response = self.gemini_model.generate_content(prompt)

            # Extract text from response (handle potential safety filtering)
            if response.candidates:
                response_text = response.candidates[0].content.parts[0].text
            else:
                response_text = "The response was blocked due to safety filters."

            return {
                "response": response_text,
                "sources": [{"id": "selected_text", "content_preview": selected_text[:200]}],
                "tokens_used": len(response_text.split())
            }
        except Exception as e:
            logger.error(f"Error processing selected text query: {str(e)}")
            raise