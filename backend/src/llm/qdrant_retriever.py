from typing import Any, List
from langchain.schema import BaseRetriever, Document
from pydantic import Field

from src.database.Qudrant_client import qdrant_manager
from src.utils import get_embeddings


class QdrantRetriever(BaseRetriever):
    qm: Any = Field(..., description="Qdrant manager instance")

    def _get_relevant_documents(self, query: str, **kwargs) -> List[Document]:
        # Convert query to vector
        query_vector = get_embeddings([query])[0]

        # Search in Qdrant
        results = self.qm.search(query_vector=query_vector)

        # Extract text
        texts = self.qm.get_text_from_results(results)

        # Return as LangChain Document objects
        return [Document(page_content=t) for t in texts.split("\n") if t]


# ✅ Singleton retriever instance
retriever = QdrantRetriever(qm=qdrant_manager)
