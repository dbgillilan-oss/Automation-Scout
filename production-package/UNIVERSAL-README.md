# 🚀 Automation Scout v1.0.0 - Universal Installation

## Quick Start (Works on ALL systems)

### **One Command Installation:**

**Windows:**
```cmd
node universal-install.js
```

**macOS (including Sequoia):**
```bash
node universal-install.js
```

**Linux:**
```bash
node universal-install.js
```

## Prerequisites

**Node.js Required** (if you see "command not found"):

- **Windows:** Download from https://nodejs.org/ → Run .msi installer as Administrator
- **macOS:** Download from https://nodejs.org/ → Run .pkg installer
- **Linux:** `sudo apt install nodejs npm` (Ubuntu/Debian) or `sudo yum install nodejs npm` (CentOS/RHEL)

## Installation Process

1. **Extract** the ZIP file to any folder
2. **Open Terminal/Command Prompt** 
3. **Navigate** to the extracted folder: `cd /path/to/extracted/folder`
4. **Run:** `node universal-install.js`

The installer will:
- ✅ Check system compatibility
- ✅ Create installation directory
- ✅ Copy all files
- ✅ Install dependencies
- ✅ Configure system integration
- ✅ Verify installation

## Installation Locations

- **Windows:** `C:\AutomationScout\`
- **macOS:** `/Applications/AutomationScout/`
- **Linux:** `/opt/automation-scout/`

*(Falls back to user directory if permissions needed)*

## Starting the Application

After installation:

**Method 1:** Navigate to install directory and run `npm start`

**Method 2 (Windows):** Double-click `start.bat`

**Method 3 (Mac/Linux):** Run `./start.sh`

## Troubleshooting

**"Node.js not found"**
- Install Node.js from https://nodejs.org/
- Restart terminal and try again

**"Permission denied"**
- Run terminal as Administrator (Windows) or with `sudo` (Mac/Linux)

**"Installation failed"**
- Check available disk space (need 1GB)
- Temporarily disable antivirus
- Try manual method below

## Manual Installation (Fallback)

If the universal installer has issues:

```bash
npm install --production
npm start
```

## Features

- ✅ **Universal compatibility** - Works on Windows, macOS, Linux
- ✅ **Bulletproof installation** - Multiple fallback methods
- ✅ **Enterprise security** - GDPR/CCPA compliance built-in
- ✅ **Cross-platform** - Optimized for each operating system
- ✅ **Professional support** - Comprehensive documentation

## System Requirements

- **OS:** Windows 10+, macOS 10.14+, or modern Linux
- **Node.js:** Version 16.0.0 or later
- **Memory:** 4GB RAM minimum
- **Storage:** 1GB available space

---

**Need help?** The universal installer provides detailed error messages and troubleshooting steps.

*Automation Scout - Professional Cross-Platform Automation*