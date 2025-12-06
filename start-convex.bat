@echo off
echo ========================================
echo   CheckLaPrice - Convex Dev Server
echo ========================================
echo.
cd /d %~dp0
echo Starting Convex development server...
echo Press Ctrl+C to stop the server
echo.
npx convex dev
