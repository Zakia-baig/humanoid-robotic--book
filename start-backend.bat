@echo off
echo Starting Chatbot Backend Server...
cd backend
python -m uvicorn main:app --reload --port 8001