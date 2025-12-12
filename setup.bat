@echo off
echo Setting up Web Browser Rating System...
echo.

echo [1/3] Installing backend dependencies...
cd backend
call npm install
cd ..

echo [2/3] Installing frontend dependencies...
cd frontend
call npm install
cd ..

echo [3/3] Installing electron dependencies...
cd electron
call npm install
cd ..

echo.
echo ✅ Setup complete!
echo.
echo To run the application:
echo 1. Start backend: cd backend && npm start
echo 2. Start frontend: cd frontend && npm start
echo 3. Start electron: cd electron && npm start
echo.
pause