@echo off
echo Starting BookShare Development Environment...
echo.

REM Start MongoDB (if not running)
echo Checking MongoDB...
net start MongoDB 2>nul
if %errorlevel% equ 0 (
    echo MongoDB started successfully
) else (
    echo MongoDB is already running or failed to start
)
echo.

REM Start Backend
echo Starting Backend Server...
start "BookShare Backend" cmd /k "cd backend && npm run dev"
timeout /t 3 /nobreak >nul

REM Start Frontend
echo Starting Frontend Server...
start "BookShare Frontend" cmd /k "npm start"

echo.
echo Both servers are starting...
echo Backend: http://localhost:5001
echo Frontend: http://localhost:3000
echo.
pause