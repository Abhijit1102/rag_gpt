import time
from qdrant_client import QdrantClient
from qdrant_client.http.exceptions import UnexpectedResponse
from src.config import config

MAX_RETRIES = 3
RETRY_INTERVAL = 5  # seconds

class QdrantConnection:
    def __init__(self, url: str, api_key: str):
        self.url = url
        self.api_key = api_key
        self.retry_count = 0
        self.is_connected = False
        self.client = None

    def connect(self):
        """Establish Qdrant connection with retries."""
        while self.retry_count < MAX_RETRIES:
            try:
                self.client = QdrantClient(
                    url=self.url,
                    api_key=self.api_key,
                    timeout=10
                )
                # Health check
                self.client.get_collections()
                self.is_connected = True
                print("✅ Qdrant connected successfully.")
                return
            except UnexpectedResponse as e:
                self.retry_count += 1
                print(f"❌ Qdrant connection error: {e}")
                time.sleep(RETRY_INTERVAL)
            except Exception as e:
                self.retry_count += 1
                print(f"⚠️ Unexpected error: {e}")
                time.sleep(RETRY_INTERVAL)

        raise ConnectionError("🚨 Failed to connect after retries.")

    def disconnect(self):
        self.client = None
        self.is_connected = False
        print("🔌 Qdrant connection closed.")

    def get_connection_status(self):
        return {"is_connected": self.is_connected, "url": self.url}

# Singleton connection
qdrant_connection = QdrantConnection(config.QDRANT_URL, config.QDRANT_API_KEY)
qdrant_connection.connect()

# Exported singleton
get_qdrant_status = qdrant_connection.get_connection_status
qdrant_client = qdrant_connection.client
