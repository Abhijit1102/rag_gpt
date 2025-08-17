# AI Chatbot API

### AI-powered Mental Health Chatbot API built with FastAPI. This project supports LLM-based chat, sidebar operations, and vector database operations with Qdrant.

## Environment Variables

- Create a `.env` file in your project root with the following keys:
```bash
# OpenAI API settings
OPENAI_API_KEY=<your_openai_api_key>
OPENAI_MODEL=gpt-4o-mini

# Qdrant settings
QDRANT_API_KEY=<your_qdrant_api_key>
QDRANT_URL=<your_qdrant_url>
QDRANT_COLLECTION_NAME=<your_collection_name>

# HuggingFace settings
HUGGINGFACE_API_KEY=<your_huggingface_api_key>
HUGGINGFACE_EMBEDDING_MODEL=<your_embedding_model>

# Development settings
DEV_RELOAD=false

```

-  `✅ DEV_RELOAD=true` enables hot reload for development.


## Install Dependencies

```bash
 pip install -r requirements.txt
```

## Run the API

```bash
python -m src.main  

```

## API Endpoints

| Endpoint          | Method    | Description                                |
|------------------|-----------|--------------------------------------------|
| `/api/v1`         | GET       | Root endpoint                              |
| `/api/v1/llm`     | POST/GET  | Chatbot operations                         |
| `/api/v1/sidebar` | POST/GET  | Sidebar operations                          |
| `/api/v1/vectordb`| POST/GET  | Vector database operations                 |
