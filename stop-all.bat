@echo off
echo ========================================
echo   CheckLaPrice - Stopping All Services
echo ========================================
echo.

echo Killing processes on all ports...

:: Kill backend ports
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :8000 ^| findstr LISTENING 2^>nul') do (
    echo Killing process on port 8000 ^(PID: %%a^)
    taskkill /PID %%a /F >nul 2>&1
)
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :8080 ^| findstr LISTENING 2^>nul') do (
    echo Killing process on port 8080 ^(PID: %%a^)
    taskkill /PID %%a /F >nul 2>&1
)

:: Kill Expo ports
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :8081 ^| findstr LISTENING 2^>nul') do (
    echo Killing process on port 8081 ^(PID: %%a^)
    taskkill /PID %%a /F >nul 2>&1
)
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :8082 ^| findstr LISTENING 2^>nul') do (
    echo Killing process on port 8082 ^(PID: %%a^)
    taskkill /PID %%a /F >nul 2>&1
)

:: Kill Node processes (Convex, Metro bundler)
echo Killing Node.js processes...
taskkill /IM node.exe /F >nul 2>&1

echo.
echo ========================================
echo   All services stopped!
echo ========================================
echo.
echo Press any key to close...
pause >nul
