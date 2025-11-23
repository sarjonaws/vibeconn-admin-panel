from db.database import get_chat_history, get_chat_sessions, get_api_requests, delete_chat_session, get_session_state, update_session_document

def get_all_chat_sessions():
    return get_chat_sessions()

def delete_session(session_id: str):
    delete_chat_session(session_id)

def get_session_chat_history(session_id: str):
    return get_chat_history(session_id)

def get_all_api_requests():
    return get_api_requests()

def get_session_document(session_id: str):
    state = get_session_state(session_id)
    return state.current_document_id if state else None

def set_session_document(session_id: str, document_id: str):
    update_session_document(session_id, document_id)
