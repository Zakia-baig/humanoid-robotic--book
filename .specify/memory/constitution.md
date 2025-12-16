# Project Constitution: RAG Chatbot Backend

## Overview
This constitution governs the development of a production-ready Retrieval-Augmented Generation (RAG) chatbot backend built with Python, FastAPI, Qdrant Cloud, Cohere, and Google Gemini.

## Project Details
- **Project Name**: RAG Chatbot Backend
- **Primary Language**: Python
- **Framework**: FastAPI
- **Package Manager**: uv
- **Vector Database**: Qdrant Cloud
- **Embeddings Provider**: Cohere
- **LLM Provider**: Google Gemini
- **Repository Location**: robotic-book/backend/

## Core Principles

### Principle 1: Secure API Key Management
- **Rule**: All API keys must be loaded from environment variables; never hard-code API keys in source code.
- **Rationale**: Prevents accidental exposure of sensitive credentials and enables secure deployment across environments.

### Principle 2: Modular Architecture
- **Rule**: Components must be loosely coupled and highly cohesive, following FastAPI's dependency injection system.
- **Rationale**: Enables easier testing, maintenance, and scalability of the application.

### Principle 3: Production-Ready Error Handling
- **Rule**: All endpoints must implement proper error handling with appropriate HTTP status codes and meaningful error messages.
- **Rationale**: Ensures robust operation and provides clear feedback for debugging and monitoring.

### Principle 4: Type Safety
- **Rule**: All functions and API endpoints must use proper type hints following Python typing module conventions.
- **Rationale**: Reduces runtime errors and improves code maintainability and developer experience.

### Principle 5: Configuration Management
- **Rule**: Application configuration must be centralized and configurable through environment variables.
- **Rationale**: Allows flexible deployment across different environments without code changes.

### Principle 6: Observability
- **Rule**: All critical operations must include logging and metrics collection.
- **Rationale**: Enables effective monitoring, debugging, and performance optimization in production.

## Technical Constraints

### Mandatory Technologies
- Python 3.9+ for modern language features and performance
- FastAPI for high-performance web framework with automatic API documentation
- uv for fast package management and dependency resolution
- Qdrant Cloud for managed vector database services
- Cohere for reliable embedding generation
- Google Gemini for advanced language model capabilities

### Prohibited Practices
- Hard-coding API keys or sensitive information in source code
- Direct database connections without connection pooling
- Unhandled exceptions that could crash the application
- Blocking synchronous operations in async endpoints

## Governance

### Ratification Date
2025-12-15

### Last Amended Date
2025-12-15

### Constitution Version
1.0.0

### Amendment Procedure
Changes to this constitution require:
1. Discussion and approval by the development team
2. Pull request with clear justification for the change
3. Approval from at least one senior team member
4. Update to this document reflecting the changes

### Compliance Review
All code submissions must be reviewed for compliance with this constitution before merging.