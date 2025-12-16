"""
Simple test script to verify the backend implementation
"""
import asyncio
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

from config import settings
from rag_service import RAGService
from document_loader import DocumentLoader
from embedding_service import EmbeddingService
from qdrant_client import QdrantService

def test_configuration():
    """Test that all required configuration is available"""
    print("Testing configuration...")

    assert settings.qdrant_url, "QDRANT_URL is required"
    assert settings.qdrant_api_key, "QDRANT_API_KEY is required"
    assert settings.cohere_api_key, "COHERE_API_KEY is required"
    assert settings.gemini_api_key, "GEMINI_API_KEY is required"

    print("✓ All required configuration is present")


def test_services_initialization():
    """Test that all services can be initialized"""
    print("\nTesting service initialization...")

    try:
        embedding_service = EmbeddingService()
        print("✓ Embedding service initialized")
    except Exception as e:
        print(f"✗ Embedding service failed: {e}")
        return False

    try:
        qdrant_service = QdrantService()
        print("✓ Qdrant service initialized")
    except Exception as e:
        print(f"✗ Qdrant service failed: {e}")
        return False

    try:
        rag_service = RAGService()
        print("✓ RAG service initialized")
    except Exception as e:
        print(f"✗ RAG service failed: {e}")
        return False

    return True


def test_document_loading():
    """Test document loading functionality"""
    print("\nTesting document loading...")

    try:
        loader = DocumentLoader()
        documents = loader.load_documents()
        print(f"✓ Loaded {len(documents)} documents")
        return True
    except Exception as e:
        print(f"✗ Document loading failed: {e}")
        return False


def test_embedding_generation():
    """Test embedding generation"""
    print("\nTesting embedding generation...")

    try:
        embedding_service = EmbeddingService()
        test_text = "This is a test sentence for embedding."
        embedding = embedding_service.embed_text(test_text)

        assert len(embedding) == 1024, f"Expected 1024-dim embedding, got {len(embedding)}"
        print(f"✓ Generated {len(embedding)}-dimensional embedding")
        return True
    except Exception as e:
        print(f"✗ Embedding generation failed: {e}")
        return False


def run_tests():
    """Run all tests"""
    print("Running backend implementation tests...\n")

    all_passed = True

    # Test configuration
    test_configuration()

    # Test services
    if not test_services_initialization():
        all_passed = False

    # Test document loading
    if not test_document_loading():
        all_passed = False

    # Test embedding
    if not test_embedding_generation():
        all_passed = False

    print(f"\n{'='*50}")
    if all_passed:
        print("✓ All tests passed! Backend implementation is ready.")
    else:
        print("✗ Some tests failed. Please check the implementation.")
    print(f"{'='*50}")

    return all_passed


if __name__ == "__main__":
    run_tests()