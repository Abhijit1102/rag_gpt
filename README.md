# 🐳 AI Chatbot – Docker Deployment

---

- **This project contains a FastAPI backend (AI chatbot API) and a Next.js frontend (UI). Both are containerized with Docker and orchestrated using docker-compose.**

---

### 📦 Services

- Backend (FastAPI) → Runs on `http://localhost:8000`

- Frontend (Next.js) → Runs on `http://localhost:3000`

- The frontend communicates with the backend via `NEXT_PUBLIC_API_URL`.

### ⚙️ Prerequisites

- Docker installed

- Docker Compose installed

### 🔑 Environment variables configured in `backend/.env`

- make sure .env file has this api keys.

```bash
   OPENAI_API_KEY=
   
   OPENAI_MODEL=gpt-4o-mini

   QDRANT_API_KEY=
   QDRANT_URL=
   QDRANT_COLLECTION_NAME=

   HUGGINGFACE_API_KEY=
   HUGGINGFACE_EMBEDDING_MODEL=

   DEV_RELOAD=false python -m src.main

```

### 🚀 Deployment Steps

## 1. Build and Start Services

```bash
   docker-compose up --build -d
```

## 2. Verify Containers

```bash
   docker ps
```


## 3. 🧹 Cleanup

```bash
 docker-compose down -v
```