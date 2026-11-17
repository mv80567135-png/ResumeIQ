@echo off
echo ========================================================
echo        Starting ResumeIQ (Backend + Frontend)
echo ========================================================
echo.

echo Starting Django Backend Server on http://127.0.0.1:8000 ...
start "ResumeIQ - Backend" cmd /k "cd /d %~dp0backend\backend && python manage.py runserver 127.0.0.1:8000"

echo Starting React Frontend on http://localhost:3000 ...
start "ResumeIQ - Frontend" cmd /k "cd /d %~dp0frontend\frontend && npm start"

echo.
echo Both servers are starting in separate windows.
echo Frontend will open at http://localhost:3000
echo.
