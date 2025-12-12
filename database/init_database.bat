@echo off
REM init_database.bat - Initialize MariaDB database on port 3307
echo Initializing Database for Web Browser Rating System...
echo.

echo Make sure MariaDB is installed and HeidiSQL is available on port 3307
echo Creating database and tables...

REM SQL commands:
echo Please run the schema.sql file in HeidiSQL on port 3307
echo Database initialization script located at: backend\database\schema.sql

pause