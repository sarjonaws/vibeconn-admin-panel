from sqlalchemy import create_engine, Column, Integer, String, Text, Float, Boolean, DateTime, func
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from datetime import datetime
import os
import json

DB_URL = os.getenv("DATABASE_URL", "")

engine = create_engine(DB_URL, pool_pre_ping=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class Config(Base):
    __tablename__ = "config"
    service = Column(String, primary_key=True)
    key = Column(String, primary_key=True)
    value = Column(Text)

class BehaviorPrompt(Base):
    __tablename__ = "behavior_prompts"
    id = Column(Integer, primary_key=True, autoincrement=True)
    prompt = Column(Text, nullable=False)
    active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class ExpertAgent(Base):
    __tablename__ = "expert_agents"
    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String, nullable=False)
    topic = Column(String, nullable=False)
    system_prompt = Column(Text, nullable=False)
    document_filters = Column(Text)
    temperature = Column(Float, default=0.7)
    active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class ChatHistory(Base):
    __tablename__ = "chat_history"
    id = Column(Integer, primary_key=True, autoincrement=True)
    session_id = Column(String, nullable=False)
    user_message = Column(Text, nullable=False)
    assistant_message = Column(Text, nullable=False)
    agent_name = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)

class ApiRequest(Base):
    __tablename__ = "api_requests"
    id = Column(Integer, primary_key=True, autoincrement=True)
    session_id = Column(String)
    full_prompt = Column(Text, nullable=False)
    response = Column(Text, nullable=False)
    tokens_used = Column(Integer)
    response_time_ms = Column(Float)
    model = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)

def init_db():
    Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def get_config(service: str) -> dict:
    db = SessionLocal()
    configs = db.query(Config).filter(Config.service == service).all()
    db.close()
    return {c.key: json.loads(c.value) for c in configs}

def set_config(service: str, key: str, value):
    db = SessionLocal()
    db.query(Config).filter(Config.service == service, Config.key == key).delete()
    db.add(Config(service=service, key=key, value=json.dumps(value)))
    db.commit()
    db.close()

def get_all_configs() -> dict:
    db = SessionLocal()
    configs = db.query(Config).all()
    db.close()
    result = {}
    for c in configs:
        if c.service not in result:
            result[c.service] = {}
        result[c.service][c.key] = json.loads(c.value)
    return result

def get_behavior_prompt() -> str:
    db = SessionLocal()
    prompt = db.query(BehaviorPrompt).filter(BehaviorPrompt.active == True).order_by(BehaviorPrompt.id.desc()).first()
    db.close()
    return prompt.prompt if prompt else ""

def set_behavior_prompt(prompt: str):
    db = SessionLocal()
    db.query(BehaviorPrompt).update({BehaviorPrompt.active: False})
    db.add(BehaviorPrompt(prompt=prompt, active=True))
    db.commit()
    db.close()

def get_all_behavior_prompts() -> list:
    db = SessionLocal()
    prompts = db.query(BehaviorPrompt).order_by(BehaviorPrompt.created_at.desc()).all()
    db.close()
    return [{"id": p.id, "prompt": p.prompt, "active": p.active, "created_at": p.created_at.isoformat()} for p in prompts]

def activate_behavior_prompt(prompt_id: int):
    db = SessionLocal()
    db.query(BehaviorPrompt).update({BehaviorPrompt.active: False})
    db.query(BehaviorPrompt).filter(BehaviorPrompt.id == prompt_id).update({BehaviorPrompt.active: True})
    db.commit()
    db.close()

def delete_behavior_prompt(prompt_id: int):
    db = SessionLocal()
    db.query(BehaviorPrompt).filter(BehaviorPrompt.id == prompt_id).delete()
    db.commit()
    db.close()

def get_all_agents() -> list:
    db = SessionLocal()
    agents = db.query(ExpertAgent).order_by(ExpertAgent.created_at.desc()).all()
    db.close()
    return [{"id": a.id, "name": a.name, "topic": a.topic, "system_prompt": a.system_prompt, "document_filters": a.document_filters, "temperature": a.temperature, "active": a.active, "created_at": a.created_at.isoformat()} for a in agents]

def create_agent(name: str, topic: str, system_prompt: str, document_filters: str = "", temperature: float = 0.7):
    db = SessionLocal()
    agent = ExpertAgent(name=name, topic=topic, system_prompt=system_prompt, document_filters=document_filters, temperature=temperature, active=True)
    db.add(agent)
    db.commit()
    agent_id = agent.id
    db.close()
    return agent_id

def activate_agent(agent_id: int):
    db = SessionLocal()
    db.query(ExpertAgent).update({ExpertAgent.active: False})
    db.query(ExpertAgent).filter(ExpertAgent.id == agent_id).update({ExpertAgent.active: True})
    db.commit()
    db.close()

def delete_agent(agent_id: int):
    db = SessionLocal()
    db.query(ExpertAgent).filter(ExpertAgent.id == agent_id).delete()
    db.commit()
    db.close()

def get_active_agent():
    db = SessionLocal()
    agent = db.query(ExpertAgent).filter(ExpertAgent.active == True).order_by(ExpertAgent.id.desc()).first()
    db.close()
    return {"id": agent.id, "name": agent.name, "topic": agent.topic, "system_prompt": agent.system_prompt, "document_filters": agent.document_filters, "temperature": agent.temperature} if agent else None

def save_chat_message(session_id: str, user_message: str, assistant_message: str, agent_name: str = None):
    db = SessionLocal()
    msg = ChatHistory(session_id=session_id, user_message=user_message, assistant_message=assistant_message, agent_name=agent_name)
    db.add(msg)
    db.commit()
    db.close()

def get_chat_history(session_id: str = None, limit: int = 50):
    db = SessionLocal()
    query = db.query(ChatHistory)
    if session_id:
        query = query.filter(ChatHistory.session_id == session_id)
    messages = query.order_by(ChatHistory.created_at.desc()).limit(limit).all()
    db.close()
    return [{"id": m.id, "session_id": m.session_id, "user_message": m.user_message, "assistant_message": m.assistant_message, "agent_name": m.agent_name, "created_at": m.created_at.isoformat()} for m in messages]

def get_chat_sessions():
    db = SessionLocal()
    sessions = db.query(
        ChatHistory.session_id,
        func.min(ChatHistory.created_at).label("first_message"),
        func.max(ChatHistory.created_at).label("last_message"),
        func.count(ChatHistory.id).label("message_count")
    ).group_by(ChatHistory.session_id).order_by(func.max(ChatHistory.created_at).desc()).all()
    db.close()
    return [{"session_id": s[0], "first_message": s[1].isoformat(), "last_message": s[2].isoformat(), "message_count": s[3]} for s in sessions]

def save_api_request(session_id: str, full_prompt: str, response: str, tokens_used: int, response_time_ms: float, model: str):
    db = SessionLocal()
    req = ApiRequest(session_id=session_id, full_prompt=full_prompt, response=response, tokens_used=tokens_used, response_time_ms=response_time_ms, model=model)
    db.add(req)
    db.commit()
    db.close()

def get_api_requests(limit: int = 50):
    db = SessionLocal()
    requests = db.query(ApiRequest).order_by(ApiRequest.created_at.desc()).limit(limit).all()
    db.close()
    return [{"id": r.id, "session_id": r.session_id, "full_prompt": r.full_prompt, "response": r.response, "tokens_used": r.tokens_used, "response_time_ms": r.response_time_ms, "model": r.model, "created_at": r.created_at.isoformat()} for r in requests]

init_db()
