from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse, FileResponse
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv

load_dotenv()

from controllers.config_controller import router as config_router
from controllers.document_controller import router as document_router
from controllers.query_controller import router as query_router
from controllers.chat_controller import router as chat_router
from controllers.behavior_controller import router as behavior_router
from controllers.agent_controller import router as agent_router
from controllers.vault_controller import router as vault_router
from controllers.tracking_controller import router as tracking_router
from db.database import init_db

app = FastAPI(title="VibeConnections Admin")

@app.on_event("startup")
def on_startup():
    init_db()

# Configuración de CORS
# Configuración de CORS
raw_origins = os.getenv("ALLOWED_ORIGINS", "*")
origins = [origin.strip().strip('"').strip("'") for origin in raw_origins.split(",")]

# Add common local development origins if not present
if "*" not in origins:
    dev_origins = ["http://localhost:3000", "http://127.0.0.1:3000"]
    for dev_origin in dev_origins:
        if dev_origin not in origins:
            origins.append(dev_origin)

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(config_router)
app.include_router(document_router)
app.include_router(query_router)
app.include_router(chat_router)
app.include_router(behavior_router)
app.include_router(agent_router)
app.include_router(vault_router)
app.include_router(tracking_router)

@app.get("/", response_class=HTMLResponse)
async def root():
    return FileResponse("static/index.html")

app.mount("/static", StaticFiles(directory="static"), name="static")
