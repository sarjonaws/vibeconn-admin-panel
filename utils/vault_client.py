import hvac
import os
import requests
from typing import Dict, Any, Optional

class VaultClient:
    def __init__(self):
        self.vault_url = os.getenv("VAULT_ADDR", "")
        self.vault_token = os.getenv("VAULT_TOKEN", "")
        self.client = hvac.Client(url=self.vault_url, token=self.vault_token)
        self.mount_point = os.getenv("VAULT_MOUNT_POINT", "")
        
    def is_authenticated(self) -> bool:
        try:
            return self.client.is_authenticated()
        except:
            return False
    
    def get_secrets(self, service: str) -> Dict[str, Any]:
        """Get all secrets for a service"""
        # Use direct API call
        try:
            url = f"{self.vault_url}/v1/{self.mount_point}/data/{service}"
            headers = {"X-Vault-Token": self.vault_token}
            resp = requests.get(url, headers=headers)
            if resp.status_code == 200:
                data = resp.json().get('data', {})
                return data.get('data', data)  # Handle both v1 and v2
        except:
            pass
        return {}
    
    def set_secret(self, service: str, key: str, value: str) -> bool:
        """Set a single secret for a service"""
        try:
            current = self.get_secrets(service)
            current[key] = value
            
            # Use direct API call for KV v2
            url = f"{self.vault_url}/v1/{self.mount_point}/data/{service}"
            headers = {"X-Vault-Token": self.vault_token}
            payload = {"data": current}
            resp = requests.post(url, json=payload, headers=headers)
            if resp.status_code in [200, 204]:
                return True
            print(f"Error setting secret: {resp.text}")
            return False
        except Exception as e:
            print(f"Error setting secret: {e}")
            return False
    
    def set_secrets(self, service: str, secrets: Dict[str, Any]) -> bool:
        """Set multiple secrets for a service"""
        try:
            url = f"{self.vault_url}/v1/{self.mount_point}/data/{service}"
            headers = {"X-Vault-Token": self.vault_token}
            payload = {"data": secrets}
            resp = requests.post(url, json=payload, headers=headers)
            return resp.status_code in [200, 204]
        except Exception as e:
            print(f"Error setting secrets: {e}")
            return False
    
    def delete_secret(self, service: str, key: str) -> bool:
        """Delete a single secret key"""
        try:
            current = self.get_secrets(service)
            if key in current:
                del current[key]
                url = f"{self.vault_url}/v1/{self.mount_point}/data/{service}"
                headers = {"X-Vault-Token": self.vault_token}
                payload = {"data": current}
                resp = requests.post(url, json=payload, headers=headers)
                return resp.status_code in [200, 204]
            return True
        except:
            return False
    
    def delete_all_secrets(self, service: str) -> bool:
        """Delete all secrets for a service"""
        try:
            url = f"{self.vault_url}/v1/{self.mount_point}/metadata/{service}"
            headers = {"X-Vault-Token": self.vault_token}
            resp = requests.delete(url, headers=headers)
            return resp.status_code in [200, 204]
        except:
            return False

vault_client = VaultClient()
