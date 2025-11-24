from fastapi import APIRouter
from services.chat_service import get_all_chat_sessions, get_session_chat_history, get_all_api_requests, delete_session, get_session_document, set_session_document
from pydantic import BaseModel
from typing import Optional

router = APIRouter(prefix="/api", tags=["chat"])

@router.get("/requests")
async def get_requests():
    return {"requests": get_all_api_requests()}

@router.get("/chat/sessions")
async def get_sessions():
    return {"sessions": get_all_chat_sessions()}

@router.get("/chat/history/{session_id}")
async def get_session_history(session_id: str):
    return {
        "messages": get_session_chat_history(session_id),
        "current_document_id": get_session_document(session_id)
    }

class SessionDocument(BaseModel):
    document_id: Optional[str]

@router.put("/chat/sessions/{session_id}/document")
async def update_session_document_endpoint(session_id: str, body: SessionDocument):
    set_session_document(session_id, body.document_id)
    return {"status": "success", "current_document_id": body.document_id}

class SessionBehavior(BaseModel):
    behavior: Optional[str]

@router.put("/chat/sessions/{session_id}/behavior")
async def update_session_behavior_endpoint(session_id: str, body: SessionBehavior):
    from db.database import get_db, SessionState
    from sqlalchemy import update
    
    db = next(get_db())
    try:
        # Update or create session state with custom behavior
        stmt = update(SessionState).where(SessionState.session_id == session_id).values(
            custom_behavior=body.behavior
        )
        result = db.execute(stmt)
        
        if result.rowcount == 0:
            # Create new session state if doesn't exist
            from db.database import SessionState
            session_state = SessionState(session_id=session_id, custom_behavior=body.behavior)
            db.add(session_state)
        
        db.commit()
        return {"status": "success", "behavior": body.behavior}
    finally:
        db.close()

@router.delete("/chat/sessions/{session_id}")
async def delete_chat_session_endpoint(session_id: str):
    delete_session(session_id)
    return {"status": "success", "message": f"Session {session_id} deleted"}
