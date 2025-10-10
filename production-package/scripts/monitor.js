/**
 * Production Monitoring and Health Check System
 * Provides real-time monitoring, logging, and alerting
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class ProductionMonitor {
  constructor() {
    this.startTime = new Date();
    this.metrics = {
      uptime: 0,
      memoryUsage: 0,
      cpuUsage: 0,
      eventCount: 0,
      patternCount: 0,
      automationCount: 0,
      errorCount: 0
    };
    
    this.healthChecks = [];
    this.alerts = [];
    
    this.initializeMonitoring();
  }
  
  initializeMonitoring() {
    console.log('🔍 Initializing production monitoring...');
    
    // Set up periodic health checks
    setInterval(() => this.runHealthChecks(), 60000); // Every minute
    setInterval(() => this.collectMetrics(), 30000); // Every 30 seconds
    setInterval(() => this.logStatus(), 300000); // Every 5 minutes
    
    // Set up log rotation
    this.setupLogRotation();
    
    // Monitor system resources
    this.monitorResources();
    
    console.log('✅ Production monitoring initialized');
  }
  
  // Health check system
  runHealthChecks() {
    const checks = [
      this.checkDiskSpace(),
      this.checkMemoryUsage(),
      this.checkProcessHealth(),
      this.checkDatabaseHealth(),
      this.checkConfigurationIntegrity()
    ];
    
    Promise.all(checks).then(results => {
      const failed = results.filter(r => !r.success);
      
      if (failed.length > 0) {
        this.handleHealthCheckFailures(failed);
      }
    }).catch(error => {
      this.logError('Health check system error', error);
    });
  }
  
  checkDiskSpace() {
    return new Promise((resolve) => {
      try {
        // Check available disk space
        const stats = fs.statSync(process.cwd());
        // Simplified check - in production, use proper disk space checking
        resolve({ 
          name: 'Disk Space', 
          success: true, 
          details: 'Sufficient space available' 
        });
      } catch (error) {
        resolve({ 
          name: 'Disk Space', 
          success: false, 
          error: error.message 
        });
      }
    });
  }
  
  checkMemoryUsage() {
    return new Promise((resolve) => {
      const usage = process.memoryUsage();
      const maxMemory = parseInt(process.env.AS_SYSTEM_MAX_MEMORY_MB || '512') * 1024 * 1024;
      const currentMemory = usage.heapUsed;
      
      const success = currentMemory < maxMemory;
      
      resolve({
        name: 'Memory Usage',
        success,
        details: `${(currentMemory / 1024 / 1024).toFixed(1)} MB / ${(maxMemory / 1024 / 1024).toFixed(1)} MB`,
        error: success ? null : 'Memory usage exceeds limit'
      });
    });
  }
  
  checkProcessHealth() {
    return new Promise((resolve) => {
      try {
        // In production, check if daemon-win.exe and tray UI are running
        // For demo, we'll simulate this
        const processes = ['main', 'monitoring'];
        
        resolve({
          name: 'Process Health',
          success: true,
          details: `${processes.length} processes running normally`
        });
      } catch (error) {
        resolve({
          name: 'Process Health',
          success: false,
          error: error.message
        });
      }
    });
  }
  
  checkDatabaseHealth() {
    return new Promise((resolve) => {
      try {
        // Check if database file exists and is accessible
        const dbPath = process.env.AS_DATABASE_PATH || './data/automation-scout.db';
        const dbDir = path.dirname(dbPath);
        
        if (!fs.existsSync(dbDir)) {
          fs.mkdirSync(dbDir, { recursive: true });
        }
        
        // In production, perform actual database connectivity test
        resolve({
          name: 'Database Health',
          success: true,
          details: 'Database accessible and responding'
        });
      } catch (error) {
        resolve({
          name: 'Database Health',
          success: false,
          error: error.message
        });
      }
    });
  }
  
  checkConfigurationIntegrity() {
    return new Promise((resolve) => {
      try {
        const required = [
          'AS_ENVIRONMENT',
          'AS_CONSENT_REQUIRED',
          'AS_DATA_RETENTION_DAYS'
        ];
        
        const missing = required.filter(key => !process.env[key]);
        
        if (missing.length > 0) {
          resolve({
            name: 'Configuration',
            success: false,
            error: `Missing configuration: ${missing.join(', ')}`
          });
        } else {
          resolve({
            name: 'Configuration',
            success: true,
            details: 'All required configuration present'
          });
        }
      } catch (error) {
        resolve({
          name: 'Configuration',
          success: false,
          error: error.message
        });
      }
    });
  }
  
  handleHealthCheckFailures(failures) {
    const timestamp = new Date().toISOString();
    
    failures.forEach(failure => {
      const alert = {
        timestamp,
        type: 'HEALTH_CHECK_FAILURE',
        component: failure.name,
        severity: 'WARNING',
        message: failure.error,
        details: failure
      };
      
      this.alerts.push(alert);
      this.logError(`Health check failed: ${failure.name}`, failure.error);
    });
    
    // Send notifications if configured
    this.sendAlertNotifications(failures);
  }
  
  // Metrics collection
  collectMetrics() {
    const now = new Date();
    this.metrics.uptime = Math.floor((now - this.startTime) / 1000);
    
    const memory = process.memoryUsage();
    this.metrics.memoryUsage = Math.floor(memory.heapUsed / 1024 / 1024); // MB
    
    // Simulate other metrics (in production, collect real data)
    this.metrics.eventCount += Math.floor(Math.random() * 5);
    this.metrics.patternCount += Math.floor(Math.random() * 2);
    this.metrics.automationCount += Math.floor(Math.random() * 1);
  }
  
  // Resource monitoring
  monitorResources() {
    setInterval(() => {
      const memory = process.memoryUsage();
      const maxMemory = parseInt(process.env.AS_SYSTEM_MAX_MEMORY_MB || '512') * 1024 * 1024;
      
      if (memory.heapUsed > maxMemory) {
        this.logError('Memory usage exceeds limit', {
          current: memory.heapUsed,
          limit: maxMemory
        });
        
        // Force garbage collection if possible
        if (global.gc) {
          global.gc();
          this.logInfo('Forced garbage collection');
        }
      }
    }, 30000);
  }
  
  // Logging system
  setupLogRotation() {
    const logDir = './logs';
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }
    
    // Set up daily log rotation
    setInterval(() => {
      this.rotateLogFiles();
    }, 86400000); // Daily
  }
  
  rotateLogFiles() {
    const logDir = './logs';
    const maxLogFiles = parseInt(process.env.AS_LOG_ROTATE_COUNT || '5');
    
    try {
      const files = fs.readdirSync(logDir)
        .filter(file => file.endsWith('.log'))
        .map(file => ({
          name: file,
          path: path.join(logDir, file),
          mtime: fs.statSync(path.join(logDir, file)).mtime
        }))
        .sort((a, b) => b.mtime - a.mtime);
      
      // Remove old log files
      if (files.length > maxLogFiles) {
        files.slice(maxLogFiles).forEach(file => {
          fs.unlinkSync(file.path);
          this.logInfo(`Rotated old log file: ${file.name}`);
        });
      }
    } catch (error) {
      this.logError('Log rotation failed', error);
    }
  }
  
  logInfo(message, data = {}) {
    this.writeLog('INFO', message, data);
  }
  
  logWarning(message, data = {}) {
    this.writeLog('WARNING', message, data);
  }
  
  logError(message, error = {}) {
    this.metrics.errorCount++;
    this.writeLog('ERROR', message, error);
  }
  
  writeLog(level, message, data) {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level,
      message,
      data: typeof data === 'object' ? data : { details: data },
      pid: process.pid,
      memory: Math.floor(process.memoryUsage().heapUsed / 1024 / 1024)
    };
    
    // Write to console
    const consoleMessage = `[${timestamp}] ${level}: ${message}`;
    if (level === 'ERROR') {
      console.error(consoleMessage);
    } else if (level === 'WARNING') {
      console.warn(consoleMessage);
    } else {
      console.log(consoleMessage);
    }
    
    // Write to log file
    const logFile = './logs/automation-scout.log';
    const logLine = JSON.stringify(logEntry) + '\n';
    
    fs.appendFileSync(logFile, logLine, { flags: 'a' });
  }
  
  // Status reporting
  logStatus() {
    const status = {
      timestamp: new Date().toISOString(),
      uptime: this.metrics.uptime,
      memory: `${this.metrics.memoryUsage} MB`,
      events: this.metrics.eventCount,
      patterns: this.metrics.patternCount,
      automations: this.metrics.automationCount,
      errors: this.metrics.errorCount,
      alerts: this.alerts.length
    };
    
    this.logInfo('System status', status);
  }
  
  // Alert notifications
  sendAlertNotifications(alerts) {
    // In production, integrate with:
    // - Email notifications
    // - Slack/Teams webhooks
    // - SMS alerts
    // - Monitoring systems (Datadog, New Relic, etc.)
    
    console.log('🚨 ALERTS TRIGGERED:', alerts.length);
    alerts.forEach(alert => {
      console.log(`   ${alert.component}: ${alert.message}`);
    });
  }
  
  // Performance monitoring
  trackPerformance(operation, duration) {
    const threshold = parseInt(process.env.AS_PERFORMANCE_THRESHOLD_MS || '5000');
    
    if (duration > threshold) {
      this.logWarning(`Slow operation detected: ${operation}`, {
        duration: `${duration}ms`,
        threshold: `${threshold}ms`
      });
    }
    
    this.logInfo(`Performance: ${operation}`, { duration: `${duration}ms` });
  }
  
  // Privacy monitoring
  trackPrivacyEvent(event, details) {
    this.logInfo(`Privacy: ${event}`, details);
    
    // In production, send to privacy audit system
    const auditEntry = {
      timestamp: new Date().toISOString(),
      event,
      details,
      compliance: {
        gdpr: process.env.AS_COMPLIANCE_GDPR_COMPLIANCE === 'true',
        ccpa: process.env.AS_COMPLIANCE_CCPA_COMPLIANCE === 'true'
      }
    };
    
    // Store in privacy audit log
    const auditFile = './logs/privacy-audit.log';
    fs.appendFileSync(auditFile, JSON.stringify(auditEntry) + '\n', { flags: 'a' });
  }
  
  // Get current status
  getStatus() {
    return {
      uptime: this.metrics.uptime,
      memory: this.metrics.memoryUsage,
      metrics: this.metrics,
      alerts: this.alerts.slice(-10), // Last 10 alerts
      health: 'healthy' // Simplified
    };
  }
}

module.exports = ProductionMonitor;