from database import get_chat_history, get_chat_sessions, get_api_requests

def get_all_chat_sessions():
    return get_chat_sessions()

def get_session_chat_history(session_id: str):
    return get_chat_history(session_id)

def get_all_api_requests():
    return get_api_requests()
