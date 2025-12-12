@echo off
echo Starting Web Browser Rating System...
echo.

echo [1/3] Starting backend server...
start cmd /k "cd backend && npm start"

timeout /t 3 /nobreak > nul

echo [2/3] Starting frontend server...
start cmd /k "cd frontend && npm start"

timeout /t 10 /nobreak > nul

echo [3/3] Starting electron app...
start cmd /k "cd electron && npm start"

echo.
echo ✅ All services started!
echo - Backend: http://localhost:5000
echo - Frontend: http://localhost:3000
echo - Electron: Desktop application
echo.
pause