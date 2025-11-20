from database import set_config, get_all_configs

if __name__ == "__main__":
    if get_all_configs():
        print("⚠ BD ya tiene configuración")
    else:
        print("Inicializando BD...")
        configs = {
            "compress": {"openai_api_key": "", "llm_model": "gpt-4o-mini", "embedding_model": "text-embedding-3-small", "domain_context": "documentación técnica, manuales de usuario, APIs", "qdrant_url": "http://localhost:6333", "qdrant_collection": "vibe_documents"},
            "vector": {"model_name": "sentence-transformers/all-MiniLM-L6-v2", "vector_dimension": 1536, "compression_service_url": "http://localhost:8002", "qdrant_url": "http://localhost:6333", "qdrant_collection": "vibe_documents"},
            "semantic": {"openai_api_key": "", "openai_model": "gpt-4o-mini", "vector_engine_url": "http://localhost:8000", "top_k_results": 3, "max_context_tokens": 2048, "similarity_threshold": 0.7, "llm_temperature": 0.7, "default_language": "es"}
        }
        for service, config in configs.items():
            for key, value in config.items():
                set_config(service, key, value)
        print("✓ BD inicializada. Configura tu OpenAI API Key en el admin panel")
