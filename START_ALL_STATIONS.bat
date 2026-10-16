@echo off
title ITC Cybersecurity Exhibition - 4 Stations Master Launcher
cls
echo ============================================================
echo   ITC // CYBERSECURITY EXHIBITION - ALL 4 STATIONS LAUNCHER
echo ============================================================
echo.
echo Installing dependencies if needed...
pip install -r requirements.txt >nul 2>&1

echo.
echo [1/4] Launching Station 1: Breach Trail Topology (Port 5000)...
start "ITC Station 1 - Topology Threat Simulator" cmd /k "cd /d "%~dp0station-1-breach-trail" && python app.py"

echo [2/4] Launching Station 2: Brute-Force Cracker (Port 5001)...
start "ITC Station 2 - Brute-Force Cracker" cmd /k "cd /d "%~dp0station-2-brute-force" && python app.py"

echo [3/4] Launching Station 3: Social Engineering Radar (Port 5002)...
start "ITC Station 3 - Social Engineering Radar" cmd /k "cd /d "%~dp0station-3-social-engineering" && python app.py"

echo [4/4] Launching Station 4: Ghost-In-The-Lens Biometrics (Port 5003)...
start "ITC Station 4 - Adversarial Biometrics" cmd /k "cd /d "%~dp0station-4-adversarial-biometrics" && python app.py"

echo.
echo Waiting for servers to initialize...
timeout /t 3 /nobreak >nul

echo.
echo Opening Station 4 in browser...
start http://localhost:5003

echo.
echo ============================================================
echo   ALL 4 STATIONS ARE LIVE AND RUNNING!
echo   - Station 1 (Topology)     : http://localhost:5000
echo   - Station 2 (Brute-Force)  : http://localhost:5001
echo   - Station 3 (Social Eng)   : http://localhost:5002
echo   - Station 4 (Ghost Biometrics): http://localhost:5003
echo ============================================================
echo You can keep this window open or close it.
pause
