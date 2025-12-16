# Data Model: RAG Backend Integration

**Feature**: RAG Backend Integration with Qdrant Cloud, Cohere, and Google Gemini
**Date**: 2025-12-15
**Status**: Complete

## Document Entity

### Attributes
- **id** (string, required)
  - Unique identifier for the document chunk
  - Generated as combination of source file hash and chunk index
  - Format: `{source_file_hash}_{chunk_index}`

- **content** (string, required)
  - Text content of the document chunk
  - Maximum length: 4000 characters (to fit within embedding model limits)
  - Preserves original formatting and structure

- **embedding** (list[float], required)
  - Vector representation of the content
  - Length: 1024 (matching Cohere's embedding model)
  - Generated using Cohere's embed-english-v3.0 model

- **metadata** (object, required)
  - **source_file** (string, required): Original file path relative to docs directory
  - **chunk_index** (integer, required): Position of this chunk within the original document
  - **heading_hierarchy** (array[string], optional): List of headings leading to this chunk
  - **section_title** (string, optional): Title of the section containing this chunk
  - **document_title** (string, optional): Title of the parent document
  - **file_type** (string, required): File extension (md, mdx)
  - **created_at** (string, required): ISO timestamp of when chunk was created
  - **updated_at** (string, required): ISO timestamp of last update

### Relationships
- No direct relationships - stored as vector embeddings in Qdrant
- Retrieved based on semantic similarity during query processing

### Validation Rules
- content must be between 50 and 4000 characters
- embedding must be exactly 1024 elements
- source_file must be a valid path under docs directory
- chunk_index must be non-negative integer

## Query Entity

### Attributes
- **text** (string, required)
  - User input query text
  - Maximum length: 2000 characters

- **embedding** (list[float], required)
  - Vector representation of the query
  - Length: 1024 (matching Cohere's embedding model)
  - Generated using Cohere's embed-english-v3.0 model

- **timestamp** (string, required)
  - ISO timestamp when the query was processed
  - Format: YYYY-MM-DDTHH:mm:ss.sssZ

- **context_length** (integer, optional)
  - Number of relevant documents to retrieve (default: 5)
  - Range: 1-20

### Validation Rules
- text must be between 1 and 2000 characters
- embedding must be exactly 1024 elements
- context_length must be between 1 and 20

## Response Entity

### Attributes
- **text** (string, required)
  - Generated response from Google Gemini
  - Maximum length: 4000 characters

- **sources** (array[object], required)
  - List of document IDs used to generate the response
  - Each object contains:
    - **id** (string): Document chunk ID
    - **score** (float): Similarity score from vector search
    - **content_preview** (string): First 200 characters of the source chunk

- **tokens_used** (integer, required)
  - Number of tokens in the response
  - Used for cost tracking and performance metrics

- **timestamp** (string, required)
  - ISO timestamp when the response was generated
  - Format: YYYY-MM-DDTHH:mm:ss.sssZ

- **query_id** (string, optional)
  - ID of the original query (for tracking and analytics)

### Validation Rules
- text must be between 1 and 4000 characters
- sources array must have 0-20 elements
- tokens_used must be positive integer
- all scores in sources must be between 0 and 1

## Configuration Entity

### Attributes
- **qdrant_url** (string, required)
  - URL for Qdrant Cloud instance
  - Format: https://<cluster-id>.<region>.gcp.cloud.qdrant.io:6333

- **qdrant_api_key** (string, required)
  - API key for Qdrant Cloud authentication
  - Stored in environment variables only

- **cohere_api_key** (string, required)
  - API key for Cohere embedding service
  - Stored in environment variables only

- **gemini_api_key** (string, required)
  - API key for Google Gemini service
  - Stored in environment variables only

- **collection_name** (string, optional)
  - Name of Qdrant collection (default: "documents")

- **embedding_model** (string, optional)
  - Cohere model to use (default: "embed-english-v3.0")

- **gemini_model** (string, optional)
  - Gemini model to use (default: "gemini-pro")

- **chunk_size** (integer, optional)
  - Size of text chunks in characters (default: 1000)

- **chunk_overlap** (integer, optional)
  - Overlap between chunks in characters (default: 200)

### Validation Rules
- All API keys must be non-empty strings
- URLs must be valid HTTPS endpoints
- Model names must match valid API values
- Numeric values must be positive

## State Transitions

### Document State Model
Documents in the system follow this lifecycle:
1. **Created**: Document chunk is parsed from source file and assigned an ID
2. **Embedded**: Content is converted to vector representation using Cohere
3. **Stored**: Vector and metadata are stored in Qdrant Cloud
4. **Indexed**: Document is available for semantic search
5. **Updated**: When source content changes, document is re-embedded and stored
6. **Removed**: When source file is deleted, document is removed from Qdrant

### Query/Response State Model
1. **Received**: Query text is validated and accepted
2. **Embedded**: Query is converted to vector representation
3. **Searched**: Vector search is performed in Qdrant
4. **Contextualized**: Relevant documents are assembled into context
5. **Generated**: Response is generated using Google Gemini
6. **Returned**: Response with sources is returned to client