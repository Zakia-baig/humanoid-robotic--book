import logging
import uuid
from typing import List, Dict, Any
from config import settings

logger = logging.getLogger(__name__)


class TextChunker:
    def __init__(self, chunk_size: int = 1000, overlap: int = 200):
        self.chunk_size = chunk_size
        self.overlap = overlap

    def chunk_document(self, document: Dict[str, Any]) -> List[Dict[str, Any]]:
        """
        Chunk a document into smaller pieces with metadata preservation
        """
        content = document["content"]
        source_file = document["metadata"]["source_file"]

        chunks = []
        start_idx = 0

        while start_idx < len(content):
            # Determine the end index for this chunk
            end_idx = start_idx + self.chunk_size

            # If this is not the first chunk, include overlap
            if start_idx > 0:
                overlap_start = start_idx - self.overlap
                if overlap_start < 0:
                    overlap_start = 0
                chunk_content = content[overlap_start:end_idx]
                # Adjust start_idx to be after the overlap
                actual_start = self.overlap
            else:
                chunk_content = content[start_idx:end_idx]
                actual_start = 0

            # Create the actual chunk content without overlap prefix (for the first chunk)
            if start_idx > 0:
                actual_chunk_content = chunk_content[self.overlap:]
            else:
                actual_chunk_content = chunk_content

            # Ensure we don't exceed the content length
            if len(actual_chunk_content) == 0:
                break

            chunk_id = str(uuid.uuid4())

            chunk = {
                "id": chunk_id,
                "content": actual_chunk_content,
                "metadata": {
                    **document["metadata"],
                    "chunk_index": len(chunks),
                    "source_chunk_start": start_idx,
                    "source_chunk_end": start_idx + len(actual_chunk_content)
                }
            }

            chunks.append(chunk)
            start_idx = min(start_idx + self.chunk_size, len(content))

            # Break if we've reached the end
            if start_idx >= len(content):
                break

        logger.info(f"Document {source_file} chunked into {len(chunks)} pieces")
        return chunks

    def chunk_documents(self, documents: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """
        Chunk multiple documents
        """
        all_chunks = []
        for doc in documents:
            chunks = self.chunk_document(doc)
            all_chunks.extend(chunks)

        logger.info(f"Total of {len(all_chunks)} chunks created from {len(documents)} documents")
        return all_chunks