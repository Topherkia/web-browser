@echo off
REM start_frontend.bat - Start frontend development server
echo Starting Frontend Development Server...
echo.

cd frontend
npm start

if %errorlevel% neq 0 (
    echo Frontend server failed to start!
    pause
    exit /b 1
)