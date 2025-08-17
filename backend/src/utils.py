import os
import uuid
from langchain_community.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from huggingface_hub import InferenceClient
from src.config import config

client = InferenceClient(api_key=str(config.HUGGINGFACE_API_KEY))

def clean_text(text: str) -> str:
    return (
        text.replace("\n", " ")
            .replace("\t", " ")
            .replace('"', " ")
            .replace("'", " ")
    )

def get_embeddings(sentences: list[str]) -> list[list[float]]:
    result = client.feature_extraction(sentences, model=config.HUGGINGFACE_EMBEDDING_MODEL)
    return [r for r in result]

def process_pdf(pdf_path: str) -> list[dict]:
    if not os.path.exists(pdf_path):
        raise FileNotFoundError(f"PDF file not found: {pdf_path}")

    loader = PyPDFLoader(pdf_path)
    documents = loader.load()

    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=500,
        chunk_overlap=50,
        separators=["\n\n", "\n", " ", ""]
    )
    chunks = text_splitter.split_documents(documents)
    return [{"text": clean_text(chunk.page_content)} for chunk in chunks]


def generate_thread_id() -> str:  
    """Generate a unique thread ID using UUID4."""
    return str(uuid.uuid4())

