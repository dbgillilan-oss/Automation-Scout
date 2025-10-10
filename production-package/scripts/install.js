/**
 * Installation Script for Automation Scout
 * Sets up the production environment
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Automation Scout Installation Script');
console.log('=====================================\n');

// Check Node.js version
function checkNodeVersion() {
  const version = process.version;
  const majorVersion = parseInt(version.split('.')[0].substring(1));
  
  console.log(`📋 Node.js version: ${version}`);
  
  if (majorVersion < 18) {
    console.error('❌ Node.js 18+ is required');
    console.error('   Please upgrade Node.js: https://nodejs.org');
    process.exit(1);
  }
  
  console.log('✅ Node.js version is compatible\n');
}

// Install dependencies
function installDependencies() {
  console.log('📦 Installing dependencies...');
  
  try {
    console.log('   Running npm install...');
    execSync('npm install --production', { stdio: 'inherit' });
    console.log('✅ Dependencies installed successfully\n');
  } catch (error) {
    console.error('❌ Failed to install dependencies');
    console.error('   Please run: npm install --production');
    process.exit(1);
  }
}

// Set up configuration
function setupConfiguration() {
  console.log('⚙️  Setting up configuration...');
  
  // Copy example configuration if .env doesn't exist
  if (!fs.existsSync('.env')) {
    if (fs.existsSync('.env.example')) {
      fs.copyFileSync('.env.example', '.env');
      console.log('✅ Copied .env.example to .env');
    } else {
      console.log('⚠️  No .env.example found, creating basic .env');
      const basicConfig = `# Automation Scout Configuration
AS_ENVIRONMENT=production
AS_CONSENT_REQUIRED=true
AS_DATA_RETENTION_DAYS=90
AS_CLIENT_COMPANY_NAME=Your Company
AS_CLIENT_SUPPORT_EMAIL=support@yourcompany.com
`;
      fs.writeFileSync('.env', basicConfig);
      console.log('✅ Created basic .env file');
    }
  } else {
    console.log('✅ Configuration file .env already exists');
  }
  
  console.log('');
  console.log('🔧 IMPORTANT: Please edit .env file with your specific settings:');
  console.log('   • AS_CLIENT_COMPANY_NAME - Your company name');
  console.log('   • AS_CLIENT_SUPPORT_EMAIL - Your support contact');
  console.log('   • AS_ENCRYPTION_KEY - Secure encryption key (if encryption enabled)');
  console.log('   • AS_AUTOMATION_ALLOWED_DOMAINS - Your allowed domains');
  console.log('');
}

// Create directories
function createDirectories() {
  console.log('📁 Creating application directories...');
  
  const dirs = [
    'data',
    'logs', 
    'backups',
    'config'
  ];
  
  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`   Created: ${dir}/`);
    } else {
      console.log(`   Exists: ${dir}/`);
    }
  });
  
  console.log('✅ Directories created\n');
}

// Set up Windows service (optional)
function setupWindowsService() {
  console.log('🏢 Windows Service Setup (Optional)');
  console.log('To run Automation Scout as a Windows service:');
  console.log('');
  console.log('1. Open Command Prompt as Administrator');
  console.log('2. Navigate to this directory');
  console.log('3. Run: sc create "AutomationScout" binPath="[FULL_PATH]\\index.js" start=auto');
  console.log('4. Run: sc start "AutomationScout"');
  console.log('');
  console.log('Or run manually with: npm start');
  console.log('');
}

// Security recommendations
function securityRecommendations() {
  console.log('🔒 Security Recommendations');
  console.log('===========================');
  console.log('');
  console.log('1. 🔐 Set a strong encryption key in .env:');
  console.log('   AS_ENCRYPTION_KEY=<256-bit-hex-key>');
  console.log('');
  console.log('2. 🛡️  Configure domain restrictions:');
  console.log('   AS_AUTOMATION_ALLOWED_DOMAINS=yourcompany.com,*.yourcompany.com');
  console.log('');
  console.log('3. 📊 Enable audit logging:');
  console.log('   AS_AUDIT_LOG_ENABLED=true');
  console.log('');
  console.log('4. 🚫 Disable debug features:');
  console.log('   AS_DEBUG_ENABLED=false');
  console.log('');
  console.log('5. 📝 Configure log rotation:');
  console.log('   AS_LOG_MAX_SIZE_MB=100');
  console.log('');
}

// Privacy compliance checklist
function privacyCompliance() {
  console.log('🔏 Privacy Compliance Checklist');
  console.log('===============================');
  console.log('');
  console.log('□ Review and customize privacy policy');
  console.log('□ Set appropriate data retention period');
  console.log('□ Configure consent requirements');
  console.log('□ Enable data encryption');
  console.log('□ Set up audit logging');
  console.log('□ Define data processing purpose');
  console.log('□ Identify data controller');
  console.log('□ Configure GDPR/CCPA compliance flags');
  console.log('');
  console.log('See PRODUCTION-DEPLOYMENT.md for detailed compliance guide.');
  console.log('');
}

// Final verification
function finalVerification() {
  console.log('🔍 Running installation verification...');
  
  // Check if .env exists and has required fields
  if (!fs.existsSync('.env')) {
    console.error('❌ .env file not found');
    return false;
  }
  
  // Load and check environment
  require('dotenv').config();
  
  const required = [
    'AS_ENVIRONMENT',
    'AS_CONSENT_REQUIRED',
    'AS_DATA_RETENTION_DAYS'
  ];
  
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.error('❌ Missing required configuration:', missing.join(', '));
    return false;
  }
  
  console.log('✅ Installation verification passed');
  return true;
}

// Main installation flow
async function main() {
  try {
    checkNodeVersion();
    installDependencies();
    setupConfiguration();
    createDirectories();
    setupWindowsService();
    securityRecommendations();
    privacyCompliance();
    
    if (finalVerification()) {
      console.log('');
      console.log('🎉 Installation Complete!');
      console.log('========================');
      console.log('');
      console.log('Next steps:');
      console.log('1. Review and edit .env file with your settings');
      console.log('2. Run verification: npm run verify');
      console.log('3. Start application: npm start');
      console.log('');
      console.log('📚 Documentation:');
      console.log('   • README.md - Overview and quick start');
      console.log('   • PRODUCTION-DEPLOYMENT.md - Detailed deployment guide');
      console.log('');
      console.log('📞 Support:');
      console.log(`   • Email: ${process.env.AS_CLIENT_SUPPORT_EMAIL || 'support@client.com'}`);
      console.log('   • Documentation: https://docs.automation-scout.com');
    } else {
      console.error('');
      console.error('❌ Installation verification failed');
      console.error('Please review the configuration and try again.');
      process.exit(1);
    }
    
  } catch (error) {
    console.error('❌ Installation failed:', error.message);
    process.exit(1);
  }
}

// Run installation
main();