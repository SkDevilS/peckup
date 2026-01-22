#!/bin/bash

# Peckup Restore Script
# This script restores database and uploads from backup

# Configuration
BACKUP_DIR="/var/backups/peckup"

# Database credentials (update these)
DB_NAME="peckup_db"
DB_USER="peckup_user"
DB_PASSWORD="YOUR_DATABASE_PASSWORD_HERE"

# Directories
UPLOADS_DIR="/var/www/peckup/peckup/backend/uploads"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_info() {
    echo -e "${YELLOW}ℹ $1${NC}"
}

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    print_error "Please run with sudo"
    exit 1
fi

# List available backups
print_info "Available database backups:"
ls -lh $BACKUP_DIR/db_backup_*.sql.gz 2>/dev/null || echo "No database backups found"

echo ""
print_info "Available uploads backups:"
ls -lh $BACKUP_DIR/uploads_backup_*.tar.gz 2>/dev/null || echo "No uploads backups found"

echo ""
read -p "Enter the date/time of the backup to restore (format: YYYYMMDD_HHMMSS): " BACKUP_DATE

# Validate backup files exist
DB_BACKUP="$BACKUP_DIR/db_backup_$BACKUP_DATE.sql.gz"
UPLOADS_BACKUP="$BACKUP_DIR/uploads_backup_$BACKUP_DATE.tar.gz"

if [ ! -f "$DB_BACKUP" ]; then
    print_error "Database backup not found: $DB_BACKUP"
    exit 1
fi

if [ ! -f "$UPLOADS_BACKUP" ]; then
    print_error "Uploads backup not found: $UPLOADS_BACKUP"
    exit 1
fi

# Confirm restoration
echo ""
print_info "This will restore:"
print_info "  Database: $DB_BACKUP"
print_info "  Uploads:  $UPLOADS_BACKUP"
echo ""
read -p "Are you sure you want to continue? This will overwrite current data! (yes/no): " CONFIRM

if [ "$CONFIRM" != "yes" ]; then
    print_info "Restoration cancelled"
    exit 0
fi

# Stop backend service
print_info "Stopping backend service..."
systemctl stop peckup-backend
print_success "Backend service stopped"

# Restore database
print_info "Restoring database..."
if gunzip < $DB_BACKUP | mysql -u $DB_USER -p"$DB_PASSWORD" $DB_NAME; then
    print_success "Database restored successfully"
else
    print_error "Database restoration failed"
    systemctl start peckup-backend
    exit 1
fi

# Backup current uploads (just in case)
print_info "Backing up current uploads..."
TEMP_BACKUP="/tmp/uploads_backup_before_restore_$(date +%Y%m%d_%H%M%S).tar.gz"
tar -czf $TEMP_BACKUP -C $(dirname $UPLOADS_DIR) $(basename $UPLOADS_DIR)
print_success "Current uploads backed up to: $TEMP_BACKUP"

# Restore uploads
print_info "Restoring uploads..."
rm -rf $UPLOADS_DIR
if tar -xzf $UPLOADS_BACKUP -C $(dirname $UPLOADS_DIR); then
    print_success "Uploads restored successfully"
else
    print_error "Uploads restoration failed"
    # Restore from temp backup
    tar -xzf $TEMP_BACKUP -C $(dirname $UPLOADS_DIR)
    print_info "Restored previous uploads from temporary backup"
fi

# Set proper permissions
print_info "Setting proper permissions..."
chown -R www-data:www-data $UPLOADS_DIR
chmod -R 775 $UPLOADS_DIR
print_success "Permissions set"

# Start backend service
print_info "Starting backend service..."
systemctl start peckup-backend
if systemctl is-active --quiet peckup-backend; then
    print_success "Backend service started"
else
    print_error "Backend service failed to start"
    systemctl status peckup-backend
    exit 1
fi

print_success "Restoration completed successfully!"
print_info "Temporary backup of previous uploads: $TEMP_BACKUP"
