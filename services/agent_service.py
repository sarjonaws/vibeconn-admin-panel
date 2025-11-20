from database import (
    get_all_agents, 
    create_agent, 
    activate_agent, 
    delete_agent, 
    get_active_agent
)

def get_agents():
    return get_all_agents()

def create_new_agent(name: str, topic: str, system_prompt: str, document_filters: str, temperature: float):
    return create_agent(name, topic, system_prompt, document_filters, temperature)

def activate_agent_by_id(agent_id: int):
    activate_agent(agent_id)

def delete_agent_by_id(agent_id: int):
    delete_agent(agent_id)

def get_current_active_agent():
    return get_active_agent()
