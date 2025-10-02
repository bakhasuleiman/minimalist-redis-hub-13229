@echo off
echo Starting Minimalist Redis Hub - Full Stack Application
echo ======================================================

echo.
echo Starting Backend Server...
start "Backend Server" cmd /k "cd backend && npm run dev"

timeout /t 3 /nobreak >nul

echo.
echo Starting Frontend Development Server...
start "Frontend Server" cmd /k "npm run dev"

echo.
echo Both servers are starting...
echo Backend: http://localhost:3001
echo Frontend: http://localhost:8080
echo.
echo Press any key to close this window...
pause >nul