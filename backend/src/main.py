from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from src.api.chatbot import router as chat_router
from src.api.sidebar import router as sidebar_router
from src.api.vector_db import router as vector_router 

app = FastAPI(title="AI Chatbot API", version="1.0")

# ------------------------
# CORS settings
# ------------------------
origins = [  
    "http://frontend:3000",
    "http://localhost:3000"

]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ------------------------
# Include routers with /api/v1 prefix
# ------------------------
app.include_router(chat_router, prefix="/api/v1/llm", tags=["llm"])
app.include_router(sidebar_router, prefix="/api/v1/sidebar", tags=["Sidebar"])
app.include_router(vector_router, prefix="/api/v1/vectordb", tags=["VectorDB"]) 

# ------------------------
# Root endpoint
# ------------------------
@app.get("/api/v1")
async def root():
    logger.info("Root endpoint accessed")
    return {"message": "Welcome to AI-powered Mental Health Chatbot API (v1)"}

# ------------------------
# Optional: for direct Python run
# ------------------------
if __name__ == "__main__":
    import uvicorn
    from src.logger import logger
    from src.config import config  # ✅ import singleton instance

    logger.info("Starting FastAPI server at 0.0.0.0:8000")

    # Access DEV_RELOAD from singleton instance
    reload_flag = config.DEV_RELOAD.lower() == "true"

    uvicorn.run(
        "src.main:app",
        host="0.0.0.0",
        port=8000,
        reload=reload_flag
    )
