from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from services.query_service import ask_question

router = APIRouter(prefix="/api", tags=["query"])

class QueryRequest(BaseModel):
    query: str
    user_id: str = "admin"
    language: str = "es"
    agent_id: Optional[int] = None
    max_tokens: Optional[int] = 2000

@router.post("/ask")
async def ask_question_endpoint(query: QueryRequest):
    try:
        result = await ask_question(
            query.query, 
            query.user_id, 
            query.language, 
            query.agent_id, 
            query.max_tokens
        )
        return result
    except Exception as e:
        raise HTTPException(500, str(e))
