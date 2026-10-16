@echo off
title ITC Stations - Clean Shutdown
cls
echo ============================================================
echo   STOPPING ITC EXHIBIT STATIONS (PORT 5000 & 5001)
echo ============================================================
echo.

echo Terminating processes on Port 5000 and 5001...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":5000 "') do taskkill /F /PID %%a >nul 2>&1
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":5001 "') do taskkill /F /PID %%a >nul 2>&1

echo Done! Both stations have been stopped.
echo ============================================================
pause
