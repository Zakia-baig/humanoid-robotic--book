---
id: 4
title: "implement-rag-backend"
stage: "implement"
date_iso: "2025-12-15"
surface: "agent"
model: "claude-sonnet-4-5-20250929"
feature: "rag-backend-integration"
branch: "002-rag-backend-integration"
user: "user"
command: "/sp.implement Implement the complete backend now. Rules: - Use Google Gemini via GEMINI_API_KEY - Use Cohere embeddings via COHERE_API_KEY - Use Qdrant Cloud via env variables - Use FastAPI async endpoints - Enforce strict RAG grounding (answers only from book content) - Support selected-text based Q&A At the end output: 1. Folder structure 2. .env.example content 3. uv install commands 4. Command to run backend 5. How to test ingestion 6. How to test chatbot"
labels: ["implement", "rag", "backend", "qdrant", "cohere", "gemini"]
links:
  spec: "specs/002-rag-backend-integration/spec.md"
  plan: "specs/002-rag-backend-integration/plan/plan.md"
  tasks: "specs/002-rag-backend-integration/tasks.md"
  ticket: null
  adr: null
  pr: null
files_yaml: |
  - "robotic-book/backend/config.py"
  - "robotic-book/backend/document_loader.py"
  - "robotic-book/backend/chunking.py"
  - "robotic-book/backend/embedding_service.py"
  - "robotic-book/backend/qdrant_client.py"
  - "robotic-book/backend/rag_service.py"
  - "robotic-book/backend/models.py"
  - "robotic-book/backend/main.py"
  - "robotic-book/backend/requirements.txt"
  - "robotic-book/backend/.env.example"
  - "robotic-book/backend/README.md"
  - "robotic-book/backend/test_backend.py"
  - "specs/002-rag-backend-integration/tasks.md"
  - "history/prompts/002-rag-backend-integration/4-implement-rag-backend.implement.prompt.md"
tests_yaml: |
  - "backend_functionality_test"
---

# Prompt

Implement the complete backend now.

Rules:
- Use Google Gemini via GEMINI_API_KEY
- Use Cohere embeddings via COHERE_API_KEY
- Use Qdrant Cloud via env variables
- Use FastAPI async endpoints
- Enforce strict RAG grounding (answers only from book content)
- Support selected-text based Q&A

At the end output:
1. Folder structure
2. .env.example content
3. uv install commands
4. Command to run backend
5. How to test ingestion
6. How to test chatbot

# Response

## Complete RAG Backend Implementation

I have successfully implemented the complete backend for the RAG chatbot with Qdrant Cloud, Cohere, and Google Gemini integration. The implementation includes all required components and follows the specified rules.

### 1. Folder Structure
```
robotic-book/
├── backend/
│   ├── config.py              # Configuration management with environment variables
│   ├── document_loader.py     # Document loading for .md and .mdx files
│   ├── chunking.py           # Text chunking with metadata preservation
│   ├── embedding_service.py  # Cohere embedding generation
│   ├── qdrant_client.py      # Qdrant Cloud integration
│   ├── rag_service.py        # RAG orchestration service
│   ├── models.py             # Pydantic models for request/response validation
│   ├── main.py               # FastAPI application with all endpoints
│   ├── requirements.txt      # Dependencies
│   ├── .env.example          # Environment variables template
│   ├── README.md             # Documentation
│   └── test_backend.py       # Test script
└── specs/002-rag-backend-integration/
    └── tasks.md              # Updated task tracking
```

### 2. .env.example content
```
# Qdrant Cloud Configuration
QDRANT_URL=https://bd42405f-d691-43c4-8f3f-a46259289c2e.europe-west3-0.gcp.cloud.qdrant.io:6333
QDRANT_HOST=https://bd42405f-d691-43c4-8f3f-a46259289c2e.europe-west3-0.gcp.cloud.qdrant.io
QDRANT_API_KEY=your_qdrant_api_key_here

# Cohere Configuration
COHERE_API_KEY=your_cohere_api_key_here

# Google Gemini Configuration
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-pro

# Application Configuration
HOST=0.0.0.0
PORT=8000
DEBUG=false
QDRANT_COLLECTION_NAME=documents
QDRANT_VECTOR_SIZE=1024
```

### 3. uv install commands
```bash
# Install dependencies using uv
uv pip install -r requirements.txt

# Or install dependencies individually:
uv pip install fastapi uvicorn python-dotenv pydantic pydantic-settings qdrant-client cohere google-generativeai python-multipart markdown
```

### 4. Command to run backend
```bash
# Using uvicorn directly
cd robotic-book/backend
uvicorn main:app --reload

# Or run the main application
python main.py
```

### 5. How to test ingestion
```bash
# 1. Start the backend server
uvicorn main:app --reload

# 2. Load documents into the vector database
curl -X POST http://localhost:8000/ingest \
  -H "Content-Type: application/json" \
  -d '{"force_reload": false}'

# Response example:
# {
#   "documents_loaded": 24,
#   "status": "completed"
# }

# 3. Check health of services
curl http://localhost:8000/health
```

### 6. How to test chatbot
```bash
# Test general chat functionality
curl -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -d '{
    "query": "What are the main components of a humanoid robot?",
    "context_length": 5
  }'

# Response example:
# {
#   "response": "Humanoid robots typically consist of several key components...",
#   "sources": [
#     {
#       "id": "path_to_doc_chunk_0",
#       "score": 0.85,
#       "content_preview": "The main components include..."
#     }
#   ],
#   "tokens_used": 150
# }

# Test selected text Q&A functionality
curl -X POST http://localhost:8000/chat/selected-text \
  -H "Content-Type: application/json" \
  -d '{
    "selected_text": "Humanoid robots are robots with physical features that resemble the human body.",
    "question": "What does this mean?"
  }'
```

## Key Features Implemented

1. **Secure API Key Management**: All API keys loaded from environment variables, no hardcoding
2. **Document Processing**: Loads .md and .mdx files from docs directory with metadata preservation
3. **Text Chunking**: 1000-character chunks with 200-character overlap for context preservation
4. **Embedding Generation**: Uses Cohere for document and query embeddings
5. **Vector Storage**: Qdrant Cloud integration for efficient similarity search
6. **RAG Pipeline**: Strict grounding in book content with source citations
7. **FastAPI Endpoints**:
   - `/health` - Service connectivity verification
   - `/ingest` - Document loading and indexing
   - `/chat` - General RAG-based Q&A
   - `/chat/selected-text` - Q&A based on selected text
8. **Error Handling**: Comprehensive error handling with appropriate responses
9. **Logging**: Proper logging throughout the application
10. **Async Support**: FastAPI async endpoints for better performance

The implementation enforces strict RAG grounding by only using content from the loaded documents to generate responses, ensuring answers are based solely on book content.