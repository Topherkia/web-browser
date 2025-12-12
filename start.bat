@echo off
REM start.bat - Main launcher for the web browser application
echo Starting Web Browser with Rating System...
echo.

echo [1/3] Starting Backend Server...
start cmd /k "cd backend && npm start"

timeout /t 5 /nobreak > nul

echo [2/3] Starting Frontend Development Server...
start cmd /k "cd frontend && npm start"

timeout /t 10 /nobreak > nul

echo [3/3] Starting Electron Desktop Application...
start cmd /k "cd electron && npm start"

echo.
echo All services started! The browser will open shortly.
pause