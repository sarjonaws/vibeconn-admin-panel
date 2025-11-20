from fastapi import APIRouter, HTTPException
from services.vault_service import (
    is_vault_authenticated,
    get_service_secrets,
    set_service_secrets,
    set_service_secret,
    delete_service_secret,
    delete_all_service_secrets
)

router = APIRouter(prefix="/api/vault", tags=["vault"])

VALID_SERVICES = ["compress", "vector", "semantic"]

@router.get("/status")
async def vault_status():
    return {"authenticated": is_vault_authenticated()}

@router.get("/secrets/{service}")
async def get_vault_secrets(service: str):
    if service not in VALID_SERVICES:
        raise HTTPException(400, "Invalid service")
    secrets = get_service_secrets(service)
    return {"service": service, "secrets": secrets}

@router.post("/secrets/{service}")
async def set_vault_secrets_endpoint(service: str, data: dict):
    if service not in VALID_SERVICES:
        raise HTTPException(400, "Invalid service")
    success = set_service_secrets(service, data.get("secrets", {}))
    if not success:
        raise HTTPException(500, "Failed to save secrets")
    return {"status": "ok"}

@router.put("/secrets/{service}/{key}")
async def update_vault_secret(service: str, key: str, data: dict):
    if service not in VALID_SERVICES:
        raise HTTPException(400, "Invalid service")
    success = set_service_secret(service, key, data.get("value", ""))
    if not success:
        raise HTTPException(500, "Failed to update secret")
    return {"status": "ok"}

@router.delete("/secrets/{service}/{key}")
async def delete_vault_secret_endpoint(service: str, key: str):
    if service not in VALID_SERVICES:
        raise HTTPException(400, "Invalid service")
    success = delete_service_secret(service, key)
    if not success:
        raise HTTPException(500, "Failed to delete secret")
    return {"status": "ok"}

@router.delete("/secrets/{service}")
async def delete_all_vault_secrets_endpoint(service: str):
    if service not in VALID_SERVICES:
        raise HTTPException(400, "Invalid service")
    success = delete_all_service_secrets(service)
    if not success:
        raise HTTPException(500, "Failed to delete secrets")
    return {"status": "ok"}
