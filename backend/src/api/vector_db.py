import tempfile
import shutil
import os

import hashlib
from fastapi import APIRouter, UploadFile, HTTPException

from src.logger import logger
from src.database.Qudrant_client import qdrant_manager
from src.utils import process_pdf, get_embeddings

router = APIRouter(prefix="/vector_db", tags=["VectorDB"])


@router.post("/upload_pdf", summary="Upload PDF and store embeddings")
async def upload_pdf(file: UploadFile):
    if file.content_type != "application/pdf":
        logger.warning(f"Rejected non-PDF upload: {file.filename}")
        raise HTTPException(status_code=400, detail="Only PDF files are allowed")

    # Save the uploaded PDF to a temp file
    with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
        shutil.copyfileobj(file.file, tmp)
        tmp_path = tmp.name

    try:
        logger.info(f"Processing PDF: {file.filename}")

        # Pass the real file path to process_pdf
        chunks = process_pdf(tmp_path)
        if not chunks:
            raise HTTPException(status_code=400, detail="PDF contains no extractable text")

        # Generate embeddings
        vectors_data = get_embeddings([chunk["text"] for chunk in chunks])

        # Prepare payloads and IDs
        payloads, vectors, ids = [], [], []
        for idx, chunk in enumerate(chunks):
            payloads.append({"text": chunk["text"], "filename": file.filename})
            vectors.append(vectors_data[idx])
            ids.append(int(hashlib.sha256(chunk["text"].encode()).hexdigest(), 16) % (10**18))

        # Insert into Qdrant
        qdrant_manager.create_collection()
        qdrant_manager.insert_data(vectors=vectors, payloads=payloads, ids=ids)

        logger.info(f"Uploaded {len(vectors)} chunks from {file.filename} to Qdrant")
        return {"filename": file.filename, "chunks_uploaded": len(vectors)}

    except Exception as e:
        logger.error(f"Failed to upload PDF {file.filename}: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Failed to upload PDF: {str(e)}")

    finally:
        # Clean up the temp file
        os.remove(tmp_path)


@router.get("/info", summary="Get detailed info about the vector DB collection")
async def get_vector_db_info():
    try:
        info = qdrant_manager.get_collection_info()
        if not info:
            raise HTTPException(status_code=404, detail="Collection info not available")
        return info
    except Exception as e:
        logger.error(f"Failed to retrieve collection info: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Failed to retrieve collection info: {str(e)}")
    

@router.delete("/delete", summary="Delete the vector DB collection")
async def delete_vector_db_collection():
    """
    Deletes the current Qdrant vector collection.
    """
    try:
        qdrant_manager.delete_collection()
        return {"message": f"Collection '{qdrant_manager.collection_name}' deleted successfully"}
    except Exception as e:
        logger.error(f"Failed to delete collection: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Failed to delete collection: {str(e)}")

