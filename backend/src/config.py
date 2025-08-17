# src/config.py
import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    def __init__(self):
        # OpenAI
        self.OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
        self.OPENAI_MODEL = os.getenv("OPENAI_MODEL")

        # Qdrant
        self.QDRANT_API_KEY = os.getenv("QDRANT_API_KEY")
        self.QDRANT_URL = os.getenv("QDRANT_URL")
        self.QDRANT_COLLECTION_NAME = os.getenv("QDRANT_COLLECTION_NAME")

        # Hugging Face
        self.HUGGINGFACE_API_KEY = os.getenv("HUGGINGFACE_API_KEY")
        self.HUGGINGFACE_EMBEDDING_MODEL = os.getenv("HUGGINGFACE_EMBEDDING_MODEL")

        # DEV reload flag
        self.DEV_RELOAD = os.getenv("DEV_RELOAD", "true")  # ✅ Ensure this exists

# Singleton instance
config = Config()
