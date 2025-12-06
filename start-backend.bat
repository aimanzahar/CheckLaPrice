@echo off
echo ========================================
echo   CheckLaPrice - Python Backend Server
echo ========================================
echo.

:: Check if port 8000 is in use and kill the process
echo Checking if port 8000 is in use...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :8000 ^| findstr LISTENING') do (
    echo Found process using port 8000, killing PID: %%a
    taskkill /PID %%a /F >nul 2>&1
)
timeout /t 1 /nobreak >nul

cd /d %~dp0Backend
echo Starting FastAPI server on http://127.0.0.1:8000
echo Press Ctrl+C to stop the server
echo.
python -m uvicorn main:app --reload --host 127.0.0.1 --port 8000
