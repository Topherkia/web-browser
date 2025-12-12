@echo off
REM install_dependencies.bat - Install all project dependencies
echo Installing Web Browser Rating System Dependencies...
echo.

echo [1/4] Installing Backend Dependencies...
cd backend
call npm install
if %errorlevel% neq 0 (
    echo Backend dependencies installation failed!
    pause
    exit /b 1
)
cd ..

echo [2/4] Installing Frontend Dependencies...
cd frontend
call npm install
if %errorlevel% neq 0 (
    echo Frontend dependencies installation failed!
    pause
    exit /b 1
)
cd ..

echo [3/4] Installing Electron Dependencies...
cd electron
call npm install
if %errorlevel% neq 0 (
    echo Electron dependencies installation failed!
    pause
    exit /b 1
)
cd ..

echo [4/4] Installing Global Dependencies (if needed)...
npm install -g concurrently cross-env

echo.
echo All dependencies installed successfully!
echo.
echo Next steps:
echo 1. Configure database in backend\.env file
echo 2. Run database\init_database.bat
echo 3. Run start.bat to launch the application
pause