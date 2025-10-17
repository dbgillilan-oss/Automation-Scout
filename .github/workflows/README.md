# AutomationScout GitHub Actions Configuration

This directory contains GitHub Actions workflows for the AutomationScout project, providing comprehensive CI/CD, security scanning, and integration testing.

## Workflows Overview

### 1. `ci-cd.yml` - Main CI/CD Pipeline
**Triggers:** Push to main/develop, Pull requests, Manual dispatch

**Jobs:**
- **Security Audit** - Vulnerability scanning and dependency checks
- **Build Admin Portal** - Validates and tests admin portal components
- **Build Widget** - Builds Windows widget components
- **Integration Tests** - End-to-end API and widget communication tests
- **Code Quality** - ESLint, Prettier, and bundle analysis
- **Documentation** - Validates README and documentation links
- **Deployment Prep** - Creates deployment artifacts for releases
- **Release** - Automated GitHub releases on version tags

### 2. `security.yml` - Security Scanning
**Triggers:** Weekly schedule, Manual dispatch, Dependency changes

**Features:**
- NPM audit scanning
- CodeQL static analysis
- Sensitive file detection
- License compliance checking
- Secrets detection with TruffleHog

### 3. `widget-integration-test.yml` - Widget Testing
**Triggers:** Every 6 hours, Manual dispatch

**Tests:**
- Widget registration flow
- Heartbeat communication
- Workflow data submission
- Client management APIs
- Dashboard data integrity
- Performance metrics
- Complete widget lifecycle

## Security Features

### Automated Security Scanning
- **Dependency Vulnerabilities** - Regular npm audit checks
- **Code Analysis** - GitHub CodeQL for static security analysis
- **Secrets Detection** - TruffleHog scans for leaked credentials
- **License Compliance** - Validates all dependency licenses

### Configuration Files
- `.audit-ci.json` - NPM audit configuration
- Vulnerability thresholds and allowlists
- Security reporting settings

## Performance & Quality

### Code Quality Checks
- **ESLint** - JavaScript linting and code standards
- **Prettier** - Code formatting validation
- **Bundle Analysis** - Monitors file sizes and dependencies

### Performance Monitoring
- API response time testing
- System health validation
- Resource usage metrics
- Automated performance reports

## Deployment Automation

### Artifact Management
- Automated deployment package creation
- Version tagging and release notes
- Cross-platform build artifacts
- Production-ready distributions

### Release Process
1. **Development** - Commits trigger full CI pipeline
2. **Testing** - Comprehensive integration and security tests
3. **Staging** - Manual deployment approval for staging environment
4. **Production** - Automated releases on version tags

## Monitoring & Notifications

### Build Status
- Real-time build status reporting
- Failure notifications and diagnostics
- Performance trend monitoring
- Security alert integration

### Test Reporting
- Integration test reports
- Security scan summaries
- Performance metrics dashboard
- Deployment status tracking

## Configuration Benefits

### For Development Team
- **Early Detection** - Catches issues before merge
- **Quality Assurance** - Automated code quality checks
- **Security** - Continuous vulnerability monitoring
- **Documentation** - Ensures docs stay current

### For Production
- **Reliability** - Tested deployments reduce downtime
- **Security** - Regular security scans and updates
- **Performance** - Monitored system performance
- **Compliance** - Automated license and security compliance

### For Client Installations
- **Stability** - Well-tested widget releases
- **Security** - Verified secure code distribution
- **Updates** - Automated update mechanisms
- **Support** - Comprehensive test coverage

## Usage

### Manual Workflow Triggers
```bash
# Trigger security scan
gh workflow run security.yml

# Run integration tests
gh workflow run widget-integration-test.yml --field test_environment=staging

# Manual CI/CD run
gh workflow run ci-cd.yml
```

### Creating Releases
```bash
# Tag version for automatic release
git tag v1.2.0
git push origin v1.2.0
# Triggers automatic release workflow
```

### Monitoring
- Check Actions tab in GitHub repository
- Review security alerts in Security tab
- Monitor performance in workflow run logs
- Download test reports from workflow artifacts

This comprehensive GitHub Actions setup ensures AutomationScout maintains high quality, security, and reliability standards while automating the entire development and deployment lifecycle.