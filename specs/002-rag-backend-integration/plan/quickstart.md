# Quickstart Guide: RAG Backend Integration

**Feature**: RAG Backend Integration with Qdrant Cloud, Cohere, and Google Gemini
**Date**: 2025-12-15

## Prerequisites

- Python 3.11 or higher
- uv package manager
- Access to Qdrant Cloud instance
- Cohere API key
- Google Gemini API key

## Setup Instructions

### 1. Clone and Navigate to Backend Directory
```bash
cd robotic-book/backend
```

### 2. Install Dependencies
```bash
# Using uv (recommended)
uv pip install -r requirements.txt

# Or using pip
pip install -r requirements.txt
```

### 3. Configure Environment Variables
Create a `.env` file in the backend directory with the following variables:

```env
QDRANT_URL=https://bd42405f-d691-43c4-8f3f-a46259289c2e.europe-west3-0.gcp.cloud.qdrant.io:6333
QDRANT_HOST=https://bd42405f-d691-43c4-8f3f-a46259289c2e.europe-west3-0.gcp.cloud.qdrant.io
QDRANT_API_KEY=your_qdrant_api_key_here
COHERE_API_KEY=your_cohere_api_key_here
GEMINI_API_KEY=your_gemini_api_key_here

# Optional configuration
HOST=0.0.0.0
PORT=8000
DEBUG=false
QDRANT_COLLECTION_NAME=documents
QDRANT_VECTOR_SIZE=1024
COHERE_MODEL=embed-english-v3.0
COHERE_INPUT_TYPE=search_document
GEMINI_MODEL=gemini-pro
```

### 4. Start the Server
```bash
# Using uvicorn directly
uvicorn main:app --reload

# Or run the main application
python main.py
```

The server will start on `http://localhost:8000` by default.

## Basic Usage

### 1. Verify Health
Check that all services are connected:
```bash
curl http://localhost:8000/health
```

Expected response:
```json
{
  "status": "healthy",
  "services": {
    "qdrant": "connected",
    "cohere": "connected",
    "gemini": "connected"
  }
}
```

### 2. Load Book Content
Load all .md and .mdx files from the `robotic-book/docs/` directory:
```bash
curl -X POST http://localhost:8000/admin/load-content
```

Expected response:
```json
{
  "documents_loaded": 24,
  "status": "completed"
}
```

### 3. Query the System
Ask questions about the book content:
```bash
curl -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -d '{
    "query": "What are the main components of a humanoid robot?",
    "context_length": 5
  }'
```

Expected response:
```json
{
  "response": "Humanoid robots typically consist of several key components...",
  "sources": [
    {
      "id": "doc123_0",
      "score": 0.85,
      "content_preview": "The main components of a humanoid robot include..."
    }
  ],
  "tokens_used": 150
}
```

## Development Workflow

### Running in Development Mode
```bash
# Enable debug mode by setting DEBUG=true in .env
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Testing the API
The API documentation is available at `http://localhost:8000/docs` when running in debug mode.

### Content Updates
When new content is added to the `robotic-book/docs/` directory:
1. Call the `/admin/load-content` endpoint again to refresh the vector database
2. The system will detect new or updated files and update the index accordingly

## Troubleshooting

### Common Issues

**API Keys Not Loading**:
- Verify your `.env` file is in the correct directory
- Check that environment variables are properly set
- Restart the server after updating the `.env` file

**Qdrant Connection Issues**:
- Verify the QDRANT_URL and QDRANT_API_KEY are correct
- Check that your Qdrant Cloud instance is accessible
- Ensure network connectivity to the Qdrant endpoint

**Cohere/Gemini API Errors**:
- Verify API keys are valid and have sufficient quota
- Check rate limits for the respective services
- Implement retry logic as needed

### Health Check Failures
If the health check endpoint returns a 503 status, check the application logs for specific error messages related to service connectivity.