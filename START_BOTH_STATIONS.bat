@echo off
title ITC Cybersecurity Exhibition - Dual Station Launcher
cls
echo ============================================================
echo   ITC // CYBERSECURITY EXHIBITION DUAL STATION LAUNCHER
echo ============================================================
echo.
echo Installing dependencies if needed...
pip install -r requirements.txt >nul 2>&1

echo.
echo [1/3] Launching Station 1: Breach Trail Topology (Port 5000)...
start "ITC Station 1 - Topology Threat Simulator" cmd /k "cd /d "%~dp0station-1-breach-trail" && python app.py"

echo [2/3] Launching Station 2: Brute-Force Cracker (Port 5001)...
start "ITC Station 2 - Brute-Force Cracker" cmd /k "cd /d "%~dp0station-2-brute-force" && python app.py"

echo.
echo [3/3] Waiting for servers to initialize...
timeout /t 3 /nobreak >nul

echo.
echo Opening browser tabs...
start http://localhost:5000
start http://localhost:5001

echo.
echo ============================================================
echo   BOTH STATIONS ARE LIVE AND RUNNING!
echo   - Station 1: http://localhost:5000
echo   - Station 2: http://localhost:5001
echo ============================================================
echo You can keep this window open or close it.
pause
