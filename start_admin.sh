#!/bin/bash

echo "========================================"
echo "  VibeConnections Admin Panel"
echo "========================================"
echo ""

cd "$(dirname "$0")"

if [ ! -d "venv" ]; then
    echo "Creando entorno virtual..."
    python3 -m venv venv
fi

echo "Activando entorno virtual..."
source venv/bin/activate

echo "Instalando dependencias..."
pip install -q -r requirements.txt

echo ""
echo "Inicializando BD (si es necesario)..."
python3 init_db.py

echo ""
echo "Sincronizando configuracion a servicios..."
python3 sync_config.py

echo ""
echo "========================================"
echo "  Admin Panel iniciado en:"
echo "  http://localhost:9000"
echo "========================================"
echo ""

uvicorn app:app --host 0.0.0.0 --port 9000 --reload
