#!/bin/bash

# Peckup Server Setup Script for Hostinger VPS Ubuntu
# Run this script on a fresh Ubuntu VPS to set up everything

set -e  # Exit on error

echo "🚀 Peckup Server Setup Script"
echo "=============================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_info() {
    echo -e "${YELLOW}ℹ $1${NC}"
}

print_step() {
    echo -e "${BLUE}▶ $1${NC}"
}

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    print_error "Please run as root or with sudo"
    exit 1
fi

# Get user input for configuration
print_step "Configuration Setup"
echo ""
read -p "Enter MySQL root password: " -s MYSQL_ROOT_PASSWORD
echo ""
read -p "Enter MySQL database name [peckup_db]: " DB_NAME
DB_NAME=${DB_NAME:-peckup_db}
read -p "Enter MySQL username [peckup_user]: " DB_USER
DB_USER=${DB_USER:-peckup_user}
read -p "Enter MySQL user password: " -s DB_PASSWORD
echo ""
read -p "Enter your VPS IP address: " VPS_IP
echo ""

print_info "Configuration saved. Starting installation..."
sleep 2

# Update system
print_step "Step 1: Updating system packages"
apt update && apt upgrade -y
print_success "System updated"

# Install essential tools
print_step "Step 2: Installing essential tools"
apt install -y git curl wget vim ufw software-properties-common
print_success "Essential tools installed"

# Install Node.js 18
print_step "Step 3: Installing Node.js 18"
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs
print_success "Node.js $(node --version) installed"

# Install Python 3 and pip
print_step "Step 4: Installing Python 3"
apt install -y python3 python3-pip python3-venv python3-dev build-essential
print_success "Python $(python3 --version) installed"

# Install Nginx
print_step "Step 5: Installing Nginx"
apt install -y nginx
systemctl start nginx
systemctl enable nginx
print_success "Nginx installed and started"

# Install MySQL
print_step "Step 6: Installing MySQL"
export DEBIAN_FRONTEND=noninteractive
apt install -y mysql-server
systemctl start mysql
systemctl enable mysql
print_success "MySQL installed and started"

# Secure MySQL installation
print_step "Step 7: Configuring MySQL"
mysql -e "ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '$MYSQL_ROOT_PASSWORD';"
mysql -e "DELETE FROM mysql.user WHERE User='';"
mysql -e "DELETE FROM mysql.user WHERE User='root' AND Host NOT IN ('localhost', '127.0.0.1', '::1');"
mysql -e "DROP DATABASE IF EXISTS test;"
mysql -e "DELETE FROM mysql.db WHERE Db='test' OR Db='test\\_%';"
mysql -e "FLUSH PRIVILEGES;"
print_success "MySQL secured"

# Create database and user
print_step "Step 8: Creating database and user"
mysql -u root -p"$MYSQL_ROOT_PASSWORD" <<EOF
CREATE DATABASE IF NOT EXISTS $DB_NAME CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS '$DB_USER'@'localhost' IDENTIFIED BY '$DB_PASSWORD';
GRANT ALL PRIVILEGES ON $DB_NAME.* TO '$DB_USER'@'localhost';
FLUSH PRIVILEGES;
EOF
print_success "Database '$DB_NAME' and user '$DB_USER' created"

# Install Certbot for SSL
print_step "Step 9: Installing Certbot for SSL"
apt install -y certbot python3-certbot-nginx
print_success "Certbot installed"

# Create project directory
print_step "Step 10: Creating project directory"
mkdir -p /var/www/peckup
chown -R $USER:$USER /var/www/peckup
print_success "Project directory created at /var/www/peckup"

# Create log directory
print_step "Step 11: Creating log directory"
mkdir -p /var/log/peckup
chown -R www-data:www-data /var/log/peckup
print_success "Log directory created"

# Configure firewall
print_step "Step 12: Configuring firewall"
ufw --force enable
ufw allow OpenSSH
ufw allow 'Nginx Full'
print_success "Firewall configured"

# Install fail2ban for security
print_step "Step 13: Installing fail2ban"
apt install -y fail2ban
systemctl start fail2ban
systemctl enable fail2ban
print_success "Fail2ban installed"

# Create environment file template
print_step "Step 14: Creating environment file template"
cat > /var/www/peckup/.env.template <<EOF
# Flask Configuration
FLASK_APP=app.py
FLASK_ENV=production
SECRET_KEY=$(openssl rand -hex 32)
JWT_SECRET_KEY=$(openssl rand -hex 32)

# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=$DB_NAME
DB_USER=$DB_USER
DB_PASSWORD=$DB_PASSWORD

# Upload Configuration
UPLOAD_FOLDER=uploads
MAX_CONTENT_LENGTH=16777216

# CORS Configuration
CORS_ORIGINS=https://peckup.in,https://admin.peckup.in
EOF
print_success "Environment template created"

# Display DNS configuration
print_step "Step 15: DNS Configuration Required"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Please configure the following DNS records in Hostinger:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Type    Name    Value           TTL"
echo "────────────────────────────────────────────────────────────"
echo "A       @       $VPS_IP         14400"
echo "A       www     $VPS_IP         14400"
echo "A       admin   $VPS_IP         14400"
echo "A       api     $VPS_IP         14400"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Summary
echo ""
print_success "Server setup completed successfully!"
echo ""
echo "📋 Summary:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✓ System packages updated"
echo "✓ Node.js $(node --version) installed"
echo "✓ Python $(python3 --version | cut -d' ' -f2) installed"
echo "✓ Nginx installed and running"
echo "✓ MySQL installed and configured"
echo "✓ Database '$DB_NAME' created"
echo "✓ Certbot installed for SSL"
echo "✓ Firewall configured"
echo "✓ Fail2ban installed"
echo "✓ Project directory: /var/www/peckup"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📝 Next Steps:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "1. Configure DNS records in Hostinger (see above)"
echo "2. Upload your project files to /var/www/peckup/peckup"
echo "3. Copy .env.template to backend/.env and configure"
echo "4. Follow HOSTINGER_DEPLOYMENT.md for remaining steps"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "🔐 Important Information (Save this!):"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "MySQL Root Password: [HIDDEN]"
echo "Database Name: $DB_NAME"
echo "Database User: $DB_USER"
echo "Database Password: [HIDDEN]"
echo "Environment template: /var/www/peckup/.env.template"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
