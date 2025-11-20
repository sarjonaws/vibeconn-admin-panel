import httpx
import os
from file_processor import process_file

VECTOR_URL = os.getenv("VECTOR_URL", "http://localhost:8000")

async def upload_document(doc_id: str, text: str, metadata: dict):
    async with httpx.AsyncClient(timeout=60.0) as client:
        response = await client.post(
            f"{VECTOR_URL}/documents",
            json={"id": doc_id, "text": text, "metadata": metadata}
        )
        return response

async def upload_file_document(filename: str, file_bytes: bytes, content_type: str):
    text = process_file(filename, file_bytes)
    doc_id = f"file-{filename}-{int(__import__('time').time() * 1000)}"
    
    async with httpx.AsyncClient(timeout=120.0) as client:
        response = await client.post(
            f"{VECTOR_URL}/documents",
            json={
                "id": doc_id,
                "text": text,
                "metadata": {
                    "source": "file_upload",
                    "filename": filename,
                    "content_type": content_type
                }
            }
        )
        return response

async def list_all_documents():
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(f"{VECTOR_URL}/export/vectors")
            if response.status_code == 200:
                data = response.json()
                return data.get("data", [])
            return []
    except:
        return []

async def delete_document_by_id(doc_id: str):
    async with httpx.AsyncClient(timeout=10.0) as client:
        response = await client.delete(f"{VECTOR_URL}/documents/{doc_id}")
        return response

async def get_documents_stats():
    try:
        async with httpx.AsyncClient(timeout=5.0) as client:
            response = await client.get(f"{VECTOR_URL}/stats")
            return response.json()
    except:
        return {"total_documents": 0, "total_vectors": 0}
