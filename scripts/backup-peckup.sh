#!/bin/bash

# Peckup Backup Script
# This script backs up the database and uploaded files

# Configuration
BACKUP_DIR="/var/backups/peckup"
DATE=$(date +%Y%m%d_%H%M%S)
RETENTION_DAYS=7

# Database credentials (update these)
DB_NAME="peckup_db"
DB_USER="peckup_user"
DB_PASSWORD="YOUR_DATABASE_PASSWORD_HERE"

# Directories to backup
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

# Create backup directory if it doesn't exist
mkdir -p $BACKUP_DIR

print_info "Starting backup process..."

# Backup database
print_info "Backing up database..."
if mysqldump -u $DB_USER -p"$DB_PASSWORD" $DB_NAME | gzip > $BACKUP_DIR/db_backup_$DATE.sql.gz; then
    print_success "Database backup completed: db_backup_$DATE.sql.gz"
else
    print_error "Database backup failed"
    exit 1
fi

# Backup uploads directory
print_info "Backing up uploads directory..."
if tar -czf $BACKUP_DIR/uploads_backup_$DATE.tar.gz -C $(dirname $UPLOADS_DIR) $(basename $UPLOADS_DIR); then
    print_success "Uploads backup completed: uploads_backup_$DATE.tar.gz"
else
    print_error "Uploads backup failed"
    exit 1
fi

# Calculate backup sizes
DB_SIZE=$(du -h $BACKUP_DIR/db_backup_$DATE.sql.gz | cut -f1)
UPLOADS_SIZE=$(du -h $BACKUP_DIR/uploads_backup_$DATE.tar.gz | cut -f1)

print_info "Backup sizes: Database=$DB_SIZE, Uploads=$UPLOADS_SIZE"

# Remove old backups
print_info "Removing backups older than $RETENTION_DAYS days..."
find $BACKUP_DIR -name "*.gz" -mtime +$RETENTION_DAYS -delete
find $BACKUP_DIR -name "*.tar.gz" -mtime +$RETENTION_DAYS -delete
print_success "Old backups removed"

# List current backups
BACKUP_COUNT=$(ls -1 $BACKUP_DIR | wc -l)
TOTAL_SIZE=$(du -sh $BACKUP_DIR | cut -f1)

print_success "Backup completed successfully!"
print_info "Total backups: $BACKUP_COUNT files, Total size: $TOTAL_SIZE"

# Log backup completion
echo "$(date): Backup completed - DB: $DB_SIZE, Uploads: $UPLOADS_SIZE" >> /var/log/peckup/backup.log
