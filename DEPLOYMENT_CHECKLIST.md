# 📋 Peckup Deployment Checklist

Use this checklist to ensure all steps are completed for a successful deployment.

## Pre-Deployment

### VPS Setup
- [ ] Hostinger VPS purchased and accessible
- [ ] Ubuntu 20.04 or 22.04 installed
- [ ] Root/sudo access confirmed
- [ ] VPS IP address noted: `___________________`
- [ ] SSH access working

### Domain Setup
- [ ] peckup.in domain purchased
- [ ] admin.peckup.in subdomain available
- [ ] api.peckup.in subdomain available
- [ ] Access to Hostinger DNS management

### Local Preparation
- [ ] All project files ready
- [ ] Git repository set up (optional)
- [ ] SFTP client installed (FileZilla/WinSCP)
- [ ] SSH client installed

## Server Setup Phase

### Initial Server Configuration
- [ ] Connected to VPS via SSH
- [ ] Ran `setup-server.sh` script
- [ ] Noted MySQL root password: `___________________`
- [ ] Noted database name: `___________________`
- [ ] Noted database user: `___________________`
- [ ] Noted database password: `___________________`
- [ ] System packages updated
- [ ] Node.js 18 installed
- [ ] Python 3 installed
- [ ] Nginx installed
- [ ] MySQL installed and secured
- [ ] Certbot installed
- [ ] Firewall configured

### DNS Configuration
- [ ] Logged into Hostinger control panel
- [ ] Navigated to DNS management
- [ ] Added A record: @ → VPS_IP
- [ ] Added A record: www → VPS_IP
- [ ] Added A record: admin → VPS_IP
- [ ] Added A record: api → VPS_IP
- [ ] Waited for DNS propagation (10-30 minutes)
- [ ] Verified DNS: `ping peckup.in` works
- [ ] Verified DNS: `ping admin.peckup.in` works
- [ ] Verified DNS: `ping api.peckup.in` works

## Project Setup Phase

### File Upload
- [ ] Created directory: `/var/www/peckup/peckup`
- [ ] Uploaded all project files OR cloned from Git
- [ ] Verified all files present
- [ ] Set proper ownership: `chown -R $USER:$USER /var/www/peckup`

### Backend Configuration
- [ ] Navigated to `backend/` directory
- [ ] Created `.env` file
- [ ] Set FLASK_APP=app.py
- [ ] Set FLASK_ENV=production
- [ ] Generated SECRET_KEY (32 chars): `___________________`
- [ ] Generated JWT_SECRET_KEY (32 chars): `___________________`
- [ ] Configured database credentials
- [ ] Set CORS_ORIGINS correctly
- [ ] Created Python virtual environment
- [ ] Activated virtual environment
- [ ] Installed requirements.txt
- [ ] Ran `init_db.py` successfully
- [ ] Ran `create_admin_user.py`
- [ ] Noted admin credentials: `___________________`
- [ ] Deactivated virtual environment

### Frontend Configuration
- [ ] Created `.env.production` file
- [ ] Set VITE_API_BASE_URL=https://api.peckup.in
- [ ] Set VITE_API_PREFIX=/api
- [ ] Set VITE_APP_ENV=production
- [ ] Ran `npm install`
- [ ] Ran `npm run build`
- [ ] Verified `dist/` folder created
- [ ] Verified `dist/index.html` exists

## Service Configuration Phase

### Backend Service
- [ ] Copied `systemd/peckup-backend.service` to `/etc/systemd/system/`
- [ ] Created log directory: `/var/log/peckup`
- [ ] Set log directory permissions
- [ ] Set uploads directory permissions
- [ ] Ran `systemctl daemon-reload`
- [ ] Enabled service: `systemctl enable peckup-backend`
- [ ] Started service: `systemctl start peckup-backend`
- [ ] Verified service running: `systemctl status peckup-backend`
- [ ] Checked logs for errors: `journalctl -u peckup-backend -n 50`

### Nginx Configuration
- [ ] Copied `nginx-configs/peckup.in.conf` to `/etc/nginx/sites-available/`
- [ ] Copied `nginx-configs/admin.peckup.in.conf` to `/etc/nginx/sites-available/`
- [ ] Copied `nginx-configs/api.peckup.in.conf` to `/etc/nginx/sites-available/`
- [ ] Created symlinks in `/etc/nginx/sites-enabled/`
- [ ] Removed default site
- [ ] Tested Nginx config: `nginx -t`
- [ ] Restarted Nginx: `systemctl restart nginx`
- [ ] Verified Nginx running: `systemctl status nginx`

## SSL & Security Phase

### SSL Certificates
- [ ] Verified DNS propagation complete
- [ ] Ran certbot for peckup.in and www.peckup.in
- [ ] Ran certbot for admin.peckup.in
- [ ] Ran certbot for api.peckup.in
- [ ] Tested auto-renewal: `certbot renew --dry-run`
- [ ] Verified HTTPS works for all domains

### Firewall
- [ ] Allowed OpenSSH
- [ ] Allowed Nginx Full
- [ ] Enabled UFW
- [ ] Verified firewall status: `ufw status`

### Security Hardening
- [ ] Changed all default passwords
- [ ] Installed fail2ban
- [ ] Reviewed file permissions
- [ ] Disabled unnecessary services
- [ ] Configured SSH key authentication (optional)
- [ ] Disabled root SSH login (optional)

## Backup & Monitoring Phase

### Backup Configuration
- [ ] Updated database password in `scripts/backup-peckup.sh`
- [ ] Made backup script executable
- [ ] Copied backup script to `/usr/local/bin/`
- [ ] Tested manual backup
- [ ] Verified backup files created in `/var/backups/peckup/`
- [ ] Added cron job for daily backups
- [ ] Verified cron job: `crontab -l`

### Monitoring Setup
- [ ] Made monitor script executable
- [ ] Tested monitor script: `./scripts/monitor.sh`
- [ ] Verified all services showing as running
- [ ] Checked system resources

## Testing Phase

### Backend Testing
- [ ] API health check: `curl https://api.peckup.in/api/health`
- [ ] Response is 200 OK
- [ ] Backend logs show no errors
- [ ] Database connection working
- [ ] File uploads working

### Frontend Testing
- [ ] Main website loads: https://peckup.in
- [ ] Admin dashboard loads: https://admin.peckup.in
- [ ] All pages accessible
- [ ] Images loading correctly
- [ ] No console errors in browser
- [ ] Mobile responsive working

### Full Application Testing
- [ ] User registration works
- [ ] User login works
- [ ] Product browsing works
- [ ] Add to cart works
- [ ] Checkout process works
- [ ] Order creation works
- [ ] Admin login works
- [ ] Admin can manage products
- [ ] Admin can manage orders
- [ ] Admin can view analytics
- [ ] Email notifications working (if configured)

### Performance Testing
- [ ] Page load times acceptable
- [ ] API response times good
- [ ] Images optimized and loading fast
- [ ] No memory leaks
- [ ] Server resources within limits

## Post-Deployment

### Documentation
- [ ] Saved all credentials securely
- [ ] Documented any custom configurations
- [ ] Created runbook for common tasks
- [ ] Shared access with team (if applicable)

### Monitoring Setup
- [ ] Set up uptime monitoring (optional)
- [ ] Configure error alerting (optional)
- [ ] Set up log aggregation (optional)
- [ ] Schedule regular health checks

### Maintenance Plan
- [ ] Scheduled regular backups verified
- [ ] Update procedure documented
- [ ] Rollback procedure documented
- [ ] Emergency contacts listed
- [ ] Maintenance window scheduled

## Final Verification

### All Systems Go
- [ ] ✅ Main website: https://peckup.in
- [ ] ✅ Admin dashboard: https://admin.peckup.in
- [ ] ✅ API backend: https://api.peckup.in
- [ ] ✅ SSL certificates valid
- [ ] ✅ All services running
- [ ] ✅ Backups configured
- [ ] ✅ Monitoring active
- [ ] ✅ Performance acceptable
- [ ] ✅ Security hardened

## Important Credentials

**Save these securely!**

```
VPS IP: ___________________
SSH User: ___________________
SSH Password/Key: ___________________

MySQL Root Password: ___________________
Database Name: ___________________
Database User: ___________________
Database Password: ___________________

Flask SECRET_KEY: ___________________
Flask JWT_SECRET_KEY: ___________________

Admin Email: ___________________
Admin Password: ___________________

SSL Certificate Locations:
- /etc/letsencrypt/live/peckup.in/
- /etc/letsencrypt/live/admin.peckup.in/
- /etc/letsencrypt/live/api.peckup.in/
```

## Quick Reference Commands

```bash
# Check service status
sudo systemctl status peckup-backend
sudo systemctl status nginx
sudo systemctl status mysql

# View logs
sudo journalctl -u peckup-backend -f
sudo tail -f /var/log/nginx/error.log

# Restart services
sudo systemctl restart peckup-backend
sudo systemctl restart nginx

# Run backup
sudo /usr/local/bin/backup-peckup.sh

# Monitor system
sudo ./scripts/monitor.sh

# Deploy updates
sudo ./deploy.sh
```

## Troubleshooting Checklist

If something goes wrong:

- [ ] Check service status
- [ ] Review error logs
- [ ] Verify DNS settings
- [ ] Check firewall rules
- [ ] Verify SSL certificates
- [ ] Test database connection
- [ ] Check disk space
- [ ] Review file permissions
- [ ] Verify environment variables
- [ ] Check network connectivity

## 🎉 Deployment Complete!

Date completed: ___________________
Deployed by: ___________________
Version: ___________________

Your Peckup e-commerce store is now live and ready for business! 🚀
