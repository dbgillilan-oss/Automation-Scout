#!/bin/bash
# Automation Scout - macOS Installation Script
# Professional macOS installer with Node.js detection and dependency management
# Run with: bash install.sh

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
APP_NAME="Automation Scout"
VERSION="1.0.0"
INSTALL_DIR="/Applications/AutomationScout"
CURRENT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo -e "${BLUE}🚀 ${APP_NAME} macOS Installer v${VERSION}${NC}"
echo "=============================================="
echo ""

# Check if running on macOS
if [[ "$OSTYPE" != "darwin"* ]]; then
    echo -e "${RED}❌ This installer is for macOS only${NC}"
    echo "For Windows, use install.bat or install-enhanced.bat"
    echo "For universal installer, use: node install.js"
    exit 1
fi

# Function to print status
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check for administrator privileges
check_privileges() {
    echo "🔐 Checking system privileges..."
    
    if [[ $EUID -eq 0 ]]; then
        print_warning "Running as root - this may not be necessary"
    fi
    
    # Test write access to /Applications
    if [[ ! -w "/Applications" ]]; then
        print_error "No write access to /Applications directory"
        echo "Please run with sudo: sudo bash install.sh"
        exit 1
    fi
    
    print_status "Privileges verified"
}

# Check Node.js installation
check_nodejs() {
    echo "📦 Checking Node.js installation..."
    
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed"
        echo ""
        echo "Please install Node.js first:"
        echo "1. Visit: https://nodejs.org/"
        echo "2. Download the macOS installer"
        echo "3. Or use Homebrew: brew install node"
        exit 1
    fi
    
    NODE_VERSION=$(node --version)
    print_status "Node.js found: $NODE_VERSION"
    
    if ! command -v npm &> /dev/null; then
        print_error "npm is not available"
        exit 1
    fi
    
    NPM_VERSION=$(npm --version)
    print_status "npm found: $NPM_VERSION"
}

# Create installation directory
create_install_dir() {
    echo "📁 Setting up installation directory..."
    
    # Remove existing installation if it exists
    if [[ -d "$INSTALL_DIR" ]]; then
        print_warning "Existing installation found, backing up..."
        BACKUP_DIR="${INSTALL_DIR}.backup.$(date +%Y%m%d_%H%M%S)"
        mv "$INSTALL_DIR" "$BACKUP_DIR"
        print_status "Backup created: $BACKUP_DIR"
    fi
    
    # Create installation directory
    mkdir -p "$INSTALL_DIR"
    print_status "Installation directory created: $INSTALL_DIR"
}

# Copy application files
copy_files() {
    echo "📄 Copying application files..."
    
    # Copy all files from current directory to install directory
    rsync -av --exclude='.git' --exclude='node_modules' --exclude='install.sh' \
        "$CURRENT_DIR/" "$INSTALL_DIR/"
    
    # Ensure executable permissions
    chmod +x "$INSTALL_DIR/install.js" 2>/dev/null || true
    
    print_status "Files copied successfully"
}

# Install Node.js dependencies
install_dependencies() {
    echo "📦 Installing Node.js dependencies..."
    
    cd "$INSTALL_DIR"
    
    # Clean install
    if [[ -d "node_modules" ]]; then
        rm -rf node_modules
    fi
    
    if [[ -f "package-lock.json" ]]; then
        rm -f package-lock.json
    fi
    
    # Install with production dependencies only
    npm install --production --no-audit --no-fund
    
    print_status "Dependencies installed"
}

# Create system integration
create_system_integration() {
    echo "🖥️  Setting up macOS integration..."
    
    # Create launch script
    cat > "$INSTALL_DIR/launch.sh" << 'EOF'
#!/bin/bash
cd "$(dirname "$0")"
node index.js
EOF
    chmod +x "$INSTALL_DIR/launch.sh"
    
    # Create symlink for command line access (optional)
    SYMLINK_PATH="/usr/local/bin/automation-scout"
    if [[ -w "/usr/local/bin" ]]; then
        ln -sf "$INSTALL_DIR/launch.sh" "$SYMLINK_PATH" 2>/dev/null || true
        if [[ -L "$SYMLINK_PATH" ]]; then
            print_status "Command line access: automation-scout"
        fi
    fi
    
    print_status "macOS integration configured"
}

# Verify installation
verify_installation() {
    echo "🔍 Verifying installation..."
    
    cd "$INSTALL_DIR"
    
    # Check if main file exists
    if [[ ! -f "index.js" ]]; then
        print_error "Main application file missing"
        exit 1
    fi
    
    # Check if package.json exists
    if [[ ! -f "package.json" ]]; then
        print_error "Package configuration missing"
        exit 1
    fi
    
    # Test node execution (quick test)
    if ! node -e "console.log('Node.js test successful')" &> /dev/null; then
        print_error "Node.js execution test failed"
        exit 1
    fi
    
    print_status "Installation verified"
}

# Create .env file if it doesn't exist
create_env_file() {
    echo "⚙️  Setting up configuration..."
    
    cd "$INSTALL_DIR"
    
    if [[ ! -f ".env" ]]; then
        cat > ".env" << EOF
# Automation Scout Configuration
AS_ENVIRONMENT=production
AS_CLIENT_COMPANY_NAME=Client Company
AS_CONSENT_REQUIRED=true
AS_DATA_RETENTION_DAYS=90
AS_ENCRYPTION_ENABLED=true
AS_AUDIT_LOG_ENABLED=true
AS_LOG_LEVEL=info
EOF
        print_status "Configuration file created"
    else
        print_status "Configuration file already exists"
    fi
}

# Main installation process
main() {
    echo "Starting installation process..."
    echo ""
    
    check_privileges
    check_nodejs
    create_install_dir
    copy_files
    install_dependencies
    create_env_file
    create_system_integration
    verify_installation
    
    echo ""
    echo -e "${GREEN}🎉 Installation completed successfully!${NC}"
    echo ""
    echo "📍 Installation location: $INSTALL_DIR"
    echo ""
    echo "🚀 To start Automation Scout:"
    echo "   cd '$INSTALL_DIR'"
    echo "   npm start"
    echo ""
    echo "Or from anywhere (if symlink was created):"
    echo "   automation-scout"
    echo ""
    echo "📖 Documentation: Check the docs/ folder in the installation directory"
    echo "🆘 Support: Review INSTALLATION-TROUBLESHOOTING.md for common issues"
    echo ""
    echo -e "${BLUE}${APP_NAME} is ready for use!${NC}"
}

# Run installation
main "$@"