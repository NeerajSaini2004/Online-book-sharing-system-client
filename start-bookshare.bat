@echo off
title BookShare Startup
color 0A
echo.
echo ========================================
echo    BookShare Development Environment
echo ========================================
echo.

REM Check if MongoDB is installed
mongod --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ MongoDB not found! Please install MongoDB first.
    echo Download from: https://www.mongodb.com/try/download/community
    pause
    exit /b 1
)

REM Create MongoDB data directory if it doesn't exist
if not exist "C:\data\db" (
    echo Creating MongoDB data directory...
    mkdir "C:\data\db" 2>nul
)

REM Start MongoDB
echo 🍃 Starting MongoDB...
start /min "MongoDB" mongod --dbpath "C:\data\db"
timeout /t 3 /nobreak >nul

REM Install dependencies if needed
if not exist "node_modules" (
    echo 📦 Installing frontend dependencies...
    npm install
)

if not exist "backend\node_modules" (
    echo 📦 Installing backend dependencies...
    cd backend
    npm install
    cd ..
)

REM Create test users
echo 👤 Setting up test users...
cd backend
node seeds/seedUsers.js
cd ..

REM Start backend server
echo 🚀 Starting Backend Server (Port 5001)...
start "BookShare Backend" cmd /k "cd backend && npm run dev"
timeout /t 3 /nobreak >nul

REM Start frontend server
echo 🌐 Starting Frontend Server (Port 3000)...
start "BookShare Frontend" cmd /k "npm start"

echo.
echo ✅ BookShare is starting up!
echo.
echo 🌐 Frontend: http://localhost:3000
echo 🚀 Backend:  http://localhost:5001
echo 📊 Health:   http://localhost:5001/health
echo.
echo Test Accounts:
echo 👑 Admin:   admin@test.com / admin123
echo 🎓 Student: student@test.com / student123
echo 📚 Library: library@test.com / library123
echo.
echo Press any key to exit...
pause >nul