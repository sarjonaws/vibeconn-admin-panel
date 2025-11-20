# Estructura del Proyecto Admin Panel

```
admin-panel/
├── config/                      # Configuración
│   ├── alembic.ini             # Config Alembic
│   ├── .env.example            # Ejemplo variables
│   ├── docker-compose.yml      # Docker compose
│   └── Dockerfile              # Docker image
│
├── controllers/                 # API Controllers
│   ├── agent_controller.py
│   ├── behavior_controller.py
│   ├── chat_controller.py
│   ├── config_controller.py
│   ├── document_controller.py
│   ├── query_controller.py
│   └── vault_controller.py
│
├── db/                         # Base de Datos
│   ├── database.py            # Models y funciones
│   ├── db_export.json         # Backup datos
│   ├── fix_sequences.py       # Utilidad sequences
│   └── init_db.py             # Inicialización
│
├── migrations/                 # Migraciones Alembic
│   ├── versions/
│   │   ├── 001_initial_schema.py
│   │   └── 002_seed_data.py
│   ├── env.py
│   └── script.py.mako
│
├── scripts/                    # Scripts de gestión
│   ├── migrate.py             # Gestión migraciones
│   ├── stamp_db.py            # Marcar BD migrada
│   ├── export_data.py         # Exportar a JSON
│   └── import_data.py         # Importar desde JSON
│
├── services/                   # Lógica de negocio
│   ├── agent_service.py
│   ├── behavior_service.py
│   ├── chat_service.py
│   ├── config_service.py
│   ├── document_service.py
│   ├── query_service.py
│   └── vault_service.py
│
├── static/                     # Frontend
│   ├── css/
│   ├── js/
│   └── index.html
│
├── utils/                      # Utilidades
│   ├── file_processor.py      # Procesador archivos
│   └── vault_client.py        # Cliente Vault
│
├── docs/                       # Documentación
│   ├── ARCHITECTURE.md        # Arquitectura
│   ├── MIGRATIONS.md          # Guía migraciones
│   └── README_STRUCTURE.md    # Esta estructura
│
├── .env                        # Variables de entorno
├── .gitignore
├── app.py                      # FastAPI app (ÚNICO .py en raíz)
├── requirements.txt
├── setup_db.bat               # Setup BD Windows
├── setup_db.sh                # Setup BD Linux/Mac
├── start_admin.bat            # Iniciar Windows
├── clean_start.bat            # Limpieza completa
└── README.md                  # Documentación principal
```

## 📂 Descripción de Carpetas

### `/config`
Archivos de configuración del proyecto (Alembic, Docker, ejemplos)

### `/controllers`
Endpoints de la API REST (FastAPI routers)

### `/db`
Todo relacionado con la base de datos (models, funciones, backups)

### `/migrations`
Sistema de versionado de BD con Alembic

### `/scripts`
Scripts de gestión y mantenimiento (migraciones, export/import)

### `/services`
Lógica de negocio separada de los controllers

### `/static`
Frontend (HTML, CSS, JS)

## 🚀 Comandos Principales

```bash
# Setup inicial
./setup_db.bat  # Windows
./setup_db.sh   # Linux/Mac

# Migraciones
python scripts/migrate.py upgrade
python scripts/migrate.py create "mensaje"

# Backup/Restore
python scripts/export_data.py
python scripts/import_data.py

# Iniciar servidor
python app.py
```
