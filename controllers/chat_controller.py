from fastapi import APIRouter
from services.chat_service import get_all_chat_sessions, get_session_chat_history, get_all_api_requests

router = APIRouter(prefix="/api", tags=["chat"])

@router.get("/requests")
async def get_requests():
    return {"requests": get_all_api_requests()}

@router.get("/chat/sessions")
async def get_sessions():
    return {"sessions": get_all_chat_sessions()}

@router.get("/chat/history/{session_id}")
async def get_session_history(session_id: str):
    return {"messages": get_session_chat_history(session_id)}
