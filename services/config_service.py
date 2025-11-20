import httpx
import os
from db.database import get_all_configs, set_config
from dotenv import load_dotenv

load_dotenv()

SERVICES = {
    "compress": os.getenv("COMPRESS_URL", ""),
    "vector": os.getenv("VECTOR_URL", ""),
    "semantic": os.getenv("SEMANTIC_URL", "")
}

async def get_all_service_configs(refresh: bool = False):
    db_configs = get_all_configs()
    
    for service, url in SERVICES.items():
        if refresh or service not in db_configs:
            try:
                async with httpx.AsyncClient(timeout=5.0) as client:
                    response = await client.get(f"{url}/config")
                    if response.status_code == 200:
                        service_config = response.json()
                        for key, value in service_config.items():
                            set_config(service, key, value)
                        db_configs[service] = service_config
            except:
                if service not in db_configs:
                    db_configs[service] = {}
    
    return db_configs

async def update_service_config(service: str, config: dict):
    service_url = SERVICES.get(service)
    if not service_url:
        return None
    
    for key, value in config.items():
        set_config(service, key, value)
    
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.post(f"{service_url}/config", json=config)
            return response.json()
    except Exception as e:
        return {"status": "saved_locally", "error": str(e)}

async def check_services_health():
    status = {}
    for service, url in SERVICES.items():
        try:
            async with httpx.AsyncClient(timeout=3.0) as client:
                response = await client.get(f"{url}/health")
                status[service] = "online" if response.status_code == 200 else "offline"
        except:
            status[service] = "offline"
    return status
