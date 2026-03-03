@echo off
echo Setting up BookShare Admin User...
echo.

REM Start MongoDB in background
echo Starting MongoDB...
start /min mongod --dbpath "C:\data\db" 2>nul
timeout /t 5 /nobreak >nul

REM Create admin user
echo Creating admin user...
cd backend
node seeds/createAdmin.js

echo.
echo Admin setup complete!
echo You can now login with:
echo Email: admin@test.com
echo Password: admin123
echo.
pause