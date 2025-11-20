# Sistema de Migraciones - Admin Panel

Sistema de control de versiones para la base de datos PostgreSQL usando Alembic.

## 🚀 Setup Inicial

### Windows
```bash
setup_db.bat
```

### Linux/Mac
```bash
chmod +x setup_db.sh
./setup_db.sh
```

## 📋 Comandos

### Aplicar Migraciones
```bash
python migrate.py upgrade
```

### Crear Nueva Migración
```bash
# Automática (detecta cambios en models)
python migrate.py create "descripcion del cambio"

# Manual (editar archivo generado)
python migrate.py create "agregar columna email"
```

### Revertir Migración
```bash
# Revertir última
python migrate.py downgrade

# Revertir a versión específica
python migrate.py downgrade 001
```

### Ver Estado
```bash
# Versión actual
python migrate.py current

# Historial completo
python migrate.py history
```

## 📁 Estructura

```
admin-panel/
├── alembic.ini                    # Configuración Alembic
├── migrate.py                     # Script de gestión
├── migrations/
│   ├── env.py                     # Entorno de migraciones
│   ├── script.py.mako             # Template
│   └── versions/
│       ├── 001_initial_schema.py  # Esquema inicial
│       └── 002_seed_data.py       # Datos iniciales
├── export_data.py                 # Exportar BD a JSON
├── import_data.py                 # Importar JSON a BD
└── setup_db.bat/sh                # Setup automático
```

## 🔄 Flujo de Trabajo

### Primera Vez (BD Nueva)
```bash
# 1. Configurar .env
DATABASE_URL=postgresql://user:pass@localhost:5432/vibeconnections

# 2. Ejecutar setup
setup_db.bat  # Windows
./setup_db.sh # Linux/Mac
```

### Migrar BD Existente
```bash
# 1. Exportar datos actuales
python export_data.py

# 2. Aplicar migraciones
python migrate.py upgrade

# 3. Importar datos (opcional)
python import_data.py
```

### Agregar Nueva Columna
```bash
# 1. Modificar models en database.py
# Ejemplo: agregar email a ExpertAgent
class ExpertAgent(Base):
    # ... campos existentes ...
    email = Column(String, nullable=True)

# 2. Crear migración automática
python migrate.py create "agregar email a expert_agents"

# 3. Aplicar migración
python migrate.py upgrade
```

## 📊 Migraciones Incluidas

### 001_initial_schema.py
Crea todas las tablas:
- `config` - Configuraciones por servicio
- `behavior_prompts` - Prompts de comportamiento
- `expert_agents` - Agentes expertos
- `chat_history` - Historial de conversaciones
- `api_requests` - Tracking de peticiones

### 002_seed_data.py
Datos iniciales:
- 8 agentes expertos predefinidos
- Prompt de comportamiento por defecto

## 🛠️ Troubleshooting

### Error: "relation already exists"
```bash
# La BD ya tiene tablas. Opciones:

# A) Marcar como migrada (sin cambios)
python migrate.py upgrade --sql > migration.sql
# Revisar SQL y aplicar manualmente si es seguro

# B) Limpiar y recrear
dropdb vibeconnections
createdb vibeconnections
python migrate.py upgrade
```

### Error: "could not connect to server"
```bash
# Verificar PostgreSQL corriendo
pg_isready

# Verificar DATABASE_URL en .env
echo $DATABASE_URL  # Linux/Mac
echo %DATABASE_URL% # Windows
```

### Revertir Todo
```bash
# Revertir todas las migraciones
python migrate.py downgrade base

# Recrear desde cero
python migrate.py upgrade
```

## 💾 Backup y Restore

### Backup Completo
```bash
# Exportar datos
python export_data.py

# Backup PostgreSQL
pg_dump vibeconnections > backup.sql
```

### Restore
```bash
# Desde JSON
python import_data.py

# Desde PostgreSQL dump
psql vibeconnections < backup.sql
```

## 🔒 Buenas Prácticas

1. **Siempre exportar antes de migrar**
   ```bash
   python export_data.py
   python migrate.py upgrade
   ```

2. **Probar migraciones en desarrollo**
   ```bash
   # Aplicar
   python migrate.py upgrade
   # Probar
   python app.py
   # Revertir si falla
   python migrate.py downgrade
   ```

3. **Nunca editar migraciones aplicadas**
   - Crear nueva migración para cambios
   - Mantener historial limpio

4. **Versionar migraciones en Git**
   ```bash
   git add migrations/versions/*.py
   git commit -m "Add migration: descripcion"
   ```

## 📝 Ejemplo: Agregar Campo

```python
# 1. Modificar database.py
class ExpertAgent(Base):
    # ... existentes ...
    email = Column(String, nullable=True)

# 2. Crear migración
python migrate.py create "add email to expert_agents"

# 3. Editar archivo generado (migrations/versions/003_*.py)
def upgrade():
    op.add_column('expert_agents', 
        sa.Column('email', sa.String(), nullable=True))

def downgrade():
    op.drop_column('expert_agents', 'email')

# 4. Aplicar
python migrate.py upgrade
```
