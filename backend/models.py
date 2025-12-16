from pydantic import BaseModel
from typing import List, Optional


class ChatRequest(BaseModel):
    query: str
    context_length: Optional[int] = 5


class SelectedTextRequest(BaseModel):
    selected_text: str
    question: str


class Source(BaseModel):
    id: str
    score: Optional[float] = None
    content_preview: str


class ChatResponse(BaseModel):
    response: str
    sources: List[Source]
    tokens_used: int


class IngestRequest(BaseModel):
    force_reload: Optional[bool] = False


class IngestResponse(BaseModel):
    documents_loaded: int
    status: str


class HealthResponse(BaseModel):
    status: str
    services: dict