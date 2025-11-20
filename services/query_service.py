import httpx
import os
import time
from db.database import get_behavior_prompt, get_all_agents, save_chat_message, save_api_request

SEMANTIC_URL = os.getenv("SEMANTIC_URL", "http://localhost:8001")

async def ask_question(query: str, user_id: str, language: str, agent_id: int = None, max_tokens: int = 2000):
    start_time = time.time()
    
    # Get behavior prompt from agent or default
    if agent_id:
        agents = get_all_agents()
        agent = next((a for a in agents if a['id'] == agent_id), None)
        behavior_prompt = agent['system_prompt'] if agent else get_behavior_prompt()
    else:
        behavior_prompt = get_behavior_prompt()
    
    async with httpx.AsyncClient(timeout=60.0) as client:
        response = await client.post(
            f"{SEMANTIC_URL}/ask",
            json={
                "query": query, 
                "user_id": user_id, 
                "language": language,
                "behavior_prompt": behavior_prompt,
                "max_tokens": max_tokens
            }
        )
        result = response.json()
    
    response_time = (time.time() - start_time) * 1000
    
    # Save to chat history
    session_id = user_id or "default"
    save_chat_message(session_id, query, result.get("answer", ""))
    
    # Save API request details
    metadata = result.get("metadata", {})
    full_prompt = f"Behavior: {behavior_prompt}\n\nQuery: {query}"
    save_api_request(
        session_id=session_id,
        full_prompt=full_prompt,
        response=result.get("answer", ""),
        tokens_used=metadata.get("tokens_used", 0),
        response_time_ms=response_time,
        model=metadata.get("model", "unknown")
    )
    
    # Add request info to response
    result["request_info"] = {
        "tokens_used": metadata.get("tokens_used", 0),
        "response_time_ms": round(response_time, 2),
        "model": metadata.get("model", "unknown")
    }
    
    return result
