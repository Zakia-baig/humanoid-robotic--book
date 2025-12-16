# Integrated Book Chatbot

This project includes a chatbot that is directly integrated into the existing book website. The chatbot uses the book content to answer user questions and works inside the same website where the book is hosted.

## Features

- **Content-Based Responses**: The chatbot reads book content from the `/docs` folder and answers questions based only on the book content
- **Integrated Frontend**: A chat widget is embedded directly into the existing website using Docusaurus theme customization
- **Responsive Design**: The chatbot has a responsive design that works on all device sizes
- **FastAPI Backend**: Lightweight backend with a single POST `/chat` endpoint
- **CORS Support**: Properly configured to work with the frontend

## Architecture

### Backend (FastAPI)
- **Location**: `backend/main.py`
- **Endpoint**: POST `/chat` - receives user questions and returns answers based on book content
- **Content Loading**: Automatically loads all markdown files from the `/docs` folder
- **Search Algorithm**: Uses keyword-based search to find relevant content chunks
- **Port**: 8001

### Frontend (React Component)
- **Location**: `src/components/Chatbot/`
- **Integration**: Integrated into all pages via Docusaurus theme customization (`src/theme/Layout/index.js`)
- **Features**:
  - Collapsible chat widget
  - Real-time messaging
  - Typing indicators
  - Timestamps
  - Responsive design

## How It Works

1. The backend loads all markdown files from the `/docs` directory when it starts
2. When a user asks a question, the backend performs a keyword-based search through the book content
3. The most relevant content chunks are returned to generate a response
4. The frontend displays the conversation in a chat interface embedded in the website

## Setup and Running

### Prerequisites
- Python 3.7+
- Node.js and npm (for the Docusaurus website)

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Start the backend server:
   ```bash
   python -m uvicorn main:app --reload --port 8001
   ```

### Frontend Setup
1. Install website dependencies (if not already installed):
   ```bash
   npm install
   ```

2. Start the Docusaurus development server:
   ```bash
   npm start
   ```

The chatbot will be available on all pages of the website as a floating widget in the bottom-right corner.

## Files Added/Modified

### Backend
- `backend/main.py` - FastAPI application with book content loader and chat endpoint
- `backend/requirements.txt` - Backend dependencies

### Frontend
- `src/components/Chatbot/Chatbot.js` - React component for the chat interface
- `src/components/Chatbot/Chatbot.css` - Styling for the chat component
- `src/components/Chatbot/index.js` - Export file for the component
- `src/theme/Layout/index.js` - Docusaurus theme wrapper to include chatbot on all pages

### Documentation
- `CHATBOT-README.md` - This file with setup instructions

## Usage

1. Start both the backend server and the Docusaurus website
2. Navigate to any page in the book website
3. Click the chat widget in the bottom-right corner to expand it
4. Type your question about humanoid robotics, physical AI, ROS2, Gazebo, Isaac, or Vision Language Action models
5. The chatbot will search the book content and provide relevant answers

## Customization

### Changing the Content Source
To change where the chatbot looks for content, modify the `docs_path` parameter in the `BookContentLoader` class in `backend/main.py`.

### Styling
The chatbot styles can be modified in `src/components/Chatbot/Chatbot.css`.

### Behavior
The search algorithm can be adjusted in the `search_content` method of the `BookContentLoader` class.