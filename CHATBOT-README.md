# Simple Chatbot Project

This project consists of a FastAPI backend and a simple HTML/JS frontend for a chatbot.

## Backend (FastAPI)

- Endpoint: POST /chat
- Accepts JSON { "message": "<user message>" }
- Returns JSON { "reply": "<bot response>" }
- Uses simple bot logic: reply = "You said: <user message>"
- Includes CORS middleware to allow frontend requests
- Runs on port 8001

## Frontend

- index.html with:
  - Input box for user message
  - Send button
  - Chat display area
- JavaScript code that:
  - Sends message to backend /chat endpoint via fetch
  - Displays user message and bot reply in chat area
  - Includes basic styling for chat messages

## Folder Structure

```
backend/
  main.py
frontend/
  index.html
```

## How to Run

1. Start backend: `python -m uvicorn main:app --reload --port 8001`
2. Open frontend/index.html in browser

## Requirements

- Python with FastAPI and uvicorn installed
- Modern web browser

The application includes Swagger UI available at /docs for API documentation.