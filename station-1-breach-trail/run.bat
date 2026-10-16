@echo off
echo ============================================================
echo   ITC // CYBER TOPOLOGY ^& THREAT SIMULATOR
echo ============================================================
echo.
echo Installing dependencies...
pip install -r requirements.txt >nul 2>&1
echo.
echo Starting offline server...
echo   Unified Dashboard:   http://localhost:5000
echo.
echo Press Ctrl+C to stop the server.
echo ============================================================
python app.py
pause
