# 🍎 Automation Scout - macOS Installation Guide

## Quick Start for Mac Users

### Method 1: macOS Shell Script (Recommended)
```bash
# Extract the ZIP file, then run:
cd /path/to/AutomationScout-v1.0.0-ClientReady/production-package
bash install.sh
```

### Method 2: Universal Installer
```bash
# Alternative cross-platform method:
cd /path/to/AutomationScout-v1.0.0-ClientReady/production-package
node install.js
```

## System Requirements

- **macOS**: 10.14 (Mojave) or later
- **Node.js**: Version 16.0.0 or later
- **Memory**: 4GB RAM minimum (8GB recommended)
- **Storage**: 1GB available disk space
- **Permissions**: Administrator access for installation

## Pre-Installation Setup

### 1. Install Node.js
If Node.js isn't installed:

**Option A: Official Installer**
1. Visit [nodejs.org](https://nodejs.org/)
2. Download the macOS installer (.pkg file)
3. Run the installer and follow instructions

**Option B: Homebrew**
```bash
# Install Homebrew first if needed:
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Then install Node.js:
brew install node
```

**Verify Installation:**
```bash
node --version    # Should show v16.0.0 or later
npm --version     # Should show npm version
```

### 2. Download Automation Scout
1. Download `AutomationScout-v1.0.0-ClientReady.zip`
2. Extract to a convenient location (e.g., Downloads folder)
3. Open Terminal application

## Installation Process

### Step 1: Navigate to Installation Directory
```bash
cd /path/to/extracted/AutomationScout-v1.0.0-ClientReady/production-package
```

### Step 2: Make Installer Executable
```bash
chmod +x install.sh
```

### Step 3: Run Installation
```bash
bash install.sh
```

The installer will:
- ✅ Verify Node.js installation
- ✅ Create `/Applications/AutomationScout/` directory
- ✅ Copy application files
- ✅ Install Node.js dependencies
- ✅ Set up macOS integration
- ✅ Create launch scripts

### Step 4: Start Application
```bash
cd /Applications/AutomationScout
npm start
```

## macOS-Specific Features

### System Integration
- **Installation Location**: `/Applications/AutomationScout/`
- **Command Line Access**: `automation-scout` (if permissions allow)
- **Platform Detection**: Automatically detects and optimizes for macOS
- **Menu Bar Integration**: Ready for macOS menu bar features

### Security & Permissions

#### Required Permissions
When first running Automation Scout, macOS may request permissions:

1. **Accessibility Permission** (if automation features are used):
   - System Preferences → Security & Privacy → Privacy → Accessibility
   - Click the lock icon and enter your password
   - Check the box next to "Automation Scout" or "Terminal"

2. **Full Disk Access** (if file monitoring is needed):
   - System Preferences → Security & Privacy → Privacy → Full Disk Access
   - Add Automation Scout to the list

#### Gatekeeper
If you see "App can't be opened because it is from an unidentified developer":
```bash
# Allow the application (one-time):
sudo spctl --master-disable  # Temporarily disable Gatekeeper
# Run the installation
sudo spctl --master-enable   # Re-enable Gatekeeper
```

## Configuration

### Environment File
The installer creates `.env` file with macOS-optimized settings:

```bash
cd /Applications/AutomationScout
nano .env  # Edit configuration if needed
```

### Key Settings for macOS:
- `AS_ENVIRONMENT=production`
- `AS_CLIENT_COMPANY_NAME=Your Company Name`
- Platform detection automatically handles macOS-specific paths

## Running Automation Scout

### Start the Application:
```bash
# Method 1: From installation directory
cd /Applications/AutomationScout
npm start

# Method 2: Command line (if symlink was created)
automation-scout

# Method 3: Using Node directly
cd /Applications/AutomationScout
node index.js
```

### Stop the Application:
Press `Ctrl+C` in the terminal window

## Troubleshooting

### Common Issues

**1. "Command not found: node"**
```bash
# Check if Node.js is in PATH:
echo $PATH
which node

# If not found, add to your shell profile:
echo 'export PATH="/usr/local/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

**2. "Permission denied" errors**
```bash
# Fix permissions:
sudo chown -R $(whoami) /Applications/AutomationScout
```

**3. "Cannot find module" errors**
```bash
# Reinstall dependencies:
cd /Applications/AutomationScout
rm -rf node_modules package-lock.json
npm install
```

**4. Port conflicts**
```bash
# Check what's using a port (e.g., 3000):
lsof -ti:3000
# Kill the process if needed:
kill -9 $(lsof -ti:3000)
```

### Performance Optimization

**Monitor Resource Usage:**
```bash
# Check CPU and memory usage:
top -p $(pgrep -f "node.*index.js")

# Activity Monitor: Applications → Utilities → Activity Monitor
```

**Log Files:**
```bash
# Check application logs:
cd /Applications/AutomationScout
tail -f logs/automation-scout.log
```

## Uninstallation

To remove Automation Scout:

```bash
# Stop the application first (Ctrl+C)

# Remove installation directory:
sudo rm -rf /Applications/AutomationScout

# Remove command line symlink (if exists):
sudo rm -f /usr/local/bin/automation-scout

# Optional: Remove Node.js (if no longer needed):
# Using Homebrew: brew uninstall node
# Using installer: Use official Node.js uninstaller
```

## Advanced Configuration

### Shell Integration
Add to your shell profile (`~/.zshrc` or `~/.bash_profile`):

```bash
# Automation Scout shortcuts
alias as-start="cd /Applications/AutomationScout && npm start"
alias as-logs="tail -f /Applications/AutomationScout/logs/automation-scout.log"
alias as-config="nano /Applications/AutomationScout/.env"
```

### LaunchAgent (Auto-start)
To start Automation Scout automatically at login:

```bash
# Create LaunchAgent plist:
cat > ~/Library/LaunchAgents/com.automationscout.app.plist << EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.automationscout.app</string>
    <key>ProgramArguments</key>
    <array>
        <string>/usr/local/bin/node</string>
        <string>/Applications/AutomationScout/index.js</string>
    </array>
    <key>WorkingDirectory</key>
    <string>/Applications/AutomationScout</string>
    <key>RunAtLoad</key>
    <true/>
    <key>KeepAlive</key>
    <true/>
</dict>
</plist>
EOF

# Load the LaunchAgent:
launchctl load ~/Library/LaunchAgents/com.automationscout.app.plist
```

## Support

- **Documentation**: Check the `docs/` folder in installation directory
- **Logs**: `/Applications/AutomationScout/logs/`
- **Configuration**: `/Applications/AutomationScout/.env`
- **Troubleshooting**: See `INSTALLATION-TROUBLESHOOTING.md` for common solutions

---

*Automation Scout v1.0.0 - Professional macOS deployment*
*Cross-platform compatible with macOS optimization*