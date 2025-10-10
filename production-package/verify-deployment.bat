@echo off
REM Automation Scout - Production Package Verification
REM Run this script to verify all components are ready for deployment

echo.
echo ======================================
echo  Automation Scout Production Checker
echo ======================================
echo.

REM Check Node.js installation
echo [1/5] Checking Node.js installation...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org
    pause
    exit /b 1
) else (
    echo ✅ Node.js is installed
)

REM Check npm availability
echo [2/5] Checking npm availability...
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm is not available
    pause
    exit /b 1
) else (
    echo ✅ npm is available
)

REM Check if all required files exist
echo [3/5] Checking required files...
if not exist "package.json" (
    echo ❌ package.json not found
    pause
    exit /b 1
)
if not exist "index.js" (
    echo ❌ index.js not found
    pause
    exit /b 1
)
if not exist ".env" (
    echo ❌ .env file not found
    pause
    exit /b 1
)
echo ✅ All required files present

REM Install dependencies
echo [4/5] Installing dependencies...
npm install --production --silent
if %errorlevel% neq 0 (
    echo ❌ Failed to install dependencies
    pause
    exit /b 1
) else (
    echo ✅ Dependencies installed successfully
)

REM Run verification script
echo [5/5] Running system verification...
npm run verify >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ System verification failed
    echo Please run 'npm run verify' for detailed information
    pause
    exit /b 1
) else (
    echo ✅ System verification passed
)

echo.
echo ======================================
echo  🎉 Ready for Production Deployment!
echo ======================================
echo.
echo Next steps:
echo   1. Run 'npm start' to launch Automation Scout
echo   2. Check system tray for the application icon
echo   3. Review logs in the logs/ directory
echo.
echo For support: support@client.com
echo Documentation: README.md
echo.
pause