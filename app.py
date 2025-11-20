from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse, FileResponse
import os

from controllers.config_controller import router as config_router
from controllers.document_controller import router as document_router
from controllers.query_controller import router as query_router
from controllers.chat_controller import router as chat_router
from controllers.behavior_controller import router as behavior_router
from controllers.agent_controller import router as agent_router
from controllers.vault_controller import router as vault_router

app = FastAPI(title="VibeConnections Admin")

# Register routers
app.include_router(config_router)
app.include_router(document_router)
app.include_router(query_router)
app.include_router(chat_router)
app.include_router(behavior_router)
app.include_router(agent_router)
app.include_router(vault_router)

@app.get("/", response_class=HTMLResponse)
async def root():
    return FileResponse("static/index.html")

app.mount("/static", StaticFiles(directory="static"), name="static")
