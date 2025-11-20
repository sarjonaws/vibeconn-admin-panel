from fastapi import APIRouter, HTTPException, UploadFile, File
from pydantic import BaseModel
from typing import Dict, Any, Optional
from services.document_service import (
    upload_document, 
    upload_file_document, 
    list_all_documents, 
    delete_document_by_id,
    get_documents_stats
)

router = APIRouter(prefix="/api", tags=["documents"])

class DocumentUpload(BaseModel):
    id: str
    text: str
    metadata: Optional[Dict[str, Any]] = {}

@router.post("/documents")
async def upload_document_endpoint(doc: DocumentUpload):
    try:
        response = await upload_document(doc.id, doc.text, doc.metadata)
        if response.status_code >= 400:
            raise HTTPException(response.status_code, response.text)
        return response.json()
    except Exception as e:
        raise HTTPException(500, str(e))

@router.post("/documents/upload-file")
async def upload_file_endpoint(file: UploadFile = File(...)):
    try:
        file_bytes = await file.read()
        response = await upload_file_document(file.filename, file_bytes, file.content_type)
        if response.status_code >= 400:
            raise HTTPException(response.status_code, response.text)
        return response.json()
    except ValueError as e:
        raise HTTPException(400, str(e))
    except Exception as e:
        raise HTTPException(500, str(e))

@router.get("/documents")
async def list_documents():
    return await list_all_documents()

@router.delete("/documents/{doc_id}")
async def delete_document(doc_id: str):
    try:
        response = await delete_document_by_id(doc_id)
        if response.status_code == 200:
            return response.json()
        raise HTTPException(response.status_code, response.text)
    except Exception as e:
        raise HTTPException(500, str(e))

@router.get("/stats")
async def get_stats():
    return await get_documents_stats()
