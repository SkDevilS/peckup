# Peckup E-Commerce - Deployment Files

This directory contains all necessary files for deploying Peckup on Hostinger VPS with Ubuntu.

## 📁 File Structure

```
.
├── .gitignore                          # Git ignore rules
├── .env.production                     # Frontend production environment
├── backend/.env.production             # Backend production environment template
├── HOSTINGER_DEPLOYMENT.md             # Detailed deployment guide
├── QUICK_START.md                      # Quick start guide
├── setup-server.sh                     # Automated server setup script
├── deploy.sh                           # Deployment/update script
├── nginx-configs/                      # Nginx configuration files
│   ├── peckup.in.conf                 # Main website config
│   ├── admin.peckup.in.conf           # Admin dashboard config
│   └── api.peckup.in.conf             # API backend config
├── systemd/                            # Systemd service files
│   └── peckup-backend.service         # Backend service configuration
└── scripts/                            # Utility scripts
    ├── backup-peckup.sh               # Automated backup script
    ├── restore-backup.sh              # Restore from backup script
    └── monitor.sh                     # System monitoring script
```

## 🚀 Quick Deployment

### For First-Time Setup:

1. **Read the Quick Start Guide**
   ```bash
   cat QUICK_START.md
   ```

2. **Run Server Setup**
   ```bash
   chmod +x setup-server.sh
   sudo ./setup-server.sh
   ```

3. **Follow the remaining steps in QUICK_START.md**

### For Updates:

```bash
chmod +x deploy.sh
sudo ./deploy.sh
```

## 📚 Documentation

- **QUICK_START.md** - Fast deployment guide (recommended for beginners)
- **HOSTINGER_DEPLOYMENT.md** - Comprehensive deployment documentation
- **README_DEPLOYMENT.md** - This file

## 🌐 Domain Configuration

Your application will be accessible at:

- **Main Website**: https://peckup.in (and www.peckup.in)
- **Admin Dashboard**: https://admin.peckup.in
- **API Backend**: https://api.peckup.in

## 🔧 Configuration Files

### Backend Environment (.env)

Located at: `backend/.env`

Required variables:
```env
FLASK_APP=app.py
FLASK_ENV=production
SECRET_KEY=your-secret-key
JWT_SECRET_KEY=your-jwt-secret
DB_HOST=localhost
DB_NAME=peckup_db
DB_USER=peckup_user
DB_PASSWORD=your-password
CORS_ORIGINS=https://peckup.in,https://admin.peckup.in
```

### Frontend Environment (.env.production)

Located at: `.env.production`

Required variables:
```env
VITE_API_BASE_URL=https://api.peckup.in
VITE_API_PREFIX=/api
VITE_APP_ENV=production
```

## 🛠️ Utility Scripts

### Backup Script

Backs up database and uploads daily:
```bash
sudo /usr/local/bin/backup-peckup.sh
```

Backups are stored in: `/var/backups/peckup/`

### Restore Script

Restore from a backup:
```bash
sudo ./scripts/restore-backup.sh
```

### Monitor Script

Check system health:
```bash
sudo ./scripts/monitor.sh
```

### Deploy Script

Update application:
```bash
sudo ./deploy.sh
```

## 📊 Service Management

### Backend Service

```bash
# Start
sudo systemctl start peckup-backend

# Stop
sudo systemctl stop peckup-backend

# Restart
sudo systemctl restart peckup-backend

# Status
sudo systemctl status peckup-backend

# Logs
sudo journalctl -u peckup-backend -f
```

### Nginx

```bash
# Start
sudo systemctl start nginx

# Stop
sudo systemctl stop nginx

# Restart
sudo systemctl restart nginx

# Test configuration
sudo nginx -t

# Logs
sudo tail -f /var/log/nginx/error.log
```

### MySQL

```bash
# Start
sudo systemctl start mysql

# Stop
sudo systemctl stop mysql

# Restart
sudo systemctl restart mysql

# Status
sudo systemctl status mysql
```

## 🔍 Monitoring & Logs

### Application Logs

- Backend logs: `/var/log/peckup/error.log`
- Access logs: `/var/log/peckup/access.log`
- Backup logs: `/var/log/peckup/backup.log`

### System Logs

- Nginx access: `/var/log/nginx/access.log`
- Nginx error: `/var/log/nginx/error.log`
- Backend service: `sudo journalctl -u peckup-backend`

### View Logs

```bash
# Backend logs (live)
sudo journalctl -u peckup-backend -f

# Nginx error logs (live)
sudo tail -f /var/log/nginx/error.log

# Application error logs
sudo tail -f /var/log/peckup/error.log
```

## 🔐 Security Checklist

- [ ] Changed default SECRET_KEY in backend/.env
- [ ] Changed default JWT_SECRET_KEY in backend/.env
- [ ] Set strong MySQL passwords
- [ ] Configured firewall (UFW)
- [ ] Installed SSL certificates
- [ ] Set up automated backups
- [ ] Configured fail2ban
- [ ] Set proper file permissions
- [ ] Disabled root SSH login (optional)
- [ ] Set up SSH key authentication (optional)

## 🔄 Update Process

1. Pull latest code:
   ```bash
   cd /var/www/peckup/peckup
   git pull origin main
   ```

2. Update backend:
   ```bash
   cd backend
   source venv/bin/activate
   pip install -r requirements.txt
   deactivate
   sudo systemctl restart peckup-backend
   ```

3. Update frontend:
   ```bash
   cd ..
   npm install
   npm run build
   ```

4. Restart services:
   ```bash
   sudo systemctl restart nginx
   ```

Or simply run:
```bash
sudo ./deploy.sh
```

## 🆘 Troubleshooting

### Common Issues

1. **Backend not starting**
   - Check logs: `sudo journalctl -u peckup-backend -n 50`
   - Verify .env file exists and is configured
   - Check database connection

2. **Website not loading**
   - Test Nginx config: `sudo nginx -t`
   - Check Nginx logs: `sudo tail -f /var/log/nginx/error.log`
   - Verify DNS propagation: `ping peckup.in`

3. **SSL certificate issues**
   - Check certificates: `sudo certbot certificates`
   - Renew manually: `sudo certbot renew`
   - Verify DNS is pointing to correct IP

4. **Database connection failed**
   - Test connection: `mysql -u peckup_user -p peckup_db`
   - Check MySQL status: `sudo systemctl status mysql`
   - Verify credentials in .env file

### Getting Help

1. Check the logs (see Monitoring & Logs section)
2. Run the monitor script: `sudo ./scripts/monitor.sh`
3. Review HOSTINGER_DEPLOYMENT.md for detailed troubleshooting

## 📦 Backup & Restore

### Manual Backup

```bash
sudo ./scripts/backup-peckup.sh
```

### Restore from Backup

```bash
sudo ./scripts/restore-backup.sh
```

### Automated Backups

Backups run daily at 2 AM via cron. Check backup logs:
```bash
tail -f /var/log/peckup/backup.log
```

## 🎯 Performance Optimization

### Nginx Caching

Already configured in nginx-configs/*.conf files:
- Static files cached for 1 year
- Gzip compression enabled
- Browser caching headers set

### Database Optimization

```bash
# Optimize tables
mysql -u peckup_user -p peckup_db -e "OPTIMIZE TABLE products, orders, users;"
```

### Monitor Performance

```bash
# Check system resources
htop

# Check disk usage
df -h

# Check memory usage
free -h

# Check active connections
sudo netstat -an | grep :80 | wc -l
```

## 📞 Support

For deployment issues:
1. Check QUICK_START.md for step-by-step guide
2. Review HOSTINGER_DEPLOYMENT.md for detailed documentation
3. Check logs for error messages
4. Run monitor script for system health

## 🎉 Success!

Once deployed, your application will be live at:
- 🌐 https://peckup.in
- 👨‍💼 https://admin.peckup.in
- 🔌 https://api.peckup.in

Happy selling! 🚀
