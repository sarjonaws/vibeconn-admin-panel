from fastapi import APIRouter, HTTPException
from services.behavior_service import (
    get_current_behavior_prompt,
    get_all_prompts,
    create_behavior_prompt,
    activate_prompt,
    delete_prompt
)

router = APIRouter(prefix="/api", tags=["behavior"])

@router.get("/behavior-prompt")
async def get_prompt():
    return {"prompt": get_current_behavior_prompt()}

@router.get("/behavior-prompts")
async def get_all_prompts_endpoint():
    return {"prompts": get_all_prompts()}

@router.post("/behavior-prompt")
async def create_prompt(data: dict):
    prompt = data.get("prompt", "")
    if not prompt:
        raise HTTPException(400, "Prompt is required")
    result = create_behavior_prompt(prompt)
    return {"status": "ok", "prompt": result}

@router.post("/behavior-prompt/{prompt_id}/activate")
async def activate_prompt_endpoint(prompt_id: int):
    activate_prompt(prompt_id)
    return {"status": "ok"}

@router.delete("/behavior-prompt/{prompt_id}")
async def delete_prompt_endpoint(prompt_id: int):
    delete_prompt(prompt_id)
    return {"status": "ok"}
