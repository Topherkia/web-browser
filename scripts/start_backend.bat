@echo off
REM start_backend.bat - Start backend server
echo Starting Backend Server...
echo.

cd backend
npm start

if %errorlevel% neq 0 (
    echo Backend server failed to start!
    pause
    exit /b 1
)