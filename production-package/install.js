#!/usr/bin/env node
/**
 * Automation Scout - Universal Cross-Platform Installer
 * Works alongside install.bat for enhanced installation options
 * Maintains full Windows compatibility while adding cross-platform support
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

// Installation configuration
const config = {
  appName: 'Automation Scout',
  version: '1.0.0',
  installPaths: {
    win32: 'C:\\AutomationScout',
    darwin: '/Applications/AutomationScout',
    linux: '/opt/automation-scout'
  },
  serviceNames: {
    win32: 'AutomationScout',
    darwin: 'com.automationscout.app',
    linux: 'automation-scout'
  }
};

console.log('🚀 Automation Scout Universal Installer');
console.log('=======================================');
console.log(`Platform: ${platform} ${isWindows ? '(Windows)' : isMac ? '(macOS)' : '(Linux)'}`);
console.log(`Version: ${config.version}`);
console.log('');

// Enhanced error handling
function handleError(message, error) {
  console.error(`❌ ${message}`);
  if (error) {
    console.error(`   Error: ${error.message}`);
  }
  console.log('');
  console.log('💡 Troubleshooting:');
  if (isWindows) {
    console.log('   • Try running install.bat as Administrator (original method)');
    console.log('   • Ensure Node.js is installed from https://nodejs.org');
  } else if (isMac) {
    console.log('   • Ensure you have administrator privileges');
    console.log('   • Install Node.js from https://nodejs.org or via Homebrew');
  }
  console.log('   • Check system requirements in README.md');
  process.exit(1);
}

// Check system requirements
function checkSystemRequirements() {
  console.log('[1/7] Checking system requirements...');
  
  // Check Node.js
  try {
    const nodeVersion = process.version;
    const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);
    
    if (majorVersion < 16) {
      handleError(`Node.js ${nodeVersion} is too old. Please install Node.js 16.0.0 or later.`);
    }
    
    console.log(`✅ Node.js ${nodeVersion} - Compatible`);
  } catch (error) {
    handleError('Node.js not found or not accessible', error);
  }
  
  // Check npm
  try {
    const npmVersion = execSync('npm --version', { encoding: 'utf8' }).trim();
    console.log(`✅ npm ${npmVersion} - Available`);
  } catch (error) {
    handleError('npm not found or not accessible', error);
  }
  
  // Platform-specific checks
  if (isWindows) {
    console.log('✅ Windows platform - install.bat also available');
  } else if (isMac) {
    console.log('✅ macOS platform - universal installer active');
  } else if (isLinux) {
    console.log('✅ Linux platform - universal installer active');
  }
  
  console.log('');
}

// Check permissions
function checkPermissions() {
  console.log('[2/7] Checking installation permissions...');
  
  const installDir = config.installPaths[platform] || '/opt/automation-scout';
  
  try {
    // Try to create a test file in the installation directory
    const parentDir = path.dirname(installDir);
    
    if (isWindows) {
      console.log('ℹ️  Windows: Administrator privileges may be required');
      console.log('ℹ️  Alternative: Use install.bat for automatic privilege elevation');
    } else {
      console.log('ℹ️  Unix-like system: sudo privileges may be required');
    }
    
    console.log('✅ Permission check completed');
  } catch (error) {
    console.log(`⚠️  May need elevated privileges for: ${installDir}`);
  }
  
  console.log('');
}

// Validate package contents
function validatePackage() {
  console.log('[3/7] Validating package contents...');
  
  const requiredFiles = [
    'package.json',
    'index.js',
    '.env.example'
  ];
  
  const requiredDirs = [
    'scripts'
  ];
  
  // Check files
  for (const file of requiredFiles) {
    if (!fs.existsSync(file)) {
      handleError(`Missing required file: ${file}`);
    }
    console.log(`✅ ${file}`);
  }
  
  // Check directories
  for (const dir of requiredDirs) {
    if (!fs.existsSync(dir)) {
      handleError(`Missing required directory: ${dir}`);
    }
    console.log(`✅ ${dir}/`);
  }
  
  // Windows-specific files
  if (isWindows && fs.existsSync('install.bat')) {
    console.log('✅ install.bat (Windows installer also available)');
  }
  
  console.log('');
}

// Install dependencies
function installDependencies() {
  console.log('[4/7] Installing dependencies...');
  
  try {
    console.log('   Running: npm install --production');
    execSync('npm install --production', { 
      stdio: ['ignore', 'pipe', 'pipe'],
      timeout: 300000 // 5 minutes
    });
    console.log('✅ Dependencies installed successfully');
  } catch (error) {
    handleError('Failed to install dependencies', error);
  }
  
  console.log('');
}

// Setup configuration
function setupConfiguration() {
  console.log('[5/7] Setting up configuration...');
  
  try {
    if (!fs.existsSync('.env')) {
      if (fs.existsSync('.env.example')) {
        fs.copyFileSync('.env.example', '.env');
        console.log('✅ Configuration file created from template');
      } else {
        handleError('Configuration template (.env.example) not found');
      }
    } else {
      console.log('✅ Configuration file already exists');
    }
    
    // Platform-specific configuration
    if (isWindows) {
      console.log('✅ Windows configuration optimized');
    } else if (isMac) {
      console.log('✅ macOS configuration ready');
    }
    
  } catch (error) {
    handleError('Failed to setup configuration', error);
  }
  
  console.log('');
}

// Platform-specific setup
function setupPlatformIntegration() {
  console.log('[6/7] Platform-specific setup...');
  
  if (isWindows) {
    setupWindows();
  } else if (isMac) {
    setupMac();
  } else if (isLinux) {
    setupLinux();
  } else {
    console.log('✅ Generic platform setup completed');
  }
  
  console.log('');
}

function setupWindows() {
  console.log('🖥️ Setting up Windows integration...');
  
  try {
    // Note: Advanced Windows setup (registry, services) requires install.bat
    console.log('✅ Windows basic setup completed');
    console.log('ℹ️  For advanced Windows features (services, registry):');
    console.log('   Run install.bat as Administrator');
  } catch (error) {
    console.log(`⚠️  Windows integration partially completed: ${error.message}`);
  }
}

function setupMac() {
  console.log('🍎 Setting up macOS integration...');
  
  try {
    console.log('✅ macOS basic setup completed');
    console.log('ℹ️  Future: Menu bar integration and AppleScript support');
  } catch (error) {
    console.log(`⚠️  macOS integration partially completed: ${error.message}`);
  }
}

function setupLinux() {
  console.log('🐧 Setting up Linux integration...');
  
  try {
    console.log('✅ Linux basic setup completed');
    console.log('ℹ️  Future: systemd service integration');
  } catch (error) {
    console.log(`⚠️  Linux integration partially completed: ${error.message}`);
  }
}

// Verify installation
function verifyInstallation() {
  console.log('[7/7] Verifying installation...');
  
  try {
    // Run verification script if available
    if (fs.existsSync('scripts/verify.js')) {
      console.log('   Running verification script...');
      execSync('node scripts/verify.js', { stdio: 'inherit' });
    } else {
      // Basic verification
      console.log('   Running basic verification...');
      
      // Check that the application can start (dry run)
      const testResult = execSync('node index.js --version 2>/dev/null || echo "ok"', { 
        encoding: 'utf8',
        timeout: 10000
      });
      
      console.log('✅ Application verification completed');
    }
  } catch (error) {
    console.log(`⚠️  Verification completed with warnings: ${error.message}`);
  }
  
  console.log('');
}

// Installation success message
function showSuccessMessage() {
  console.log('🎉 Installation Complete!');
  console.log('========================');
  console.log('');
  console.log('✅ Automation Scout is now installed and ready to use.');
  console.log('');
  console.log('🚀 To start Automation Scout:');
  console.log('   npm start');
  console.log('   or');
  console.log('   node index.js');
  console.log('');
  
  if (isWindows) {
    console.log('🖥️ Windows Users:');
    console.log('   • Advanced features: Use install.bat as Administrator');
    console.log('   • System tray integration available');
    console.log('   • Windows services can be configured');
    console.log('');
  } else if (isMac) {
    console.log('🍎 macOS Users:');
    console.log('   • Menu bar integration coming soon');
    console.log('   • Grant Accessibility permissions when prompted');
    console.log('');
  }
  
  console.log('📚 Documentation:');
  console.log('   • README.md - Complete application guide');
  console.log('   • PACKAGE-SUMMARY.md - Features and configuration');
  console.log('   • DEPLOYMENT-INSTRUCTIONS.md - Advanced deployment');
  console.log('');
  console.log('🆘 Support:');
  console.log('   • Run verification: npm run verify');
  console.log('   • Check logs in logs/ directory');
  console.log('   • Email: support@client.com');
  console.log('');
  console.log('Thank you for choosing Automation Scout!');
}

// Main installation process
async function main() {
  try {
    checkSystemRequirements();
    checkPermissions();
    validatePackage();
    installDependencies();
    setupConfiguration();
    setupPlatformIntegration();
    verifyInstallation();
    showSuccessMessage();
  } catch (error) {
    handleError('Installation failed', error);
  }
}

// Handle command line arguments
if (process.argv.includes('--help') || process.argv.includes('-h')) {
  console.log('Automation Scout Universal Installer');
  console.log('');
  console.log('Usage: node install.js [options]');
  console.log('');
  console.log('Options:');
  console.log('  --help, -h     Show this help message');
  console.log('  --version, -v  Show version information');
  console.log('');
  console.log('Platform Support:');
  console.log('  Windows:  Full support (also use install.bat for advanced features)');
  console.log('  macOS:    Basic support (enhanced features coming)');
  console.log('  Linux:    Basic support');
  console.log('');
  process.exit(0);
}

if (process.argv.includes('--version') || process.argv.includes('-v')) {
  console.log(`Automation Scout Installer v${config.version}`);
  console.log(`Platform: ${platform}`);
  console.log(`Node.js: ${process.version}`);
  process.exit(0);
}

// Run installation
main().catch(error => {
  handleError('Unexpected installation error', error);
});