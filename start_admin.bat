@echo off
echo ========================================
echo   VibeConnections Admin Panel
echo ========================================
echo.

cd /d "%~dp0"

if not exist "venv\" (
    echo Creando entorno virtual...
    python -m venv venv
)

echo Activando entorno virtual...
call venv\Scripts\activate.bat

echo Instalando dependencias...
pip install -q -r requirements.txt

echo.
echo Inicializando BD (si es necesario)...
python db\init_db.py

echo.
echo ========================================
echo   Admin Panel iniciado en:
echo   http://localhost:9000
echo ========================================
echo.

uvicorn app:app --host 0.0.0.0 --port 9000
