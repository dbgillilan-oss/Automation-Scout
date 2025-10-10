@echo off
echo ===============================================
echo Automation Scout v1.0.0 - Production Installer
echo ===============================================
echo.

REM Check for Administrator privileges
net session >nul 2>&1
if %errorLevel% neq 0 (
    echo WARNING: Administrator privileges recommended for full installation
    echo Some features may not work without elevated permissions.
    echo.
    pause
)

REM Check Node.js installation
echo [1/6] Checking Node.js installation...
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is required but not installed
    echo.
    echo Please install Node.js 18 or higher from:
    echo https://nodejs.org/en/download/
    echo.
    echo After installation, restart this installer.
    pause
    exit /b 1
) else (
    for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
    echo ✓ Node.js found: %NODE_VERSION%
)

REM Create installation directory
echo.
echo [2/6] Setting up installation directory...
set INSTALL_DIR=%PROGRAMFILES%\Automation Scout
if not exist "%INSTALL_DIR%" (
    mkdir "%INSTALL_DIR%"
    echo ✓ Created: %INSTALL_DIR%
) else (
    echo ✓ Directory exists: %INSTALL_DIR%
)

REM Copy application files
echo.
echo [3/6] Installing application files...
xcopy /E /I /Y . "%INSTALL_DIR%" >nul
if errorlevel 1 (
    echo ERROR: Failed to copy application files
    pause
    exit /b 1
) else (
    echo ✓ Application files installed
)

REM Install dependencies
echo.
echo [4/6] Installing dependencies...
cd /d "%INSTALL_DIR%"
call npm install --production --silent
if errorlevel 1 (
    echo ERROR: Failed to install Node.js dependencies
    echo Please check your internet connection and try again.
    pause
    exit /b 1
) else (
    echo ✓ Dependencies installed successfully
)

REM Set up configuration
echo.
echo [5/6] Configuring application...
if not exist "%INSTALL_DIR%\.env" (
    copy "%INSTALL_DIR%\.env.example" "%INSTALL_DIR%\.env" >nul
    echo ✓ Configuration file created: .env
    echo ⚠ IMPORTANT: Edit .env file with your company settings
) else (
    echo ✓ Configuration file already exists
)

REM Create shortcuts and registry entries
echo.
echo [6/6] Creating shortcuts and system integration...

REM Create Start Menu shortcut
set START_MENU=%APPDATA%\Microsoft\Windows\Start Menu\Programs
if not exist "%START_MENU%\Automation Scout" mkdir "%START_MENU%\Automation Scout"

REM Create desktop shortcut (optional)
echo Set oWS = WScript.CreateObject("WScript.Shell") > "%TEMP%\shortcut.vbs"
echo sLinkFile = "%USERPROFILE%\Desktop\Automation Scout.lnk" >> "%TEMP%\shortcut.vbs"
echo Set oLink = oWS.CreateShortcut(sLinkFile) >> "%TEMP%\shortcut.vbs"
echo oLink.TargetPath = "%INSTALL_DIR%\index.js" >> "%TEMP%\shortcut.vbs"
echo oLink.Arguments = "" >> "%TEMP%\shortcut.vbs"
echo oLink.WorkingDirectory = "%INSTALL_DIR%" >> "%TEMP%\shortcut.vbs"
echo oLink.IconLocation = "%INSTALL_DIR%\icon.ico" >> "%TEMP%\shortcut.vbs"
echo oLink.Description = "Automation Scout - Privacy-first workflow automation" >> "%TEMP%\shortcut.vbs"
echo oLink.Save >> "%TEMP%\shortcut.vbs"
cscript /nologo "%TEMP%\shortcut.vbs"
del "%TEMP%\shortcut.vbs"

REM Add to Windows Registry (for uninstaller)
reg add "HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall\AutomationScout" /v "DisplayName" /t REG_SZ /d "Automation Scout v1.0.0" /f >nul
reg add "HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall\AutomationScout" /v "UninstallString" /t REG_SZ /d "%INSTALL_DIR%\uninstall.bat" /f >nul
reg add "HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall\AutomationScout" /v "InstallLocation" /t REG_SZ /d "%INSTALL_DIR%" /f >nul
reg add "HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall\AutomationScout" /v "Publisher" /t REG_SZ /d "Automation Scout Team" /f >nul
reg add "HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall\AutomationScout" /v "DisplayVersion" /t REG_SZ /d "1.0.0" /f >nul

REM Create uninstaller
echo @echo off > "%INSTALL_DIR%\uninstall.bat"
echo echo Uninstalling Automation Scout... >> "%INSTALL_DIR%\uninstall.bat"
echo taskkill /f /im node.exe /fi "WINDOWTITLE eq Automation Scout*" 2^>nul >> "%INSTALL_DIR%\uninstall.bat"
echo rd /s /q "%INSTALL_DIR%" >> "%INSTALL_DIR%\uninstall.bat"
echo del /q "%USERPROFILE%\Desktop\Automation Scout.lnk" 2^>nul >> "%INSTALL_DIR%\uninstall.bat"
echo rd /s /q "%START_MENU%\Automation Scout" 2^>nul >> "%INSTALL_DIR%\uninstall.bat"
echo reg delete "HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall\AutomationScout" /f 2^>nul >> "%INSTALL_DIR%\uninstall.bat"
echo echo Automation Scout has been uninstalled. >> "%INSTALL_DIR%\uninstall.bat"
echo pause >> "%INSTALL_DIR%\uninstall.bat"

echo ✓ Shortcuts and registry entries created

REM Final verification
echo.
echo [Verification] Running installation verification...
cd /d "%INSTALL_DIR%"
call node scripts\verify.js
set VERIFY_RESULT=%ERRORLEVEL%

echo.
echo ===============================================
if %VERIFY_RESULT% equ 0 (
    echo ✅ INSTALLATION SUCCESSFUL!
    echo ===============================================
    echo.
    echo Automation Scout has been installed to:
    echo %INSTALL_DIR%
    echo.
    echo IMPORTANT NEXT STEPS:
    echo 1. Edit the configuration file with your company settings:
    echo    %INSTALL_DIR%\.env
    echo.
    echo 2. Required configuration changes:
    echo    - AS_CLIENT_COMPANY_NAME: Your company name
    echo    - AS_CLIENT_SUPPORT_EMAIL: Your support email
    echo    - AS_ENCRYPTION_KEY: Secure encryption key
    echo    - AS_AUTOMATION_ALLOWED_DOMAINS: Your allowed domains
    echo.
    echo 3. Start Automation Scout:
    echo    - Double-click the desktop shortcut, OR
    echo    - Navigate to %INSTALL_DIR% and run: node index.js
    echo.
    echo 📚 Documentation:
    echo    - README.md: Quick start guide
    echo    - PRODUCTION-DEPLOYMENT.md: Detailed setup
    echo    - PRIVACY-POLICY.md: Privacy and compliance
    echo.
    echo 📞 Support:
    echo    - Email: support@automation-scout.com
    echo    - Documentation: https://docs.automation-scout.com
    echo.
    choice /C YN /M "Start Automation Scout now?"
    if errorlevel 2 goto :end
    if errorlevel 1 (
        echo.
        echo Starting Automation Scout...
        start "Automation Scout" cmd /k "cd /d "%INSTALL_DIR%" && node index.js"
    )
) else (
    echo ❌ INSTALLATION VERIFICATION FAILED
    echo ===============================================
    echo.
    echo Please check the error messages above and:
    echo 1. Ensure all configuration is correct
    echo 2. Run the installer as Administrator if needed
    echo 3. Contact support if problems persist
    echo.
    echo Troubleshooting:
    echo - Check %INSTALL_DIR%\logs\ for error details
    echo - Verify Node.js installation: node --version
    echo - Run verification manually: node scripts\verify.js
)

:end
echo.
echo Installation complete. Press any key to exit.
pause >nul