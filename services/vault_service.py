from utils.vault_client import vault_client

def is_vault_authenticated():
    return vault_client.is_authenticated()

def get_service_secrets(service: str):
    return vault_client.get_secrets(service)

def set_service_secrets(service: str, secrets: dict):
    return vault_client.set_secrets(service, secrets)

def set_service_secret(service: str, key: str, value: str):
    return vault_client.set_secret(service, key, value)

def delete_service_secret(service: str, key: str):
    return vault_client.delete_secret(service, key)

def delete_all_service_secrets(service: str):
    return vault_client.delete_all_secrets(service)
