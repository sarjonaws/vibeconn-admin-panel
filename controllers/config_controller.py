from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Dict, Any
from services.config_service import get_all_service_configs, update_service_config, check_services_health

router = APIRouter(prefix="/api", tags=["config"])

class ConfigUpdate(BaseModel):
    service: str
    config: Dict[str, Any]

@router.get("/config")
async def get_all_configs_endpoint(refresh: bool = False):
    return await get_all_service_configs(refresh)

@router.post("/config")
async def update_config(update: ConfigUpdate):
    result = await update_service_config(update.service, update.config)
    if result is None:
        raise HTTPException(404, "Service not found")
    return result

@router.get("/health")
async def health_check():
    return await check_services_health()
