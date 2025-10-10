# 🤖 Automation Scout

**A privacy-first desktop widget that detects repeatable workflows and proposes AI tool orchestrations.**

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Platform](https://img.shields.io/badge/platform-Windows-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.4-blue.svg)
![Rust](https://img.shields.io/badge/Rust-1.70+-orange.svg)

Automation Scout runs quietly in the background, observing your computer usage patterns with explicit consent and suggesting intelligent automations to save you time. All processing happens locally on your device to protect your privacy.

## 🎯 Key Features

- **🔒 Privacy-First**: Explicit opt-in consent, local-only processing, transparent data usage
- **🧠 Smart Pattern Detection**: Uses PrefixSpan algorithm to identify repetitive workflows  
- **⚡ Multiple Automation Types**: PowerShell scripts, REST APIs, browser actions, file operations
- **🛡️ Safety Guards**: Dry-run mode, confirmations, rollback capabilities, permission scoping
- **📊 Transparent Reporting**: Daily summaries of data collected and privacy protections applied
- **🎛️ Granular Controls**: Per-app monitoring, redaction levels, data retention policies

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Automation Scout                        │
├─────────────────────────┬───────────────────────────────────┤
│       Tray UI           │         Background Daemon         │
│   (Tauri + TypeScript)  │        (Rust + Win32 APIs)       │
│                         │                                   │
│  • Suggestions Panel    │  • Window Focus Capture          │
│  • Privacy Controls     │  • Clipboard Type Monitoring     │
│  • Automation Manager   │  • File System Watcher          │
│  • Settings & Consent   │  • Privacy-Preserving Hashing   │
└─────────────────────────┼───────────────────────────────────┤
                          │                                   │
┌─────────────────────────┼───────────────────────────────────┐
│           Shared TypeScript Packages                       │
├─────────────────────────┴───────────────────────────────────┤
│  📊 Pattern Miner    │  🗄️ Storage Layer   │ 🔒 Privacy Guard │
│  • PrefixSpan Algo   │  • SQLite + Crypto │ • Consent Mgmt   │
│  • Sequence Mining   │  • Event Storage   │ • Data Redaction │
│  • Confidence Calc   │  • Pattern Cache   │ • Audit Logging  │
├──────────────────────┼──────────────────────┼──────────────────┤
│  🚀 Automation Runtime                   │  🔗 LLM Provider   │
│  • PowerShell Executor                  │  • OpenAI/Anthropic│
│  • HTTP Client + Playwright             │  • Rate Limiting   │
│  • Dry-run + Safety Guards              │  • Token Management│
└─────────────────────────────────────────┴──────────────────┘
```

## 🚀 Quick Start

### Prerequisites

- Windows 10/11 (primary target)
- Node.js 18+ and pnpm 8+  
- Rust 1.70+ (for daemon compilation)
- PowerShell 5.1+ (for script execution)

### Installation & Setup

1. **Clone the repository**:
   ```powershell
   git clone https://github.com/your-org/automation-scout.git
   cd automation-scout
   ```

2. **Install dependencies**:
   ```powershell
   pnpm install
   ```

3. **Build all packages**:
   ```powershell
   pnpm build
   ```

4. **Start development servers**:
   ```powershell
   # Terminal 1: Start the daemon
   pnpm daemon:dev

   # Terminal 2: Start the tray UI  
   pnpm tray:dev
   ```

5. **Complete onboarding**: 
   - Click the tray icon to open Automation Scout
   - Follow the privacy-first onboarding process
   - Grant explicit consent for monitoring

## 📋 Project Structure

```
automation-scout/
├── apps/
│   ├── daemon-win/          # Rust daemon for Windows event capture
│   │   ├── src/
│   │   │   ├── main.rs      # Main daemon entry point
│   │   │   ├── event_capture.rs  # Windows API integration
│   │   │   ├── privacy_guard.rs  # Privacy filtering  
│   │   │   └── storage.rs   # SQLite data layer
│   │   └── Cargo.toml
│   └── tray-ui/             # Tauri-based tray application
│       ├── src/             # TypeScript frontend
│       ├── src-tauri/       # Rust backend for UI
│       └── package.json
├── packages/
│   ├── storage/             # SQLite abstraction layer
│   ├── pattern-miner/       # PrefixSpan algorithm implementation
│   ├── automation-runtime/  # Execution engine  
│   ├── privacy-guard/       # Consent & redaction management
│   └── llm-provider/        # AI service integrations
├── scripts/
│   └── demo.js             # End-to-end demonstration
└── docs/
    ├── ARCHITECTURE.md     # Detailed technical design
    ├── PRIVACY.md         # Privacy model & compliance
    └── API.md             # Package APIs & interfaces
```

## 🔒 Privacy & Security Model

### Core Principles

1. **Explicit Consent**: No data collection without clear user approval
2. **Local-First**: All processing on your device, no cloud dependencies
3. **Transparent**: Daily reports of what was collected and how it was protected
4. **Minimal Data**: Only capture what's needed for pattern detection
5. **User Control**: Easy pause, exclude apps, or delete everything

### Data Collection & Protection

| Data Type | Collection Method | Default Privacy Level |
|-----------|------------------|---------------------|
| Window Focus | Win32 GetForegroundWindow | App name + hashed title |
| File Operations | File system watcher | Extension only (.xlsx, .pdf) |
| Clipboard | Type detection only | No content, just data type |
| URL Navigation | Browser accessibility API | Domain only, no paths/params |
| Keyboard/Mouse | Event categories | No raw input, just action types |

### Redaction Levels

- **Low**: Store most data with basic sensitive info filtered
- **Medium**: Redact obvious PII, keep workflow patterns  
- **High** (Default): Heavy redaction, pattern detection only
- **Paranoid**: Maximum privacy, minimal data retention

### Excluded Apps (Default)

Password managers, authenticators, banking apps, and other sensitive applications are automatically excluded from monitoring.

## 🧠 Pattern Mining

Automation Scout uses a **simplified PrefixSpan algorithm** to detect frequent sequential patterns in your daily workflows:

1. **Session Grouping**: Events within 4-hour windows with similar app contexts
2. **Sequence Normalization**: Convert raw events to semantic actions (e.g., "copy_data", "switch_app", "paste_data")  
3. **Frequent Pattern Mining**: Find sequences occurring 3+ times with configurable support thresholds
4. **Confidence Scoring**: Rate patterns by frequency, consistency, and time savings potential
5. **Natural Language Naming**: Generate human-readable descriptions using pattern context

### Example Detected Patterns

```yaml
# Excel → Email Report Workflow
Pattern: "Excel Data Export"
Sequence: 
  - open_file(*.xlsx) 
  - select_data
  - copy_to_clipboard  
  - focus_app(outlook.exe)
  - paste_in_email
  - send_email
Confidence: 85%
Frequency: 3x/week  
Time Saved: ~15 min/week
```

## 🚀 Automation Runtime

The execution engine supports multiple step types with built-in safety guards:

### Supported Step Types

1. **PowerShell Scripts**: Execute local automation scripts with timeout protection
2. **HTTP Requests**: Call REST APIs with authentication and retry logic
3. **Browser Actions**: Playwright-based web automation (click, type, screenshot)
4. **File Operations**: Copy, move, rename files with permission checks
5. **Confirmations**: User approval gates for destructive operations
6. **Delays**: Timing controls between steps

### Safety Features

- **Dry-Run Mode**: Preview all actions before execution
- **Permission Scoping**: Limit access to specific directories/URLs
- **Rollback Support**: Undo file operations and API calls where possible
- **Timeout Protection**: Kill runaway processes automatically
- **User Confirmations**: Prompt before destructive or high-risk actions

### Example Automation

```yaml
name: "Weekly Report Generation"
trigger: 
  type: "schedule"
  cron: "0 9 * * MON"  # Every Monday 9 AM
steps:
  - type: "powershell"
    script: "Get-ChildItem C:\\Reports\\*.xlsx | Sort-Object LastWriteTime -Desc | Select-Object -First 1"
    timeout: 30
  - type: "http_request" 
    url: "https://api.company.com/reports"
    method: "POST"
    headers: {"Authorization": "Bearer ${API_TOKEN}"}
  - type: "confirmation"
    message: "Send weekly report email to team?"
  - type: "browser_action"
    action: "navigate"
    url: "https://outlook.office.com"
permissions: ["FileSystem:C:\\Reports", "Network:api.company.com", "Browser:outlook.office.com"]
risk_score: 3  # Low risk
```

## 🛠️ Development

### Building Individual Components

```powershell
# Build daemon only
cd apps/daemon-win && cargo build --release

# Build tray UI only  
cd apps/tray-ui && pnpm tauri build

# Build TypeScript packages
pnpm --filter @automation-scout/pattern-miner build
```

### Configuration Management

Automation Scout uses a centralized configuration system that supports environment variables, type safety, and validation:

```bash
# Copy environment template
cp .env.example .env

# Set key configuration variables
AS_ENVIRONMENT=production
AS_CONSENT_REQUIRED=true
AS_DATA_RETENTION_DAYS=90
AS_LLM_ENABLED=true
AS_LLM_API_KEY=your-api-key
```

Configuration sections include:
- **Privacy & Security**: Data retention, encryption, consent management
- **LLM Integration**: OpenAI/Anthropic API settings, local models
- **Pattern Mining**: Detection thresholds, analysis intervals
- **Automation Runtime**: Safety controls, job limits, domain restrictions
- **Windows Integration**: System tray, startup behavior, capture settings

See `packages/config/README.md` for complete configuration reference.

### Running Tests

```powershell
# Run all tests
pnpm test

# Test pattern mining with synthetic data
pnpm --filter @automation-scout/pattern-miner test

# Test automation runtime
pnpm --filter @automation-scout/automation-runtime test

# Test configuration system
pnpm --filter @automation-scout/config test
```

### Code Signing (Production)

For production releases, sign the executables:

```powershell
# Sign Rust daemon (Windows)
signtool sign /f certificate.pfx /p password /t http://timestamp.sectigo.com apps/daemon-win/target/release/daemon.exe

# Sign Tauri app bundle
pnpm tauri build --config src-tauri/tauri.production.conf.json
```

## 📊 Demo & Testing

Run the end-to-end demo to see pattern detection and automation in action:

```powershell
# Generate synthetic activity data
node scripts/demo.js --generate-data

# Mine patterns from demo data  
node scripts/demo.js --mine-patterns

# Execute sample automation
node scripts/demo.js --run-automation
```

### Demo Scenarios

1. **Email Report Workflow**: Excel → Copy → Chrome → Compose Email → Send
2. **File Organization**: Downloads → Filter by Type → Move to Folders  
3. **Data Entry Routine**: Web Form → Fill Fields → Submit → Next Record

## 🔧 Configuration

### Environment Variables

```env
# Optional: LLM API keys for automation generation
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=ant-...

# Database path (default: user home directory)
AUTOMATION_SCOUT_DB_PATH=C:\\Users\\%USERNAME%\\.automation-scout\\data.db

# Log level for daemon
RUST_LOG=info

# Development mode
NODE_ENV=development
```

### Privacy Configuration

Edit `%APPDATA%\\automation-scout\\config.json`:

```json
{
  "privacy": {
    "redactionLevel": "high",
    "dataRetentionDays": 30,
    "excludedApps": ["keepass", "1password"],
    "allowNetworkSharing": false
  },
  "patterns": {
    "minSupport": 3,
    "minConfidence": 0.6,
    "maxSequenceLength": 10
  },
  "automation": {
    "requireConfirmation": true,
    "allowFileOperations": true,
    "allowNetworkRequests": false
  }
}
```

## 🚨 Risk Assessment & Mitigations

| Risk Category | Risk | Mitigation |
|---------------|------|------------|
| **Privacy** | Sensitive data capture | Redaction levels, app exclusions, local-only processing |
| **Security** | Malicious automation | Dry-run mode, permission scoping, user confirmations |
| **Reliability** | System impact | CPU/memory limits, graceful degradation, easy disable |
| **Data Loss** | Accidental deletion | Confirmation prompts, audit logs, export capabilities |

## 📜 License & Compliance

- **License**: MIT  
- **Privacy Compliance**: GDPR-ready with data export and deletion
- **Windows Compatibility**: Tested on Windows 10 (1909+) and Windows 11
- **Code Signing**: Required for production deployment

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)  
3. Run tests (`pnpm test`)
4. Commit changes (`git commit -m 'Add amazing feature'`)
5. Push to branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

### Code Style

- **TypeScript**: ESLint + Prettier with strict type checking
- **Rust**: Standard rustfmt + clippy linting
- **Commit Messages**: Conventional Commits format

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/your-org/automation-scout/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-org/automation-scout/discussions)  
- **Security**: security@automation-scout.com

---

**⚠️ Early Development Notice**: This is an MVP implementation. Production use requires additional security hardening, comprehensive testing, and code signing certificates.