from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from typing import Dict, Any
from rag_service import RAGService


app = FastAPI(title="Book Chatbot API", version="1.0.0")

# Initialize the RAG service
rag_service = RAGService()

# Load and index documents on startup
try:
    indexing_result = rag_service.load_and_index_documents()
    print(f"Document indexing completed: {indexing_result}")
except Exception as e:
    print(f"Error during document indexing: {e}")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)






@app.post("/chat")
async def chat(message_data: dict):
    """
    Chat endpoint that accepts a user question and returns an answer based on book content
    Expected input: {"message": "<user question>"}
    Returns: {"reply": "<bot response based on book content>"}
    """
    user_question = message_data.get("message", "")

    if not user_question.strip():
        return {"reply": "Please ask a question about the humanoid robotics book."}

    try:
        # Use the RAG service to get a response based on the book content
        result = rag_service.query(user_question)

        # Return the response from the RAG service
        response_text = result["response"]

        # Ensure the response is clearly based on book content
        if "I couldn't find any relevant information" in response_text or "not covered" in response_text:
            return {
                "reply": "This question is not covered in the Humanoid Robotics Book."
            }
        else:
            return {"reply": response_text}

    except Exception as e:
        # Handle any errors in the RAG service
        print(f"Error processing query: {str(e)}")
        return {
            "reply": "Sorry, there was an error processing your question. Please try again."
        }




@app.get("/")
async def root():
    return {"message": "Book Chatbot API is running!", "endpoints": ["/chat"]}


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8001, reload=True)