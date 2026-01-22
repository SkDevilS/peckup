#!/bin/bash

# Peckup Deployment Script for Hostinger VPS
# This script automates the deployment process

set -e  # Exit on error

echo "🚀 Starting Peckup Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
PROJECT_DIR="/var/www/peckup/peckup"
BACKEND_DIR="$PROJECT_DIR/backend"
VENV_DIR="$BACKEND_DIR/venv"

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

# Check if running as root or with sudo
if [ "$EUID" -ne 0 ]; then 
    print_error "Please run with sudo"
    exit 1
fi

# Navigate to project directory
cd $PROJECT_DIR || exit 1
print_success "Changed to project directory"

# Pull latest changes from git
print_info "Pulling latest changes from repository..."
git pull origin main || print_error "Git pull failed (continuing anyway)"
print_success "Repository updated"

# Update Backend
print_info "Updating backend..."
cd $BACKEND_DIR

# Activate virtual environment
source $VENV_DIR/bin/activate
print_success "Virtual environment activated"

# Install/update Python dependencies
print_info "Installing Python dependencies..."
pip install -r requirements.txt --quiet
print_success "Python dependencies updated"

# Run database migrations if needed
if [ -f "init_db.py" ]; then
    print_info "Running database migrations..."
    python init_db.py
    print_success "Database migrations completed"
fi

# Deactivate virtual environment
deactivate

# Update Frontend
print_info "Updating frontend..."
cd $PROJECT_DIR

# Install/update Node dependencies
print_info "Installing Node dependencies..."
npm install --silent
print_success "Node dependencies updated"

# Build frontend
print_info "Building frontend..."
npm run build
print_success "Frontend built successfully"

# Set proper permissions
print_info "Setting proper permissions..."
chown -R www-data:www-data $PROJECT_DIR
chown -R www-data:www-data $BACKEND_DIR/uploads
chmod -R 755 $PROJECT_DIR
chmod -R 775 $BACKEND_DIR/uploads
print_success "Permissions set"

# Restart services
print_info "Restarting services..."

# Restart backend service
systemctl restart peckup-backend
if systemctl is-active --quiet peckup-backend; then
    print_success "Backend service restarted"
else
    print_error "Backend service failed to start"
    systemctl status peckup-backend
    exit 1
fi

# Restart Nginx
systemctl restart nginx
if systemctl is-active --quiet nginx; then
    print_success "Nginx restarted"
else
    print_error "Nginx failed to start"
    systemctl status nginx
    exit 1
fi

# Clear cache if needed
print_info "Clearing cache..."
sync
echo 3 > /proc/sys/vm/drop_caches 2>/dev/null || true
print_success "Cache cleared"

# Display service status
echo ""
print_info "Service Status:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
systemctl status peckup-backend --no-pager -l | head -n 5
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
systemctl status nginx --no-pager -l | head -n 5
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Display URLs
echo ""
print_success "Deployment completed successfully!"
echo ""
echo "🌐 Your application is now live at:"
echo "   Main Site:  https://peckup.in"
echo "   Admin:      https://admin.peckup.in"
echo "   API:        https://api.peckup.in"
echo ""
echo "📊 To monitor logs:"
echo "   Backend:    sudo journalctl -u peckup-backend -f"
echo "   Nginx:      sudo tail -f /var/log/nginx/error.log"
echo ""
