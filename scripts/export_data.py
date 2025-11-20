"""
Script para exportar datos existentes de la base de datos PostgreSQL
Los datos se exportan en formato JSON para ser incluidos en las migraciones
"""
import json
import os
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()

from db.database import SessionLocal, Config, BehaviorPrompt, ExpertAgent, ChatHistory, ApiRequest
def export_data():
    """Exporta todos los datos de la BD a un archivo JSON"""
    try:
        db = SessionLocal()
    except Exception as e:
        print(f"✗ Error al conectar a la BD: {e}")
        print("  Asegúrate de configurar DATABASE_URL en .env")
        return None
    
    try:
        # Exportar todas las tablas
        data = {
            "export_date": datetime.utcnow().isoformat(),
            "config": [],
            "behavior_prompts": [],
            "expert_agents": [],
            "chat_history": [],
            "api_requests": []
        }
        
        # Configuraciones
        configs = db.query(Config).all()
        for c in configs:
            data["config"].append({
                "service": c.service,
                "key": c.key,
                "value": c.value
            })
        
        # Behavior Prompts
        prompts = db.query(BehaviorPrompt).all()
        for p in prompts:
            data["behavior_prompts"].append({
                "id": p.id,
                "prompt": p.prompt,
                "active": p.active,
                "created_at": p.created_at.isoformat() if p.created_at else None
            })
        
        # Expert Agents
        agents = db.query(ExpertAgent).all()
        for a in agents:
            data["expert_agents"].append({
                "id": a.id,
                "name": a.name,
                "topic": a.topic,
                "system_prompt": a.system_prompt,
                "document_filters": a.document_filters,
                "temperature": a.temperature,
                "active": a.active,
                "created_at": a.created_at.isoformat() if a.created_at else None
            })
        
        # Chat History (limitado a últimos 100)
        chats = db.query(ChatHistory).order_by(ChatHistory.created_at.desc()).limit(100).all()
        for ch in chats:
            data["chat_history"].append({
                "id": ch.id,
                "session_id": ch.session_id,
                "user_message": ch.user_message,
                "assistant_message": ch.assistant_message,
                "agent_name": ch.agent_name,
                "created_at": ch.created_at.isoformat() if ch.created_at else None
            })
        
        # API Requests (limitado a últimos 100)
        requests = db.query(ApiRequest).order_by(ApiRequest.created_at.desc()).limit(100).all()
        for r in requests:
            data["api_requests"].append({
                "id": r.id,
                "session_id": r.session_id,
                "full_prompt": r.full_prompt,
                "response": r.response,
                "tokens_used": r.tokens_used,
                "response_time_ms": r.response_time_ms,
                "model": r.model,
                "created_at": r.created_at.isoformat() if r.created_at else None
            })
        
        # Guardar en archivo
        output_file = "db_export.json"
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        
        print(f"✓ Datos exportados exitosamente a {output_file}")
        print(f"  - Configuraciones: {len(data['config'])}")
        print(f"  - Behavior Prompts: {len(data['behavior_prompts'])}")
        print(f"  - Expert Agents: {len(data['expert_agents'])}")
        print(f"  - Chat History: {len(data['chat_history'])}")
        print(f"  - API Requests: {len(data['api_requests'])}")
        
        return output_file
        
    except Exception as e:
        print(f"✗ Error al exportar datos: {e}")
        return None
    finally:
        db.close()

if __name__ == "__main__":
    export_data()
