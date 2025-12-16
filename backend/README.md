# RAG Chatbot Backend

A production-ready Retrieval-Augmented Generation (RAG) chatbot backend that integrates Qdrant Cloud, Cohere, and Google Gemini to provide contextual responses based on book content.

## Features

- **Document Ingestion**: Load and index .md and .mdx files from the docs directory
- **RAG Pipeline**: Retrieve relevant documents and generate contextual responses
- **Selected Text Q&A**: Ask questions about specific selected text
- **Health Checks**: Monitor service connectivity
- **Secure API Key Management**: All keys loaded from environment variables

## Prerequisites

- Python 3.11+
- Access to Qdrant Cloud instance
- Cohere API key
- Google Gemini API key

## Setup

1. Clone the repository
2. Navigate to the backend directory:
   ```bash
   cd robotic-book/backend
   ```

3. Create a virtual environment (optional but recommended):
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

4. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

5. Create a `.env` file by copying the example:
   ```bash
   cp .env.example .env
   ```

6. Update the `.env` file with your actual API keys and Qdrant configuration

## Running the Application

```bash
# Using uvicorn directly
uvicorn main:app --reload

# Or run the main application
python main.py
```

The server will start on `http://localhost:8000` by default.

## API Endpoints

### Health Check
```
GET /health
```
Verify that all services are connected and operational.

### Document Ingestion
```
POST /ingest
```
Load and index all .md and .mdx files from the docs directory into the vector database.

Request body (optional):
```json
{
  "force_reload": true
}
```

### Chat with Book Content
```
POST /chat
```
Submit a query and receive a response based on the book content.

Request body:
```json
{
  "query": "Your question about the book content",
  "context_length": 5
}
```

### Selected Text Q&A
```
POST /chat/selected-text
```
Ask questions about specific selected text.

Request body:
```json
{
  "selected_text": "The text that was selected by the user",
  "question": "Your question about the selected text"
}
```

## Testing

### Test Document Ingestion
```bash
curl -X POST http://localhost:8000/ingest \
  -H "Content-Type: application/json" \
  -d '{"force_reload": false}'
```

### Test Chat Functionality
```bash
curl -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -d '{
    "query": "What are the main components of a humanoid robot?",
    "context_length": 5
  }'
```

### Test Selected Text Functionality
```bash
curl -X POST http://localhost:8000/chat/selected-text \
  -H "Content-Type: application/json" \
  -d '{
    "selected_text": "Humanoid robots are robots with physical features that resemble the human body.",
    "question": "What does this mean?"
  }'
```

## Architecture

The backend follows a modular architecture:

- **Document Loader**: Loads .md and .mdx files from the docs directory
- **Chunking Service**: Splits documents into manageable chunks while preserving metadata
- **Embedding Service**: Generates embeddings using Cohere
- **Qdrant Service**: Stores and retrieves document embeddings
- **RAG Service**: Coordinates the retrieval and generation process
- **API Layer**: FastAPI endpoints for health checks and chat functionality

## Security

- All API keys are loaded from environment variables
- No hard-coded credentials in source code
- Proper error handling prevents sensitive information leakage