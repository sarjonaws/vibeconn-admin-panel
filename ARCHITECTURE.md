# Arquitectura Admin Panel

## Estructura Modular

```
admin-panel/
├── app.py                      # Punto de entrada (registra routers)
├── controllers/                # Controladores (endpoints)
│   ├── config_controller.py    # /api/config, /api/health
│   ├── document_controller.py  # /api/documents, /api/stats
│   ├── query_controller.py     # /api/ask
│   ├── chat_controller.py      # /api/chat/*, /api/requests
│   ├── behavior_controller.py  # /api/behavior-prompt*
│   ├── agent_controller.py     # /api/agents*
│   └── vault_controller.py     # /api/vault/*
├── services/                   # Lógica de negocio
│   ├── config_service.py       # Gestión de configuración
│   ├── document_service.py     # Gestión de documentos
│   ├── query_service.py        # Procesamiento de consultas
│   ├── chat_service.py         # Historial de chat
│   ├── behavior_service.py     # Prompts de comportamiento
│   ├── agent_service.py        # Gestión de agentes
│   └── vault_service.py        # Integración con Vault
├── database.py                 # Acceso a datos
├── vault_client.py             # Cliente Vault
└── file_processor.py           # Procesamiento de archivos
```

## Flujo de Datos

```
Cliente → Controller → Service → Database/API Externa
```

## Controladores

Responsables de:
- Validación de entrada (Pydantic)
- Manejo de errores HTTP
- Respuestas JSON

## Servicios

Responsables de:
- Lógica de negocio
- Llamadas a APIs externas
- Transformación de datos
- Interacción con base de datos

## Ventajas

- ✅ Separación de responsabilidades
- ✅ Código reutilizable
- ✅ Fácil testing
- ✅ Mantenimiento simplificado
