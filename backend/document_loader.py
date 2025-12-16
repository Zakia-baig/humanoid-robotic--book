import os
import logging
import uuid
from typing import List, Dict, Any
from pathlib import Path
import markdown
import trafilatura
from config import settings

logger = logging.getLogger(__name__)


class DocumentLoader:
    def __init__(self, docs_path: str = "../docs"):
        self.docs_path = Path(docs_path)

    def load_documents(self) -> List[Dict[str, Any]]:
        """
        Load all .md and .mdx files from the docs directory
        """
        documents = []

        if not self.docs_path.exists():
            logger.warning(f"Docs directory does not exist: {self.docs_path}")
            return documents

        # Find all .md and .mdx files
        md_files = list(self.docs_path.rglob("*.md"))
        mdx_files = list(self.docs_path.rglob("*.mdx"))

        all_files = md_files + mdx_files
        logger.info(f"Found {len(all_files)} files to process")

        for file_path in all_files:
            try:
                relative_path = file_path.relative_to(self.docs_path.parent)
                content = self._read_file(file_path)

                if content:
                    document = {
                        "id": str(uuid.uuid4()),
                        "content": content,
                        "metadata": {
                            "source_file": str(relative_path),
                            "file_type": file_path.suffix,
                            "created_at": os.path.getctime(str(file_path)),
                            "updated_at": os.path.getmtime(str(file_path))
                        }
                    }
                    documents.append(document)
            except Exception as e:
                logger.error(f"Error processing file {file_path}: {str(e)}")
                continue

        logger.info(f"Successfully loaded {len(documents)} documents")
        return documents

    def _read_file(self, file_path: Path) -> str:
        """
        Read content from a file, handling both .md and .mdx formats
        """
        try:
            with open(file_path, 'r', encoding='utf-8') as file:
                content = file.read()

            # For .md files, we can use markdown library to parse
            if file_path.suffix == '.md':
                # Extract content without processing to preserve raw text
                # Remove YAML frontmatter if present
                if content.strip().startswith('---'):
                    parts = content.split('---', 2)
                    if len(parts) >= 3:
                        content = parts[2]

            # Use trafilatura for content extraction if needed
            # For now, return the raw content
            return content.strip()
        except Exception as e:
            logger.error(f"Error reading file {file_path}: {str(e)}")
            return ""