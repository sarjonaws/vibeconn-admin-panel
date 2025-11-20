"""
Marca la BD existente como migrada sin aplicar cambios
"""
import os
from pathlib import Path
from dotenv import load_dotenv
load_dotenv()

from alembic.config import Config
from alembic import command

BASE_DIR = Path(__file__).resolve().parent.parent
CONFIG_PATH = BASE_DIR / "config" / "alembic.ini"

def stamp_database():
    """Marca la BD como migrada a la última versión"""
    alembic_cfg = Config(str(CONFIG_PATH))
    command.stamp(alembic_cfg, "head")
    print("✓ Base de datos marcada como migrada")
    print("  Las tablas existentes se mantienen intactas")

if __name__ == "__main__":
    stamp_database()
