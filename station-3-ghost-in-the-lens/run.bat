@echo off
title ITC // STATION 03 // GHOST-IN-THE-LENS // ADVERSARIAL BIOMETRICS
color 0B
cls
echo.
echo  ============================================================
echo   ITC ^|^| STATION 03 ^|^| GHOST-IN-THE-LENS (ADVERSARIAL ML)
echo  ============================================================
echo.
echo  Target Model : PyTorch Biometric Classifier
echo  Attack       : Fast Gradient Sign Method (FGSM)
echo  Port         : http://localhost:5003
echo.
echo  Opening in browser...
start http://localhost:5003
echo.
cd /d "%~dp0"
python app.py
pause
