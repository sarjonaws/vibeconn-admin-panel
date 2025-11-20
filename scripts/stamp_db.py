"""
Marca la BD existente como migrada sin aplicar cambios
"""
import os
from dotenv import load_dotenv
load_dotenv()

from alembic.config import Config
from alembic import command

def stamp_database():
    """Marca la BD como migrada a la última versión"""
    alembic_cfg = Config("../config/alembic.ini")
    command.stamp(alembic_cfg, "head")
    print("✓ Base de datos marcada como migrada")
    print("  Las tablas existentes se mantienen intactas")

if __name__ == "__main__":
    stamp_database()
