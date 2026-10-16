@echo off
echo ============================================================
echo   ITC // CRYPTOGRAPHY: "BRUTE-FORCE" VAULT CRACKER
echo ============================================================
echo.
echo Installing dependencies...
pip install -r requirements.txt >nul 2>&1
echo.
echo Starting offline server on port 5001...
echo   URL:  http://localhost:5001
echo.
echo Press Ctrl+C to stop the server.
echo ============================================================
python app.py
pause
