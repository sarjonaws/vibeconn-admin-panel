"""
Script para importar datos desde db_export.json a la base de datos
"""
import json
import os
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()

from db.database import SessionLocal, Config, BehaviorPrompt, ExpertAgent, ChatHistory, ApiRequest
from dotenv import load_dotenv

load_dotenv()
def import_data(json_file: str = "db_export.json"):
    """Importa datos desde un archivo JSON a la BD"""
    if not os.path.exists(json_file):
        print(f"✗ Archivo {json_file} no encontrado")
        return False
    
    try:
        db = SessionLocal()
    except Exception as e:
        print(f"✗ Error al conectar a la BD: {e}")
        return False
    
    try:
        with open(json_file, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        # Importar configuraciones
        for c in data.get("config", []):
            existing = db.query(Config).filter(
                Config.service == c["service"],
                Config.key == c["key"]
            ).first()
            if not existing:
                db.add(Config(**c))
        
        # Importar behavior prompts
        for p in data.get("behavior_prompts", []):
            if p.get("created_at"):
                p["created_at"] = datetime.fromisoformat(p["created_at"])
            db.add(BehaviorPrompt(**{k: v for k, v in p.items() if k != 'id'}))
        
        # Importar expert agents
        for a in data.get("expert_agents", []):
            if a.get("created_at"):
                a["created_at"] = datetime.fromisoformat(a["created_at"])
            db.add(ExpertAgent(**{k: v for k, v in a.items() if k != 'id'}))
        
        # Importar chat history
        for ch in data.get("chat_history", []):
            if ch.get("created_at"):
                ch["created_at"] = datetime.fromisoformat(ch["created_at"])
            db.add(ChatHistory(**{k: v for k, v in ch.items() if k != 'id'}))
        
        # Importar API requests
        for r in data.get("api_requests", []):
            if r.get("created_at"):
                r["created_at"] = datetime.fromisoformat(r["created_at"])
            db.add(ApiRequest(**{k: v for k, v in r.items() if k != 'id'}))
        
        db.commit()
        
        print(f"✓ Datos importados exitosamente desde {json_file}")
        print(f"  - Configuraciones: {len(data.get('config', []))}")
        print(f"  - Behavior Prompts: {len(data.get('behavior_prompts', []))}")
        print(f"  - Expert Agents: {len(data.get('expert_agents', []))}")
        print(f"  - Chat History: {len(data.get('chat_history', []))}")
        print(f"  - API Requests: {len(data.get('api_requests', []))}")
        
        return True
        
    except Exception as e:
        db.rollback()
        print(f"✗ Error al importar datos: {e}")
        return False
    finally:
        db.close()

if __name__ == "__main__":
    import_data()
