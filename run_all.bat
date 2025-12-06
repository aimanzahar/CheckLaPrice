@echo off
setlocal

rem Run everything from the repo root (handles spaces in the path)
cd /d "%~dp0"

echo Launching Python backend...
start "Backend" cmd /k "cd /d \"%~dp0\" && python \"Backend\\main.py\""

echo Running Convex deploy...
start "Convex deploy" cmd /k "cd /d \"%~dp0\" && npx convex deploy && echo. && echo Convex deploy finished. && pause"

echo Starting Expo dev server...
start "Expo" cmd /k "cd /d \"%~dp0\" && npm run start"

echo All commands started in separate windows.
endlocal

