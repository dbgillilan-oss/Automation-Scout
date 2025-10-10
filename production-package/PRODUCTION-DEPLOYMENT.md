# Automation Scout - Production Deployment Guide

## 🚀 Production Installation Instructions

### System Requirements
- **Windows 10/11** (x64)
- **4GB RAM** minimum, 8GB recommended
- **500MB disk space** for application and data
- **.NET Framework 4.8** or higher
- **Visual C++ Redistributable 2019** or higher

### Pre-Installation Checklist

1. **Security Assessment**
   - [ ] Firewall rules configured for network access
   - [ ] Antivirus software whitelisted application directory
   - [ ] User permissions verified for installation directory
   - [ ] Corporate policies reviewed for desktop automation

2. **Environment Configuration**
   - [ ] `.env.production` file customized for client environment
   - [ ] Encryption keys generated and secured
   - [ ] Domain allow/block lists configured
   - [ ] Privacy officer and support contacts updated

3. **Client-Specific Settings**
   ```bash
   AS_CLIENT_COMPANY_NAME="Your Client Company"
   AS_CLIENT_SUPPORT_EMAIL="support@client.com" 
   AS_COMPLIANCE_DATA_CONTROLLER="CLIENT_COMPANY_NAME"
   AS_AUTOMATION_ALLOWED_DOMAINS=client.com,*.client.com
   ```

## 📦 Installation Process

### Step 1: Download Release Package
```powershell
# Download from secure distribution channel
Invoke-WebRequest -Uri "https://releases.automation-scout.com/v1.0.0/AutomationScout-Setup-1.0.0.exe" -OutFile "AutomationScout-Setup.exe"

# Verify signature (when available)
Get-AuthenticodeSignature .\AutomationScout-Setup.exe
```

### Step 2: Silent Installation (Recommended for Enterprise)
```powershell
# Install with custom configuration
.\AutomationScout-Setup.exe /S /D="C:\Program Files\Automation Scout" /CONFIG=".\production.env"

# Verify installation
Test-Path "C:\Program Files\Automation Scout\automation-scout.exe"
```

### Step 3: Configuration Setup
```powershell
# Copy production configuration
Copy-Item ".env.production" "C:\Program Files\Automation Scout\.env"

# Set proper permissions
icacls "C:\Program Files\Automation Scout\.env" /grant:r "SYSTEM:F" /grant:r "Administrators:F"
```

### Step 4: Service Registration
```powershell
# Register as Windows service (optional)
sc create "AutomationScout" binPath="C:\Program Files\Automation Scout\daemon-win.exe" start=auto

# Start service
sc start "AutomationScout"
```

## 🔧 Configuration Management

### Required Production Settings

#### Security Configuration
```env
AS_ENVIRONMENT=production
AS_ENCRYPTION_ENABLED=true
AS_ENCRYPTION_KEY=<SECURE_256_BIT_KEY>
AS_CONSENT_REQUIRED=true
AS_AUDIT_LOG_ENABLED=true
```

#### Privacy Controls  
```env
AS_DATA_RETENTION_DAYS=90
AS_REDACT_SENSITIVE_DATA=true
AS_ALLOW_TELEMETRY=false
AS_GDPR_COMPLIANCE=true
```

#### Performance Tuning
```env
AS_SYSTEM_MAX_MEMORY_MB=512
AS_SYSTEM_MAX_CPU_PERCENT=25
AS_AUTOMATION_MAX_CONCURRENT_JOBS=2
```

### Client Environment Variables

Update these settings for each deployment:

```env
# Client Information
AS_CLIENT_COMPANY_NAME="Acme Corporation"
AS_CLIENT_SUPPORT_EMAIL="it-support@acme.com"
AS_CLIENT_PRIVACY_OFFICER="privacy@acme.com"

# Domain Security
AS_AUTOMATION_ALLOWED_DOMAINS=acme.com,*.acme.com,partner.com
AS_AUTOMATION_BLOCKED_DOMAINS=competitor.com,malicious.com

# Compliance Requirements  
AS_COMPLIANCE_HIPAA_COMPLIANCE=true  # If healthcare client
AS_COMPLIANCE_SOX_COMPLIANCE=true    # If financial client
```

## 🔍 Post-Installation Verification

### Health Checks
```powershell
# Verify daemon is running
Get-Process -Name "daemon-win" -ErrorAction SilentlyContinue

# Check system tray application
Get-Process -Name "AutomationScout" -ErrorAction SilentlyContinue

# Test configuration loading
& "C:\Program Files\Automation Scout\automation-scout.exe" --test-config
```

### Log Verification
```powershell
# Check application logs
Get-Content "C:\Program Files\Automation Scout\logs\automation-scout.log" | Select-Object -Last 20

# Verify no errors in event log
Get-EventLog -LogName Application -Source "Automation Scout" -Newest 10
```

### Privacy Compliance Check
```powershell
# Verify consent mechanism is working
& "C:\Program Files\Automation Scout\automation-scout.exe" --verify-privacy

# Test data redaction
& "C:\Program Files\Automation Scout\automation-scout.exe" --test-redaction
```

## 🛠️ Troubleshooting

### Common Issues

#### Installation Fails
```powershell
# Check Windows version compatibility
Get-ComputerInfo | Select-Object WindowsProductName, WindowsVersion

# Verify .NET Framework
Get-ChildItem "HKLM:SOFTWARE\Microsoft\NET Framework Setup\NDP\v4\Full\" | Get-ItemPropertyValue -Name Release
```

#### Service Won't Start
```powershell
# Check service status
Get-Service "AutomationScout" | Format-List

# Review service logs
Get-EventLog -LogName System -Source "Service Control Manager" -Newest 5
```

#### Performance Issues
```powershell
# Monitor resource usage
Get-Counter "\Process(daemon-win)\% Processor Time" -SampleInterval 5 -MaxSamples 5

# Check memory usage
Get-Process "daemon-win" | Select-Object WorkingSet64, VirtualMemorySize64
```

### Configuration Validation
```powershell
# Test configuration syntax
node -e "
const { config } = require('@automation-scout/config');
try {
  config.load('./.env');
  config.validateProduction();
  console.log('✅ Configuration valid');
} catch (e) {
  console.error('❌ Configuration error:', e.message);
}
"
```

## 🔒 Security Hardening

### File System Permissions
```powershell
# Restrict configuration file access
icacls "C:\Program Files\Automation Scout\.env" /inheritance:r
icacls "C:\Program Files\Automation Scout\.env" /grant:r "SYSTEM:F" /grant:r "Administrators:R"

# Protect data directory
icacls "C:\Program Files\Automation Scout\data" /inheritance:r
icacls "C:\Program Files\Automation Scout\data" /grant:r "SYSTEM:F" /grant:r "Users:M"
```

### Network Security
```powershell
# Configure Windows Firewall (if needed)
New-NetFirewallRule -DisplayName "Automation Scout" -Direction Inbound -Program "C:\Program Files\Automation Scout\automation-scout.exe" -Action Allow

# Block unnecessary network access
New-NetFirewallRule -DisplayName "Block Automation Scout External" -Direction Outbound -Program "C:\Program Files\Automation Scout\automation-scout.exe" -RemoteAddress "0.0.0.0-255.255.255.255" -Action Block
```

## 📊 Monitoring & Maintenance

### Performance Monitoring
```powershell
# Create performance baseline
Get-Counter "\Process(daemon-win)\*" | Export-Csv "baseline.csv"

# Monitor pattern detection efficiency  
Get-Content "C:\Program Files\Automation Scout\logs\automation-scout.log" | Select-String "Pattern detected" | Measure-Object
```

### Regular Maintenance Tasks
```powershell
# Weekly log rotation (create scheduled task)
$action = New-ScheduledTaskAction -Execute "powershell.exe" -Argument "-File C:\Scripts\rotate-logs.ps1"
$trigger = New-ScheduledTaskTrigger -Weekly -DaysOfWeek Sunday -At 2am
Register-ScheduledTask -TaskName "AutomationScout-LogRotation" -Action $action -Trigger $trigger
```

### Health Check Script
```powershell
# Create monitoring script
@'
# Automation Scout Health Check
$processes = @("daemon-win", "AutomationScout")
$healthy = $true

foreach ($proc in $processes) {
    if (!(Get-Process $proc -ErrorAction SilentlyContinue)) {
        Write-Warning "$proc is not running"
        $healthy = $false
    }
}

if ($healthy) {
    Write-Output "✅ Automation Scout is healthy"
    exit 0
} else {
    Write-Error "❌ Automation Scout has issues"
    exit 1
}
'@ | Out-File "C:\Scripts\health-check.ps1"
```

## 🏢 Enterprise Deployment

### Group Policy Configuration
Create GPO for enterprise-wide deployment:

1. **Software Installation**
   - Computer Configuration → Software Settings → Software Installation
   - Add `AutomationScout-Setup.msi` package

2. **Registry Settings**
   ```reg
   [HKEY_LOCAL_MACHINE\SOFTWARE\AutomationScout]
   "InstallPath"="C:\\Program Files\\Automation Scout"
   "ConfigPath"="C:\\Program Files\\Automation Scout\\.env"
   "CompanyName"="CLIENT_COMPANY_NAME"
   ```

### SCCM Deployment Package
```powershell
# Create SCCM application
New-CMApplication -Name "Automation Scout" -Description "Privacy-first workflow automation"
Add-CMDeploymentType -ApplicationName "Automation Scout" -MsiInstaller -ContentLocation "\\sccm\packages\AutomationScout"
```

## 📞 Support Information

### Client Support Contacts
- **Technical Support**: support@client.com
- **Privacy Officer**: privacy@client.com  
- **Emergency Contact**: +1-555-0123

### Vendor Support
- **Documentation**: https://docs.automation-scout.com
- **Support Portal**: https://support.automation-scout.com
- **Emergency Support**: support@automation-scout.com

### Escalation Matrix
1. **Level 1**: Client IT Helpdesk
2. **Level 2**: Client System Administrators  
3. **Level 3**: Automation Scout Technical Support
4. **Level 4**: Automation Scout Engineering Team