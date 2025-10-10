/**
 * Verification Script for Automation Scout
 * Validates the production installation
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Automation Scout Installation Verification');
console.log('=============================================\n');

let allChecks = true;

// Check Node.js environment
function checkEnvironment() {
  console.log('📋 Environment Check');
  console.log('-------------------');
  
  console.log(`Node.js version: ${process.version}`);
  console.log(`Platform: ${process.platform} ${process.arch}`);
  console.log(`Working directory: ${process.cwd()}`);
  
  const majorVersion = parseInt(process.version.split('.')[0].substring(1));
  if (majorVersion >= 18) {
    console.log('✅ Node.js version is compatible\n');
  } else {
    console.log('❌ Node.js 18+ required\n');
    allChecks = false;
  }
}

// Check required files
function checkFiles() {
  console.log('📄 File System Check');
  console.log('-------------------');
  
  const requiredFiles = [
    'package.json',
    'index.js',
    '.env',
    'README.md'
  ];
  
  const optionalFiles = [
    'PRODUCTION-DEPLOYMENT.md',
    'scripts/install.js'
  ];
  
  requiredFiles.forEach(file => {
    if (fs.existsSync(file)) {
      console.log(`✅ ${file}`);
    } else {
      console.log(`❌ ${file} - MISSING`);
      allChecks = false;
    }
  });
  
  optionalFiles.forEach(file => {
    if (fs.existsSync(file)) {
      console.log(`✅ ${file}`);
    } else {
      console.log(`⚠️  ${file} - Optional file missing`);
    }
  });
  
  console.log('');
}

// Check directories
function checkDirectories() {
  console.log('📁 Directory Structure Check');
  console.log('---------------------------');
  
  const requiredDirs = [
    'data',
    'logs',
    'scripts'
  ];
  
  const optionalDirs = [
    'backups',
    'config'
  ];
  
  requiredDirs.forEach(dir => {
    if (fs.existsSync(dir)) {
      console.log(`✅ ${dir}/`);
    } else {
      console.log(`❌ ${dir}/ - Creating...`);
      fs.mkdirSync(dir, { recursive: true });
      console.log(`✅ ${dir}/ - Created`);
    }
  });
  
  optionalDirs.forEach(dir => {
    if (fs.existsSync(dir)) {
      console.log(`✅ ${dir}/`);
    } else {
      console.log(`⚠️  ${dir}/ - Optional directory missing`);
    }
  });
  
  console.log('');
}

// Check configuration
function checkConfiguration() {
  console.log('⚙️  Configuration Check');
  console.log('----------------------');
  
  if (!fs.existsSync('.env')) {
    console.log('❌ .env file not found');
    allChecks = false;
    return;
  }
  
  // Load configuration
  require('dotenv').config();
  
  const requiredSettings = [
    'AS_ENVIRONMENT',
    'AS_CONSENT_REQUIRED', 
    'AS_DATA_RETENTION_DAYS'
  ];
  
  const recommendedSettings = [
    'AS_CLIENT_COMPANY_NAME',
    'AS_CLIENT_SUPPORT_EMAIL',
    'AS_ENCRYPTION_ENABLED',
    'AS_AUDIT_LOG_ENABLED'
  ];
  
  console.log('Required settings:');
  requiredSettings.forEach(setting => {
    if (process.env[setting] !== undefined) {
      console.log(`✅ ${setting}: ${process.env[setting]}`);
    } else {
      console.log(`❌ ${setting}: NOT SET`);
      allChecks = false;
    }
  });
  
  console.log('\nRecommended settings:');
  recommendedSettings.forEach(setting => {
    if (process.env[setting] !== undefined) {
      console.log(`✅ ${setting}: ${process.env[setting]}`);
    } else {
      console.log(`⚠️  ${setting}: Not configured`);
    }
  });
  
  console.log('');
}

// Check dependencies
function checkDependencies() {
  console.log('📦 Dependencies Check');
  console.log('--------------------');
  
  if (!fs.existsSync('node_modules')) {
    console.log('❌ node_modules directory not found');
    console.log('   Run: npm install');
    allChecks = false;
    return;
  }
  
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const dependencies = packageJson.dependencies || {};
  
  Object.keys(dependencies).forEach(dep => {
    const depPath = path.join('node_modules', dep);
    if (fs.existsSync(depPath)) {
      console.log(`✅ ${dep}`);
    } else {
      console.log(`❌ ${dep} - Not installed`);
      allChecks = false;
    }
  });
  
  console.log('');
}

// Security check
function checkSecurity() {
  console.log('🔒 Security Check');
  console.log('----------------');
  
  // Check if running in production
  const environment = process.env.AS_ENVIRONMENT;
  if (environment === 'production') {
    console.log('✅ Environment: Production');
    
    // Check encryption
    if (process.env.AS_ENCRYPTION_ENABLED === 'true') {
      if (process.env.AS_ENCRYPTION_KEY) {
        console.log('✅ Encryption: Enabled with key');
      } else {
        console.log('❌ Encryption: Enabled but no key provided');
        allChecks = false;
      }
    } else {
      console.log('⚠️  Encryption: Disabled (consider enabling for production)');
    }
    
    // Check consent
    if (process.env.AS_CONSENT_REQUIRED === 'true') {
      console.log('✅ Consent: Required');
    } else {
      console.log('❌ Consent: Not required (required for production)');
      allChecks = false;
    }
    
    // Check debug settings
    if (process.env.AS_DEBUG_ENABLED === 'false' || !process.env.AS_DEBUG_ENABLED) {
      console.log('✅ Debug mode: Disabled');
    } else {
      console.log('⚠️  Debug mode: Enabled (should be disabled for production)');
    }
    
  } else {
    console.log(`⚠️  Environment: ${environment || 'not set'} (should be 'production')`);
  }
  
  console.log('');
}

// Performance check
function checkPerformance() {
  console.log('⚡ Performance Configuration');
  console.log('--------------------------');
  
  const memoryLimit = process.env.AS_SYSTEM_MAX_MEMORY_MB || '512';
  const cpuLimit = process.env.AS_SYSTEM_MAX_CPU_PERCENT || '25';
  const concurrentJobs = process.env.AS_AUTOMATION_MAX_CONCURRENT_JOBS || '2';
  
  console.log(`Memory limit: ${memoryLimit} MB`);
  console.log(`CPU limit: ${cpuLimit}%`);
  console.log(`Max concurrent jobs: ${concurrentJobs}`);
  
  if (parseInt(memoryLimit) > 0 && parseInt(cpuLimit) > 0) {
    console.log('✅ Resource limits configured');
  } else {
    console.log('⚠️  Resource limits not properly configured');
  }
  
  console.log('');
}

// Privacy compliance check
function checkPrivacyCompliance() {
  console.log('🔏 Privacy Compliance');
  console.log('--------------------');
  
  const checks = [
    { key: 'AS_CONSENT_REQUIRED', label: 'Consent required', expected: 'true' },
    { key: 'AS_AUDIT_LOG_ENABLED', label: 'Audit logging', expected: 'true' },
    { key: 'AS_REDACT_SENSITIVE_DATA', label: 'Data redaction', expected: 'true' },
    { key: 'AS_COMPLIANCE_GDPR_COMPLIANCE', label: 'GDPR compliance', expected: 'true' },
    { key: 'AS_DATA_RETENTION_DAYS', label: 'Data retention', check: (val) => parseInt(val) > 0 }
  ];
  
  checks.forEach(check => {
    const value = process.env[check.key];
    let passed = false;
    
    if (check.expected) {
      passed = value === check.expected;
    } else if (check.check) {
      passed = check.check(value);
    }
    
    if (passed) {
      console.log(`✅ ${check.label}: ${value}`);
    } else {
      console.log(`❌ ${check.label}: ${value || 'not set'}`);
      allChecks = false;
    }
  });
  
  console.log('');
}

// Final summary
function showSummary() {
  console.log('📊 Verification Summary');
  console.log('======================');
  
  if (allChecks) {
    console.log('✅ ALL CHECKS PASSED');
    console.log('');
    console.log('🎉 Automation Scout is ready for production!');
    console.log('');
    console.log('Next steps:');
    console.log('1. Start the application: npm start');
    console.log('2. Check system tray for Automation Scout icon');
    console.log('3. Monitor logs in logs/ directory');
    console.log('4. Review privacy settings in the application');
    console.log('');
    console.log('🆘 Support:');
    console.log(`   Email: ${process.env.AS_CLIENT_SUPPORT_EMAIL || 'support@client.com'}`);
    console.log('   Documentation: README.md and PRODUCTION-DEPLOYMENT.md');
    
    process.exit(0);
  } else {
    console.log('❌ SOME CHECKS FAILED');
    console.log('');
    console.log('Please review the failed checks above and fix any issues.');
    console.log('Then run this verification script again: npm run verify');
    console.log('');
    console.log('Common fixes:');
    console.log('• Install dependencies: npm install');
    console.log('• Check .env configuration');
    console.log('• Set AS_ENVIRONMENT=production');
    console.log('• Enable required security features');
    
    process.exit(1);
  }
}

// Run all checks
function main() {
  checkEnvironment();
  checkFiles();
  checkDirectories();
  checkConfiguration();
  checkDependencies();
  checkSecurity();
  checkPerformance();
  checkPrivacyCompliance();
  showSummary();
}

// Execute verification
main();