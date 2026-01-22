#!/bin/bash

# Peckup Monitoring Script
# This script checks the health of all services

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
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

print_header() {
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
}

clear
echo ""
print_header "🔍 Peckup System Monitor"
echo ""

# Check system resources
print_header "💻 System Resources"
echo ""
echo "CPU Usage:"
top -bn1 | grep "Cpu(s)" | sed "s/.*, *\([0-9.]*\)%* id.*/\1/" | awk '{print "  " 100 - $1"%"}'
echo ""
echo "Memory Usage:"
free -h | awk 'NR==2{printf "  Used: %s / %s (%.2f%%)\n", $3,$2,$3*100/$2 }'
echo ""
echo "Disk Usage:"
df -h / | awk 'NR==2{printf "  Used: %s / %s (%s)\n", $3,$2,$5}'
echo ""

# Check services
print_header "🔧 Service Status"
echo ""

# Check Backend
if systemctl is-active --quiet peckup-backend; then
    print_success "Backend Service: Running"
    BACKEND_PID=$(systemctl show -p MainPID peckup-backend | cut -d= -f2)
    BACKEND_MEM=$(ps -p $BACKEND_PID -o rss= 2>/dev/null | awk '{printf "%.2f MB", $1/1024}')
    echo "  PID: $BACKEND_PID, Memory: $BACKEND_MEM"
else
    print_error "Backend Service: Not Running"
fi
echo ""

# Check Nginx
if systemctl is-active --quiet nginx; then
    print_success "Nginx: Running"
    NGINX_CONNECTIONS=$(netstat -an | grep :80 | wc -l)
    echo "  Active connections: $NGINX_CONNECTIONS"
else
    print_error "Nginx: Not Running"
fi
echo ""

# Check MySQL
if systemctl is-active --quiet mysql; then
    print_success "MySQL: Running"
    MYSQL_CONNECTIONS=$(mysql -e "SHOW STATUS WHERE variable_name = 'Threads_connected';" 2>/dev/null | tail -1 | awk '{print $2}')
    echo "  Active connections: $MYSQL_CONNECTIONS"
else
    print_error "MySQL: Not Running"
fi
echo ""

# Check API health
print_header "🌐 API Health Check"
echo ""
API_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" https://api.peckup.in/api/health 2>/dev/null)
if [ "$API_RESPONSE" = "200" ]; then
    print_success "API: Responding (HTTP $API_RESPONSE)"
else
    print_error "API: Not responding properly (HTTP $API_RESPONSE)"
fi
echo ""

# Check websites
print_header "🌍 Website Status"
echo ""

MAIN_SITE=$(curl -s -o /dev/null -w "%{http_code}" https://peckup.in 2>/dev/null)
if [ "$MAIN_SITE" = "200" ]; then
    print_success "Main Site (peckup.in): Online (HTTP $MAIN_SITE)"
else
    print_error "Main Site (peckup.in): Issue detected (HTTP $MAIN_SITE)"
fi

ADMIN_SITE=$(curl -s -o /dev/null -w "%{http_code}" https://admin.peckup.in 2>/dev/null)
if [ "$ADMIN_SITE" = "200" ]; then
    print_success "Admin Site (admin.peckup.in): Online (HTTP $ADMIN_SITE)"
else
    print_error "Admin Site (admin.peckup.in): Issue detected (HTTP $ADMIN_SITE)"
fi
echo ""

# Check SSL certificates
print_header "🔒 SSL Certificate Status"
echo ""

for domain in peckup.in admin.peckup.in api.peckup.in; do
    EXPIRY=$(echo | openssl s_client -servername $domain -connect $domain:443 2>/dev/null | openssl x509 -noout -enddate 2>/dev/null | cut -d= -f2)
    if [ -n "$EXPIRY" ]; then
        DAYS_LEFT=$(( ($(date -d "$EXPIRY" +%s) - $(date +%s)) / 86400 ))
        if [ $DAYS_LEFT -gt 30 ]; then
            print_success "$domain: Valid ($DAYS_LEFT days remaining)"
        elif [ $DAYS_LEFT -gt 0 ]; then
            print_info "$domain: Expiring soon ($DAYS_LEFT days remaining)"
        else
            print_error "$domain: Expired!"
        fi
    else
        print_error "$domain: No SSL certificate found"
    fi
done
echo ""

# Check recent errors
print_header "⚠️  Recent Errors (Last 10)"
echo ""
echo "Backend Errors:"
journalctl -u peckup-backend --since "1 hour ago" -p err -n 5 --no-pager 2>/dev/null || echo "  No recent errors"
echo ""
echo "Nginx Errors:"
tail -n 5 /var/log/nginx/error.log 2>/dev/null || echo "  No recent errors"
echo ""

# Check disk space for uploads
print_header "📁 Upload Directory"
echo ""
UPLOADS_SIZE=$(du -sh /var/www/peckup/peckup/backend/uploads 2>/dev/null | cut -f1)
UPLOADS_COUNT=$(find /var/www/peckup/peckup/backend/uploads -type f 2>/dev/null | wc -l)
echo "  Size: $UPLOADS_SIZE"
echo "  Files: $UPLOADS_COUNT"
echo ""

# Check last backup
print_header "💾 Last Backup"
echo ""
LAST_BACKUP=$(ls -t /var/backups/peckup/db_backup_*.sql.gz 2>/dev/null | head -1)
if [ -n "$LAST_BACKUP" ]; then
    BACKUP_DATE=$(stat -c %y "$LAST_BACKUP" | cut -d' ' -f1,2 | cut -d'.' -f1)
    BACKUP_SIZE=$(du -h "$LAST_BACKUP" | cut -f1)
    print_success "Last backup: $BACKUP_DATE ($BACKUP_SIZE)"
else
    print_error "No backups found"
fi
echo ""

print_header "✅ Monitoring Complete"
echo ""
