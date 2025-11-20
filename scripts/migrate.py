"""
Script de gestión de migraciones
"""
import os
import sys
from dotenv import load_dotenv

load_dotenv()

from alembic.config import Config
from alembic import command

def run_migrations():
    """Ejecuta todas las migraciones pendientes"""
    alembic_cfg = Config("../config/alembic.ini")
    command.upgrade(alembic_cfg, "head")
    print("✓ Migraciones aplicadas exitosamente")

def create_migration(message: str):
    """Crea una nueva migración automática"""
    alembic_cfg = Config("../config/alembic.ini")
    command.revision(alembic_cfg, message=message, autogenerate=True)
    print(f"✓ Migración '{message}' creada")

def downgrade(revision: str = "-1"):
    """Revierte migraciones"""
    alembic_cfg = Config("../config/alembic.ini")
    command.downgrade(alembic_cfg, revision)
    print(f"✓ Revertido a revisión {revision}")

def show_current():
    """Muestra la revisión actual"""
    alembic_cfg = Config("../config/alembic.ini")
    command.current(alembic_cfg)

def show_history():
    """Muestra el historial de migraciones"""
    alembic_cfg = Config("../config/alembic.ini")
    command.history(alembic_cfg)

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Uso:")
        print("  python migrate.py upgrade          - Aplicar migraciones")
        print("  python migrate.py create 'mensaje' - Crear migración")
        print("  python migrate.py downgrade [-1]   - Revertir migración")
        print("  python migrate.py current          - Ver revisión actual")
        print("  python migrate.py history          - Ver historial")
        sys.exit(1)

    action = sys.argv[1]

    if action == "upgrade":
        run_migrations()
    elif action == "create" and len(sys.argv) > 2:
        create_migration(sys.argv[2])
    elif action == "downgrade":
        revision = sys.argv[2] if len(sys.argv) > 2 else "-1"
        downgrade(revision)
    elif action == "current":
        show_current()
    elif action == "history":
        show_history()
    else:
        print("Acción no válida")
        sys.exit(1)
