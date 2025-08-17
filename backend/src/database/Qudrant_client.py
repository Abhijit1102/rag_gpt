import hashlib
from qdrant_client.http.models import Distance, VectorParams, PointStruct, ScoredPoint
from src.database.Qudrant_connection import qdrant_client
from src.config import config
from src.logger import logger

class QdrantManager:
    _instance = None

    def __new__(cls, *args, **kwargs):
        if cls._instance is None:
            cls._instance = super(QdrantManager, cls).__new__(cls)
        return cls._instance

    def __init__(self):
        if hasattr(self, "_initialized") and self._initialized:
            return

        if not qdrant_client:
            raise ValueError("Qdrant client is not initialized.")

        self.client = qdrant_client
        self.vector_size = 384
        self.collection_name = config.QDRANT_COLLECTION_NAME
        self._initialized = True

    def create_collection(self):
        try:
            self.client.get_collection(self.collection_name)
            logger.info(f"ℹ️ Collection '{self.collection_name}' already exists.")
        except Exception:
            self.client.create_collection(
                collection_name=self.collection_name,
                vectors_config=VectorParams(size=self.vector_size, distance=Distance.COSINE)
            )
            logger.info(f"✅ Collection '{self.collection_name}' created with vector size {self.vector_size}.")

    def delete_collection(self):
        try:
            self.client.delete_collection(collection_name=self.collection_name)
            logger.info(f"🗑️ Collection '{self.collection_name}' deleted successfully.")
        except Exception as e:
            logger.error(f"❌ Failed to delete collection '{self.collection_name}': {e}", exc_info=True)

    def get_collection_info(self) -> dict:
        try:
            info = self.client.get_collection(self.collection_name)
            collection_info = {
                "Collection Name": getattr(info, "name", self.collection_name),
                "Vectors Count": getattr(info, "points_count", 0),
                "Status": getattr(info, "status", "unknown").value if hasattr(info, "status") else "unknown",
                "Vector Size": self.vector_size,
                "Distance Metric": "COSINE",
            }
            logger.info(f"ℹ️ User-facing collection info: {collection_info}")
            return collection_info
        except Exception as e:
            logger.error(f"❌ Failed to fetch collection info: {e}", exc_info=True)
            return {"error": "Collection info not available"}

    def insert_data(self, vectors: list, payloads: list, ids: list = None, batch_size: int = 100):
        if ids is None:
            ids = [
                int(hashlib.md5(payloads[i]["text"].encode("utf-8")).hexdigest(), 16) % (10**18)
                for i in range(len(payloads))
            ]
        for i in range(0, len(vectors), batch_size):
            batch_points = [
                PointStruct(id=ids[j], vector=vectors[i+j], payload=payloads[i+j])
                for j in range(len(vectors[i:i+batch_size]))
            ]
            self.client.upsert(collection_name=self.collection_name, points=batch_points)
            logger.info(f"📥 Inserted batch of {len(batch_points)} vectors into '{self.collection_name}'.")

    def search(self, query_vector: list, limit: int = 5) -> list[ScoredPoint]:
        try:
            results = self.client.search(
                collection_name=self.collection_name,
                query_vector=query_vector,
                limit=limit,
                with_payload=True
            )
            logger.info(f"🔍 Search completed, returned {len(results)} results.")
            return results
        except Exception as e:
            logger.error(f"❌ Search failed: {e}", exc_info=True)
            return []

    def get_text_from_results(self, results: list[ScoredPoint]) -> str:
        texts = [p.payload.get("text", "") for p in results]
        logger.info(f"📝 Extracted text from {len(texts)} results.")
        return "\n\n".join(texts)

# ✅ Singleton instance
qdrant_manager = QdrantManager()
