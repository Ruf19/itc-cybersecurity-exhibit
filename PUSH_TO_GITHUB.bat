@echo off
title Push ITC Exhibition to GitHub
cls
echo ============================================================
echo   ITC // PUSH REPOSITORY TO GITHUB
echo ============================================================
echo.
echo Make sure you have created an empty repository on GitHub first:
echo   https://github.com/new
echo.
set /p REPO_URL="Enter your GitHub Repository URL (e.g. https://github.com/username/itc-cybersecurity-exhibit.git): "

if "%REPO_URL%"=="" (
    echo [ERROR] No URL entered. Aborting.
    pause
    exit /b
)

echo.
echo Setting remote origin to: %REPO_URL%
git remote remove origin >nul 2>&1
git remote add origin %REPO_URL%
git branch -M main

echo.
echo Pushing code to GitHub...
git push -u origin main

echo.
if %ERRORLEVEL% EQU 0 (
    echo ============================================================
    echo   SUCCESS! Your project is now live on GitHub.
    echo ============================================================
) else (
    echo ============================================================
    echo   [NOTICE] If GitHub asked for authentication, log in using
    echo   your GitHub Personal Access Token or browser credentials.
    echo ============================================================
)
pause
