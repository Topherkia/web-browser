@echo off
REM setup_database.bat - Easy database setup for Windows
echo ====================================================
echo Web Browser Rating System - Database Setup
echo ====================================================
echo.

REM Check if .env file exists
if not exist "backend\.env" (
    echo ❌ ERROR: .env file not found!
    echo.
    echo Creating .env file from template...
    copy "backend\.env.example" "backend\.env"
    echo ✓ Created backend/.env from template
    echo.
    echo Please edit backend/.env with your database credentials
    echo.
    pause
)

echo Step 1: Checking database connection...
echo.

REM Try different ports (3306 for XAMPP/WAMP, 3307 for standalone)
echo Trying to connect to MySQL/MariaDB...

REM Test connection with common configurations
echo Testing port 3306 (XAMPP/WAMP default)...
timeout /t 2 /nobreak > nul

echo Testing port 3307 (MariaDB default)...
timeout /t 2 /nobreak > nul

echo.
echo Step 2: Please choose your database setup method:
echo.
echo [1] I have HeidiSQL installed (Recommended)
echo [2] I have MySQL Workbench installed
echo [3] I have XAMPP/WAMP control panel
echo [4] I have command-line MySQL/MariaDB access
echo [5] Manual setup instructions
echo.
set /p choice="Enter choice (1-5): "

if "%choice%"=="1" (
    call :heidi_setup
) else if "%choice%"=="2" (
    call :workbench_setup
) else if "%choice%"=="3" (
    call :xampp_setup
) else if "%choice%"=="4" (
    call :cli_setup
) else if "%choice%"=="5" (
    call :manual_setup
) else (
    echo Invalid choice!
    pause
    exit /b 1
)

echo.
echo Step 3: Testing database connection...
echo Running database initialization script...
cd backend
node database/init.js
cd ..

echo.
echo ====================================================
if %errorlevel% equ 0 (
    echo ✅ Database setup completed successfully!
) else (
    echo ❌ Database setup failed. Please try manual setup.
)
echo ====================================================
echo.
pause
exit /b 0

:heidi_setup
    echo.
    echo HeidiSQL Setup Instructions:
    echo 1. Open HeidiSQL
    echo 2. Create new connection:
    echo    - Host: localhost
    echo    - Port: 3306 (or 3307)
    echo    - User: root
    echo    - Password: (check backend/.env)
    echo 3. Connect
    echo 4. Right-click in left panel -> Create new -> Database
    echo 5. Name: webbrowser_ratings
    echo 6. Select database
    echo 7. File -> Run SQL file...
    echo 8. Select: backend\database\schema.sql
    echo 9. Click "Execute"
    echo.
    pause
    goto :eof

:workbench_setup
    echo.
    echo MySQL Workbench Setup:
    echo 1. Open MySQL Workbench
    echo 2. Connect to your server
    echo 3. Click "Create a new schema"
    echo 4. Name: webbrowser_ratings
    echo 5. Apply
    echo 6. File -> Open SQL Script
    echo 7. Select: backend\database\schema.sql
    echo 8. Click the lightning bolt to execute
    echo.
    pause
    goto :eof

:xampp_setup
    echo.
    echo XAMPP/WAMP Setup:
    echo 1. Start Apache and MySQL in XAMPP/WAMP
    echo 2. Open browser to http://localhost/phpmyadmin
    echo 3. Login (usually username: root, password: empty)
    echo 4. Click "New" in left sidebar
    echo 5. Database name: webbrowser_ratings
    echo 6. Collation: utf8mb4_unicode_ci
    echo 7. Click Create
    echo 8. Select the database
    echo 9. Click "Import" tab
    echo 10. Choose file: backend\database\schema.sql
    echo 11. Click Go
    echo.
    pause
    goto :eof

:cli_setup
    echo.
    echo Command Line Setup:
    echo Open command prompt as administrator and run:
    echo mysql -u root -p < backend\database\schema.sql
    echo.
    echo If you get an error, try:
    echo mysql -u root < backend\database\schema.sql
    echo.
    pause
    goto :eof

:manual_setup
    echo.
    echo Manual Setup Instructions:
    echo 1. Install MariaDB/MySQL if not installed
    echo 2. Start the database service
    echo 3. Create database: CREATE DATABASE webbrowser_ratings;
    echo 4. Use database: USE webbrowser_ratings;
    echo 5. Run the SQL commands from backend/database/schema.sql
    echo 6. Update backend/.env with correct credentials
    echo.
    pause
    goto :eof