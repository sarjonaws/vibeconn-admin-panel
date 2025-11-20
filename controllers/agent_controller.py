from fastapi import APIRouter
from services.agent_service import (
    get_agents,
    create_new_agent,
    activate_agent_by_id,
    delete_agent_by_id
)

router = APIRouter(prefix="/api", tags=["agents"])

@router.get("/agents")
async def get_agents_endpoint():
    return {"agents": get_agents()}

@router.post("/agents")
async def create_agent_endpoint(data: dict):
    agent_id = create_new_agent(
        name=data.get("name", ""),
        topic=data.get("topic", ""),
        system_prompt=data.get("system_prompt", ""),
        document_filters=data.get("document_filters", ""),
        temperature=float(data.get("temperature", 0.7))
    )
    return {"status": "ok", "agent_id": agent_id}

@router.post("/agents/{agent_id}/activate")
async def activate_agent_endpoint(agent_id: int):
    activate_agent_by_id(agent_id)
    return {"status": "ok"}

@router.delete("/agents/{agent_id}")
async def delete_agent_endpoint(agent_id: int):
    delete_agent_by_id(agent_id)
    return {"status": "ok"}
