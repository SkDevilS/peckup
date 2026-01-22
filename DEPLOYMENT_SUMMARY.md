# 🚀 Peckup Deployment Summary

## Overview

This document provides a complete overview of the deployment setup for the Peckup e-commerce application on Hostinger VPS with Ubuntu.

## 🌐 Domain Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Hostinger VPS (Ubuntu)                   │
│                                                              │
│  ┌────────────────┐  ┌────────────────┐  ┌──────────────┐ │
│  │  peckup.in     │  │ admin.peckup.in│  │ api.peckup.in│ │
│  │  (Main Site)   │  │ (Admin Panel)  │  │ (Backend API)│ │
│  │                │  │                │  │              │ │
│  │  React App     │  │  React App     │  │  Flask API   │ │
│  │  (Port 80/443) │  │  (Port 80/443) │  │  (Port 5000) │ │
│  └────────┬───────┘  └────────┬───────┘  └──────┬───────┘ │
│           │                   │                  │          │
│           └───────────────────┴──────────────────┘          │
│                              │                               │
│                         ┌────▼─────┐                        │
│                         │  Nginx   │                        │
│                         │ (Reverse │                        │
│                         │  Proxy)  │                        │
│                         └────┬─────┘                        │
│                              │                               │
│                         ┌────▼─────┐                        │
│                         │  MySQL   │                        │
│                         │ Database │                        │
│                         └──────────┘                        │
└─────────────────────────────────────────────────────────────┘
```

## 📁 Server Directory Structure

```
/var/www/peckup/peckup/
├── backend/
│   ├── app.py                    # Flask application
│   ├── config.py                 # Configuration
│   ├── models.py                 # Database models
│   ├── requirements.txt          # Python dependencies
│   ├── .env                      # Environment variables (create this)
│   ├── venv/                     # Python virtual environment
│   ├── routes/                   # API routes
│   ├── utils/                    # Utility functions
│   └── uploads/                  # Uploaded files
│       ├── products/             # Product images
│       └── bulk_images/          # Bulk upload images
├── dist/                         # Built frontend (created by npm run build)
│   ├── index.html
│   ├── assets/
│   └── ...
├── src/                          # Frontend source code
├── nginx-configs/                # Nginx configuration files
├── systemd/                      # Systemd service files
├── scripts/                      # Utility scripts
├── package.json                  # Node.js dependencies
└── .env.production              # Frontend environment variables

/etc/nginx/sites-available/
├── peckup.in.conf
├── admin.peckup.in.conf
└── api.peckup.in.conf

/etc/systemd/system/
└── peckup-backend.service

/var/log/peckup/
├── access.log
├── error.log
└── backup.log

/var/backups/peckup/
├── db_backup_YYYYMMDD_HHMMSS.sql.gz
└── uploads_backup_YYYYMMDD_HHMMSS.tar.gz
```

## 🔧 Technology Stack

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Routing**: React Router v6
- **Animations**: Framer Motion

### Backend
- **Framework**: Flask 3.0
- **Database**: MySQL
- **ORM**: SQLAlchemy
- **Authentication**: JWT (Flask-JWT-Extended)
- **Server**: Gunicorn (4 workers)
- **File Upload**: Pillow, Werkzeug

### Infrastructure
- **Web Server**: Nginx
- **SSL**: Let's Encrypt (Certbot)
- **OS**: Ubuntu 20.04/22.04
- **Process Manager**: Systemd
- **Firewall**: UFW

## 🔐 Security Features

1. **SSL/TLS Encryption**: All domains secured with Let's Encrypt certificates
2. **JWT Authentication**: Secure token-based authentication
3. **CORS Configuration**: Properly configured cross-origin requests
4. **Firewall**: UFW configured to allow only necessary ports
5. **Fail2ban**: Protection against brute-force attacks
6. **Security Headers**: X-Frame-Options, X-Content-Type-Options, etc.
7. **Password Hashing**: Werkzeug secure password hashing
8. **SQL Injection Protection**: SQLAlchemy ORM parameterized queries

## 📊 Service Configuration

### Backend Service (Gunicorn)
- **Workers**: 4
- **Bind**: 127.0.0.1:5000
- **Timeout**: 120 seconds
- **Max Requests**: 1000 (with jitter)
- **Auto-restart**: On failure
- **User**: www-data

### Nginx Configuration
- **Gzip Compression**: Enabled
- **Static File Caching**: 1 year
- **Client Max Body Size**: 20MB
- **Proxy Timeout**: 120 seconds
- **SSL**: TLS 1.2+

### MySQL Database
- **Character Set**: utf8mb4
- **Collation**: utf8mb4_unicode_ci
- **Connection**: localhost:3306

## 🔄 Deployment Workflow

### Initial Deployment
1. Run `setup-server.sh` - Sets up server environment
2. Configure DNS records in Hostinger
3. Upload project files to `/var/www/peckup/peckup`
4. Configure backend `.env` file
5. Setup Python virtual environment
6. Initialize database
7. Build frontend
8. Configure systemd service
9. Configure Nginx
10. Install SSL certificates
11. Start services

### Updates/Redeployment
1. Pull latest code: `git pull origin main`
2. Update backend dependencies
3. Run database migrations (if any)
4. Rebuild frontend: `npm run build`
5. Restart services: `sudo ./deploy.sh`

## 📝 Environment Variables

### Backend (.env)
```env
FLASK_APP=app.py
FLASK_ENV=production
SECRET_KEY=<generated-secret-key>
JWT_SECRET_KEY=<generated-jwt-secret>
DB_HOST=localhost
DB_PORT=3306
DB_NAME=peckup_db
DB_USER=peckup_user
DB_PASSWORD=<your-password>
UPLOAD_FOLDER=uploads
MAX_CONTENT_LENGTH=16777216
CORS_ORIGINS=https://peckup.in,https://admin.peckup.in
```

### Frontend (.env.production)
```env
VITE_API_BASE_URL=https://api.peckup.in
VITE_API_PREFIX=/api
VITE_APP_ENV=production
```

## 🛠️ Maintenance Tasks

### Daily
- Automated backups (2 AM via cron)
- Log rotation (automatic)

### Weekly
- Review error logs
- Check disk space
- Monitor system resources

### Monthly
- Update system packages
- Review SSL certificate expiry
- Database optimization
- Security audit

### As Needed
- Deploy application updates
- Restore from backup
- Scale resources

## 📈 Monitoring

### Health Checks
- API Health: `https://api.peckup.in/api/health`
- Service Status: `sudo systemctl status peckup-backend`
- System Monitor: `sudo ./scripts/monitor.sh`

### Log Files
- Backend: `sudo journalctl -u peckup-backend -f`
- Nginx Access: `/var/log/nginx/access.log`
- Nginx Error: `/var/log/nginx/error.log`
- Application: `/var/log/peckup/error.log`

### Metrics to Monitor
- CPU usage
- Memory usage
- Disk space
- Database connections
- API response times
- Error rates
- SSL certificate expiry

## 🔄 Backup Strategy

### What's Backed Up
- MySQL database (compressed)
- Uploaded files (products, bulk images)

### Backup Schedule
- **Frequency**: Daily at 2:00 AM
- **Retention**: 7 days
- **Location**: `/var/backups/peckup/`

### Backup Files
- `db_backup_YYYYMMDD_HHMMSS.sql.gz`
- `uploads_backup_YYYYMMDD_HHMMSS.tar.gz`

### Restore Process
```bash
sudo ./scripts/restore-backup.sh
```

## 🚨 Troubleshooting Guide

### Backend Not Starting
```bash
# Check logs
sudo journalctl -u peckup-backend -n 50

# Check if port is in use
sudo netstat -tulpn | grep 5000

# Verify .env file
cat backend/.env

# Restart service
sudo systemctl restart peckup-backend
```

### Website Not Loading
```bash
# Test Nginx config
sudo nginx -t

# Check Nginx status
sudo systemctl status nginx

# View error logs
sudo tail -f /var/log/nginx/error.log

# Restart Nginx
sudo systemctl restart nginx
```

### Database Connection Issues
```bash
# Check MySQL status
sudo systemctl status mysql

# Test connection
mysql -u peckup_user -p peckup_db

# Check database exists
mysql -u root -p -e "SHOW DATABASES;"
```

### SSL Certificate Issues
```bash
# Check certificates
sudo certbot certificates

# Renew certificates
sudo certbot renew

# Test renewal
sudo certbot renew --dry-run
```

## 📞 Quick Reference Commands

### Service Management
```bash
# Backend
sudo systemctl start peckup-backend
sudo systemctl stop peckup-backend
sudo systemctl restart peckup-backend
sudo systemctl status peckup-backend

# Nginx
sudo systemctl restart nginx
sudo nginx -t

# MySQL
sudo systemctl restart mysql
```

### Logs
```bash
# Backend logs (live)
sudo journalctl -u peckup-backend -f

# Nginx error logs
sudo tail -f /var/log/nginx/error.log

# Application logs
sudo tail -f /var/log/peckup/error.log
```

### Maintenance
```bash
# Run backup
sudo /usr/local/bin/backup-peckup.sh

# Restore backup
sudo ./scripts/restore-backup.sh

# Monitor system
sudo ./scripts/monitor.sh

# Deploy updates
sudo ./deploy.sh
```

### Database
```bash
# Connect to database
mysql -u peckup_user -p peckup_db

# Backup database manually
mysqldump -u peckup_user -p peckup_db > backup.sql

# Restore database
mysql -u peckup_user -p peckup_db < backup.sql
```

## 🎯 Performance Optimization

### Implemented Optimizations
- Gzip compression for text files
- Static file caching (1 year)
- Image optimization
- Database indexing
- Connection pooling
- Gunicorn worker processes (4)
- Nginx buffering

### Future Optimizations
- CDN for static assets
- Redis caching
- Database query optimization
- Image lazy loading
- Code splitting
- Service worker for PWA

## 📚 Documentation Files

1. **QUICK_START.md** - Fast deployment guide
2. **HOSTINGER_DEPLOYMENT.md** - Comprehensive deployment guide
3. **DEPLOYMENT_CHECKLIST.md** - Step-by-step checklist
4. **DEPLOYMENT_SUMMARY.md** - This file
5. **README_DEPLOYMENT.md** - File structure and overview

## 🔗 Important URLs

### Production
- Main Website: https://peckup.in
- Admin Dashboard: https://admin.peckup.in/admin/login
- API Backend: https://api.peckup.in
- API Health: https://api.peckup.in/api/health

### Development
- Local Frontend: http://localhost:5173
- Local Backend: http://localhost:5000

## 📦 Deployment Files

### Scripts
- `setup-server.sh` - Initial server setup
- `deploy.sh` - Deployment/update script
- `scripts/backup-peckup.sh` - Backup script
- `scripts/restore-backup.sh` - Restore script
- `scripts/monitor.sh` - Monitoring script

### Configuration Files
- `nginx-configs/*.conf` - Nginx configurations
- `systemd/peckup-backend.service` - Backend service
- `.env.production` - Frontend environment
- `backend/.env.production` - Backend environment template

## ✅ Post-Deployment Checklist

- [ ] All services running
- [ ] SSL certificates installed
- [ ] DNS configured correctly
- [ ] Backups scheduled
- [ ] Monitoring active
- [ ] Firewall configured
- [ ] Admin account created
- [ ] Test orders completed
- [ ] Performance acceptable
- [ ] Documentation updated

## 🎉 Success Criteria

Your deployment is successful when:

1. ✅ All three domains are accessible via HTTPS
2. ✅ Users can browse products and place orders
3. ✅ Admin can login and manage the store
4. ✅ API responds to health checks
5. ✅ All services are running without errors
6. ✅ Backups are being created daily
7. ✅ SSL certificates are valid
8. ✅ Performance is acceptable

## 📞 Support & Resources

### Documentation
- Flask: https://flask.palletsprojects.com/
- React: https://react.dev/
- Nginx: https://nginx.org/en/docs/
- MySQL: https://dev.mysql.com/doc/

### Hostinger Support
- Support Portal: https://www.hostinger.com/support
- Knowledge Base: https://support.hostinger.com/

### Server Management
- Location: `/var/www/peckup/peckup`
- Logs: `/var/log/peckup/`
- Backups: `/var/backups/peckup/`

---

**Deployment Date**: _________________
**Deployed By**: _________________
**Version**: 1.0.0

🚀 **Your Peckup e-commerce store is ready for business!**
