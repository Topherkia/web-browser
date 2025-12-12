@echo off
REM install_dependencies.bat - Install all project dependencies
echo Installing Web Browser Rating System Dependencies...
echo.
echo This may take several minutes depending on your internet connection...
echo.

echo [1/4] Installing Backend Dependencies...
cd backend
call npm install --no-optional --legacy-peer-deps
if %errorlevel% neq 0 (
    echo Backend dependencies installation failed!
    echo Please check your internet connection and try again.
    echo You can also try: cd backend && npm install --no-optional --legacy-peer-deps
    pause
    exit /b 1
)
cd ..
echo ✓ Backend dependencies installed

echo [2/4] Installing Frontend Dependencies...
cd frontend
call npm install --no-optional --legacy-peer-deps
if %errorlevel% neq 0 (
    echo Frontend dependencies installation failed!
    echo Please check your internet connection and try again.
    echo You can also try: cd frontend && npm install --no-optional --legacy-peer-deps
    pause
    exit /b 1
)
cd ..
echo ✓ Frontend dependencies installed

echo [3/4] Installing Electron Dependencies...
cd electron
call npm install --no-optional --legacy-peer-deps
if %errorlevel% neq 0 (
    echo Electron dependencies installation failed!
    echo Please check your internet connection and try again.
    echo You can also try: cd electron && npm install --no-optional --legacy-peer-deps
    pause
    exit /b 1
)
cd ..
echo ✓ Electron dependencies installed

echo [4/4] Installing Global Dependencies...
echo Installing concurrently for running multiple servers...
npm install -g concurrently cross-env
echo ✓ Global dependencies installed

echo.
echo ================================================
echo All dependencies installed successfully! ✓
echo ================================================
echo.
echo Next steps:
echo 1. Configure database:
echo    - Copy backend/.env.example to backend/.env
echo    - Update database credentials
echo.
echo 2. Initialize database:
echo    - Run "database\init_database.bat" OR
echo    - Import backend/database/schema.sql into HeidiSQL on port 3307
echo.
echo 3. Run the application:
echo    - Run "start.bat" to launch everything OR
echo    - Run components separately:
echo      - "scripts\start_backend.bat"
echo      - "scripts\start_frontend.bat" 
echo      - "scripts\start_electron.bat"
echo.
echo 4. If you encounter issues:
echo    - Make sure MariaDB/MySQL is running on port 3307
echo    - Check firewall settings
echo    - Verify Node.js version (>= 14.0.0)
echo.
pause