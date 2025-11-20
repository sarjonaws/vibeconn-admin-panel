@echo off
echo ========================================
echo   Setup Base de Datos - VibeConnections
echo ========================================
echo.

REM Verificar si existe .env
if not exist .env (
    echo [ERROR] Archivo .env no encontrado
    echo Crea .env con DATABASE_URL configurado
    exit /b 1
)

echo [1/3] Aplicando migraciones...
python scripts/migrate.py upgrade 2>nul
if %errorlevel% neq 0 (
    echo.
    echo [AVISO] BD ya tiene tablas. Marcando como migrada...
    python scripts/stamp_db.py
)

echo.
echo [2/3] Exportando datos actuales...
python scripts/export_data.py

echo.
echo [3/3] Base de datos lista

echo.
echo ========================================
echo   Setup completado exitosamente
echo ========================================
echo.
echo Siguiente paso: python app.py
pause
