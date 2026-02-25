@echo off
setlocal
:: Ensure we are in the script's directory (Fix System32 error)
cd /d %~dp0
echo --- Grand.Bio GitHub Upload Helper ---
set REPO_URL=https://github.com/chunyueh2019-afk/grand-bio.git

:: Check for Git
git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Git is not installed or not in PATH.
    echo Please install Git from https://git-scm.com/
    pause
    exit /b
)

echo [1/4] Initializing Git...
if not exist .git (
    git init
)

echo [2/4] Staging and Committing...
:: Set temporary identity if not configured
git config user.email "samwu@example.com"
git config user.name "Sam Wu"
git add .
git commit -m "Initial commit from Antigravity"

echo [3/4] Setting Remote URL...
git remote remove origin >nul 2>&1
git remote add origin %REPO_URL%

echo [4/4] Pushing to GitHub (main)...
git branch -M main
git push -u origin main --force

if %errorlevel% equ 0 (
    echo.
    echo SUCCESSFULLY UPLOADED! Please refresh your GitHub page.
) else (
    echo.
    echo [FAILED] Push failed. 
    echo If search for "Permission denied (publickey)", try using HTTPS URL instead.
)

pause
