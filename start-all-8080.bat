@echo off
echo ========================================
echo   CheckLaPrice - Starting All Services
echo   (Using port 8080)
echo ========================================
echo.

:: Kill any existing processes on ports 8080, 8081, 8082
echo Cleaning up existing processes...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :8080 ^| findstr LISTENING 2^>nul') do (
    echo Killing process on port 8080 ^(PID: %%a^)
    taskkill /PID %%a /F >nul 2>&1
)
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :8081 ^| findstr LISTENING 2^>nul') do (
    echo Killing process on port 8081 ^(PID: %%a^)
    taskkill /PID %%a /F >nul 2>&1
)
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :8082 ^| findstr LISTENING 2^>nul') do (
    echo Killing process on port 8082 ^(PID: %%a^)
    taskkill /PID %%a /F >nul 2>&1
)

:: Wait a moment
timeout /t 1 /nobreak >nul

:: Start Python Backend Server in a new terminal
echo [1/3] Starting Python Backend Server on port 8080...
start "Python Backend" cmd /k "cd /d %~dp0Backend && python -m uvicorn main:app --reload --host 127.0.0.1 --port 8080"

:: Wait a moment for backend to initialize
timeout /t 2 /nobreak >nul

:: Start Convex Dev Server in a new terminal
echo [2/3] Starting Convex Dev Server...
start "Convex Dev" cmd /k "cd /d %~dp0 && npx convex dev"

:: Wait a moment for convex to initialize
timeout /t 2 /nobreak >nul

:: Start Expo in a new terminal
echo [3/3] Starting Expo Development Server...
start "Expo Dev Server" cmd /k "cd /d %~dp0 && npx expo start --port 8081"

echo.
echo ========================================
echo   All services started!
echo ========================================
echo.
echo   [Backend]  http://127.0.0.1:8080
echo   [Convex]   Running in dev mode
echo   [Expo]     http://localhost:8081
echo.
echo NOTE: Update your API URL to use port 8080!
echo.
echo Press any key to close this window...
pause >nul
