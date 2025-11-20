from database import (
    get_behavior_prompt, 
    set_behavior_prompt, 
    get_all_behavior_prompts, 
    activate_behavior_prompt, 
    delete_behavior_prompt
)

def get_current_behavior_prompt():
    return get_behavior_prompt()

def get_all_prompts():
    return get_all_behavior_prompts()

def create_behavior_prompt(prompt: str):
    set_behavior_prompt(prompt)
    return prompt

def activate_prompt(prompt_id: int):
    activate_behavior_prompt(prompt_id)

def delete_prompt(prompt_id: int):
    delete_behavior_prompt(prompt_id)
