#!/usr/bin/env node
/**
 * Automation Scout - Universal Bulletproof Installer
 * Works on Windows, macOS Sequoia, Linux, and all popular systems
 * No external dependencies, handles all edge cases
 */

const fs = require('fs');
const path = require('path');
const os = require('os');
const { execSync, spawn } = require('child_process');

// Platform detection
const platform = os.platform();
const isWindows = platform === 'win32';
const isMac = platform === 'darwin';
const isLinux = platform === 'linux';

// Colors for cross-platform output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m'
};

function colorLog(color, message) {
  if (isWindows) {
    console.log(message); // Windows terminal may not support colors
  } else {
    console.log(`${colors[color]}${message}${colors.reset}`);
  }
}

function printHeader() {
  console.log('');
  colorLog('blue', '🚀 AUTOMATION SCOUT UNIVERSAL INSTALLER');
  console.log('==========================================');
  colorLog('green', `✅ Platform: ${platform} (${isWindows ? 'Windows' : isMac ? 'macOS' : 'Linux'})`);
  colorLog('green', '✅ Universal compatibility mode active');
  console.log('');
}

function checkPrerequisites() {
  colorLog('blue', '🔍 Checking system prerequisites...');
  
  // Check Node.js
  try {
    const nodeVersion = process.version;
    colorLog('green', `✅ Node.js: ${nodeVersion}`);
    
    // Check npm
    const npmVersion = execSync('npm --version', { encoding: 'utf8' }).trim();
    colorLog('green', `✅ npm: v${npmVersion}`);
    
    return true;
  } catch (error) {
    colorLog('red', '❌ Node.js or npm not found');
    printNodeInstallInstructions();
    return false;
  }
}

function printNodeInstallInstructions() {
  console.log('');
  colorLog('yellow', '📦 Node.js Installation Required:');
  
  if (isWindows) {
    console.log('   1. Visit: https://nodejs.org/');
    console.log('   2. Download "Windows Installer (.msi)"');
    console.log('   3. Run installer as Administrator');
    console.log('   4. Restart Command Prompt and try again');
  } else if (isMac) {
    console.log('   1. Visit: https://nodejs.org/');
    console.log('   2. Download "macOS Installer (.pkg)"');
    console.log('   3. Run installer (may need admin password)');
    console.log('   4. Restart Terminal and try again');
    console.log('');
    colorLog('blue', '   📱 Alternative (if you have Homebrew):');
    console.log('   brew install node');
  } else {
    console.log('   Ubuntu/Debian: sudo apt update && sudo apt install nodejs npm');
    console.log('   CentOS/RHEL: sudo yum install nodejs npm');
    console.log('   Arch: sudo pacman -S nodejs npm');
  }
  console.log('');
}

function getInstallPath() {
  if (isWindows) {
    return 'C:\\AutomationScout';
  } else if (isMac) {
    return '/Applications/AutomationScout';
  } else {
    return '/opt/automation-scout';
  }
}

function createInstallDirectory() {
  const installPath = getInstallPath();
  colorLog('blue', `📁 Setting up installation directory: ${installPath}`);
  
  try {
    // Create backup if exists
    if (fs.existsSync(installPath)) {
      const backupPath = `${installPath}.backup.${Date.now()}`;
      colorLog('yellow', `⚠️  Existing installation found, backing up to: ${backupPath}`);
      
      if (isWindows) {
        execSync(`robocopy "${installPath}" "${backupPath}" /E /R:1 /W:1`, { stdio: 'ignore' });
      } else {
        execSync(`cp -r "${installPath}" "${backupPath}"`, { stdio: 'ignore' });
      }
    }
    
    // Remove existing and create fresh
    if (fs.existsSync(installPath)) {
      fs.rmSync(installPath, { recursive: true, force: true });
    }
    
    fs.mkdirSync(installPath, { recursive: true });
    colorLog('green', '✅ Installation directory created');
    
    return installPath;
  } catch (error) {
    colorLog('red', `❌ Failed to create directory: ${error.message}`);
    
    // Try alternative locations
    const alternatives = getAlternativePaths();
    for (const altPath of alternatives) {
      try {
        fs.mkdirSync(altPath, { recursive: true });
        colorLog('yellow', `✅ Using alternative location: ${altPath}`);
        return altPath;
      } catch (altError) {
        continue;
      }
    }
    
    throw new Error('Cannot create installation directory');
  }
}

function getAlternativePaths() {
  const homeDir = os.homedir();
  
  if (isWindows) {
    return [
      path.join(homeDir, 'AutomationScout'),
      path.join(homeDir, 'Desktop', 'AutomationScout'),
      path.join(process.cwd(), 'AutomationScout')
    ];
  } else if (isMac) {
    return [
      path.join(homeDir, 'Applications', 'AutomationScout'),
      path.join(homeDir, 'Desktop', 'AutomationScout'),
      path.join(process.cwd(), 'AutomationScout')
    ];
  } else {
    return [
      path.join(homeDir, 'automation-scout'),
      path.join(homeDir, 'Desktop', 'automation-scout'),
      path.join(process.cwd(), 'automation-scout')
    ];
  }
}

function copyFiles(installPath) {
  colorLog('blue', '📄 Copying application files...');
  
  const currentDir = process.cwd();
  const files = fs.readdirSync(currentDir);
  
  // Exclude installer files and system directories
  const excludePatterns = [
    'universal-install.js',
    'install.bat',
    'install-enhanced.bat', 
    'install.sh',
    'node_modules',
    '.git',
    'temp-check',
    /.*\.zip$/,
    /.*\.txt$/
  ];
  
  let copiedCount = 0;
  
  for (const file of files) {
    // Check if file should be excluded
    const shouldExclude = excludePatterns.some(pattern => {
      if (pattern instanceof RegExp) {
        return pattern.test(file);
      }
      return file === pattern;
    });
    
    if (shouldExclude) continue;
    
    const sourcePath = path.join(currentDir, file);
    const destPath = path.join(installPath, file);
    
    try {
      const stat = fs.statSync(sourcePath);
      
      if (stat.isDirectory()) {
        copyDirectory(sourcePath, destPath);
      } else {
        fs.copyFileSync(sourcePath, destPath);
      }
      
      copiedCount++;
    } catch (error) {
      colorLog('yellow', `⚠️  Skipped ${file}: ${error.message}`);
    }
  }
  
  colorLog('green', `✅ Copied ${copiedCount} files/directories`);
}

function copyDirectory(source, destination) {
  if (!fs.existsSync(destination)) {
    fs.mkdirSync(destination, { recursive: true });
  }
  
  const files = fs.readdirSync(source);
  
  for (const file of files) {
    const sourcePath = path.join(source, file);
    const destPath = path.join(destination, file);
    
    const stat = fs.statSync(sourcePath);
    
    if (stat.isDirectory()) {
      copyDirectory(sourcePath, destPath);
    } else {
      fs.copyFileSync(sourcePath, destPath);
    }
  }
}

function installDependencies(installPath) {
  colorLog('blue', '📦 Installing Node.js dependencies...');
  
  const originalCwd = process.cwd();
  
  try {
    process.chdir(installPath);
    
    // Clean any existing node_modules
    const nodeModulesPath = path.join(installPath, 'node_modules');
    if (fs.existsSync(nodeModulesPath)) {
      fs.rmSync(nodeModulesPath, { recursive: true, force: true });
    }
    
    // Remove package-lock.json for clean install
    const lockPath = path.join(installPath, 'package-lock.json');
    if (fs.existsSync(lockPath)) {
      fs.unlinkSync(lockPath);
    }
    
    // Install with multiple fallback strategies
    const installCommands = [
      'npm install --production --no-audit --no-fund',
      'npm install --production --no-audit',
      'npm install --production',
      'npm install'
    ];
    
    let installed = false;
    
    for (const command of installCommands) {
      try {
        colorLog('blue', `   Trying: ${command}`);
        execSync(command, { stdio: 'pipe', timeout: 120000 });
        installed = true;
        break;
      } catch (error) {
        colorLog('yellow', `   ⚠️  Command failed, trying next...`);
        continue;
      }
    }
    
    if (!installed) {
      throw new Error('All npm install methods failed');
    }
    
    colorLog('green', '✅ Dependencies installed successfully');
    
  } catch (error) {
    colorLog('red', `❌ Dependency installation failed: ${error.message}`);
    colorLog('yellow', '💡 The application may still work without some optional dependencies');
  } finally {
    process.chdir(originalCwd);
  }
}

function createSystemIntegration(installPath) {
  colorLog('blue', '🖥️  Setting up system integration...');
  
  try {
    if (isWindows) {
      createWindowsIntegration(installPath);
    } else if (isMac) {
      createMacIntegration(installPath);
    } else {
      createLinuxIntegration(installPath);
    }
    
    colorLog('green', '✅ System integration configured');
  } catch (error) {
    colorLog('yellow', `⚠️  System integration partially configured: ${error.message}`);
  }
}

function createWindowsIntegration(installPath) {
  // Create launch script
  const launchScript = `@echo off
cd /d "${installPath}"
node index.js
pause`;
  
  fs.writeFileSync(path.join(installPath, 'start.bat'), launchScript);
  
  // Try to create desktop shortcut
  try {
    const desktopPath = path.join(os.homedir(), 'Desktop');
    const shortcutScript = `@echo off
cd /d "${installPath}"
node index.js`;
    
    fs.writeFileSync(path.join(desktopPath, 'Automation Scout.bat'), shortcutScript);
  } catch (error) {
    // Ignore if can't create desktop shortcut
  }
}

function createMacIntegration(installPath) {
  // Create launch script
  const launchScript = `#!/bin/bash
cd "${installPath}"
node index.js`;
  
  const scriptPath = path.join(installPath, 'start.sh');
  fs.writeFileSync(scriptPath, launchScript);
  
  // Make executable
  try {
    execSync(`chmod +x "${scriptPath}"`, { stdio: 'ignore' });
  } catch (error) {
    // Ignore chmod errors
  }
  
  // Try to create command line access
  try {
    const binPath = '/usr/local/bin/automation-scout';
    if (fs.existsSync('/usr/local/bin')) {
      execSync(`ln -sf "${scriptPath}" "${binPath}"`, { stdio: 'ignore' });
    }
  } catch (error) {
    // Ignore if can't create symlink
  }
}

function createLinuxIntegration(installPath) {
  // Create launch script
  const launchScript = `#!/bin/bash
cd "${installPath}"
node index.js`;
  
  const scriptPath = path.join(installPath, 'start.sh');
  fs.writeFileSync(scriptPath, launchScript);
  
  // Make executable
  try {
    execSync(`chmod +x "${scriptPath}"`, { stdio: 'ignore' });
  } catch (error) {
    // Ignore chmod errors
  }
}

function createConfiguration(installPath) {
  colorLog('blue', '⚙️  Setting up configuration...');
  
  const envPath = path.join(installPath, '.env');
  
  if (!fs.existsSync(envPath)) {
    const defaultConfig = `# Automation Scout Configuration
AS_ENVIRONMENT=production
AS_CLIENT_COMPANY_NAME=Client Company
AS_CONSENT_REQUIRED=true
AS_DATA_RETENTION_DAYS=90
AS_ENCRYPTION_ENABLED=true
AS_AUDIT_LOG_ENABLED=true
AS_LOG_LEVEL=info

# Platform-specific settings
AS_PLATFORM=${platform}
AS_INSTALL_PATH=${installPath}
AS_INSTALL_DATE=${new Date().toISOString()}
`;
    
    fs.writeFileSync(envPath, defaultConfig);
    colorLog('green', '✅ Configuration file created');
  } else {
    colorLog('green', '✅ Configuration file already exists');
  }
}

function runVerification(installPath) {
  colorLog('blue', '🔍 Running installation verification...');
  
  const originalCwd = process.cwd();
  
  try {
    process.chdir(installPath);
    
    // Check essential files
    const essentialFiles = ['index.js', 'package.json', '.env'];
    
    for (const file of essentialFiles) {
      if (!fs.existsSync(file)) {
        throw new Error(`Essential file missing: ${file}`);
      }
    }
    
    // Quick Node.js test
    execSync('node -e "console.log(\'Node.js test: OK\')"', { stdio: 'pipe' });
    
    colorLog('green', '✅ Installation verification passed');
    return true;
    
  } catch (error) {
    colorLog('red', `❌ Verification failed: ${error.message}`);
    return false;
  } finally {
    process.chdir(originalCwd);
  }
}

function printSuccessMessage(installPath) {
  console.log('');
  colorLog('green', '🎉 INSTALLATION COMPLETED SUCCESSFULLY!');
  console.log('========================================');
  console.log('');
  colorLog('blue', `📍 Installation location: ${installPath}`);
  console.log('');
  colorLog('green', '🚀 To start Automation Scout:');
  
  if (isWindows) {
    console.log(`   cd "${installPath}"`);
    console.log('   npm start');
    console.log('');
    console.log('   OR double-click: start.bat');
  } else if (isMac) {
    console.log(`   cd "${installPath}"`);
    console.log('   npm start');
    console.log('');
    console.log('   OR run: ./start.sh');
  } else {
    console.log(`   cd "${installPath}"`);
    console.log('   npm start');
    console.log('');
    console.log('   OR run: ./start.sh');
  }
  
  console.log('');
  colorLog('blue', '📖 Documentation:');
  console.log(`   ${path.join(installPath, 'README.md')}`);
  console.log(`   ${path.join(installPath, 'MACOS-INSTALLATION.md')}`);
  console.log('');
  colorLog('green', 'Automation Scout is ready for use!');
  console.log('');
}

function printErrorMessage(error) {
  console.log('');
  colorLog('red', '❌ INSTALLATION FAILED');
  console.log('=======================');
  console.log('');
  colorLog('red', `Error: ${error.message}`);
  console.log('');
  colorLog('yellow', '🆘 Troubleshooting:');
  console.log('   1. Ensure Node.js is installed (https://nodejs.org/)');
  console.log('   2. Try running as Administrator/sudo');
  console.log('   3. Check available disk space');
  console.log('   4. Disable antivirus temporarily');
  console.log('');
  colorLog('blue', '📧 Need help? Contact support with the error message above.');
  console.log('');
}

// Main installation process
async function main() {
  try {
    printHeader();
    
    // Check prerequisites
    if (!checkPrerequisites()) {
      process.exit(1);
    }
    
    // Create installation directory
    const installPath = createInstallDirectory();
    
    // Copy application files
    copyFiles(installPath);
    
    // Install Node.js dependencies
    installDependencies(installPath);
    
    // Create configuration
    createConfiguration(installPath);
    
    // Set up system integration
    createSystemIntegration(installPath);
    
    // Verify installation
    const verified = runVerification(installPath);
    
    if (verified) {
      printSuccessMessage(installPath);
    } else {
      throw new Error('Installation verification failed');
    }
    
  } catch (error) {
    printErrorMessage(error);
    process.exit(1);
  }
}

// Handle Ctrl+C gracefully
process.on('SIGINT', () => {
  console.log('');
  colorLog('yellow', '⚠️  Installation cancelled by user');
  process.exit(1);
});

// Run installer
if (require.main === module) {
  main();
}

module.exports = { main };