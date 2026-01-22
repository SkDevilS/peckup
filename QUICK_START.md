# 🚀 Quick Start Guide - Hostinger VPS Deployment

This is a simplified guide to get your Peckup application running on Hostinger VPS quickly.

## 📋 Prerequisites Checklist

- [ ] Hostinger VPS with Ubuntu (20.04 or 22.04)
- [ ] Root/sudo access to VPS
- [ ] Domains: peckup.in, admin.peckup.in, api.peckup.in purchased
- [ ] SSH client installed on your computer
- [ ] **Note**: `.env` file is NOT in Git - you'll create it on the VPS

## 🎯 Step-by-Step Deployment

### Step 1: Connect to Your VPS

```bash
ssh root@your-vps-ip-address
```

### Step 2: Run Automated Server Setup

Upload the `setup-server.sh` file to your VPS and run:

```bash
chmod +x setup-server.sh
sudo ./setup-server.sh
```

This will install:
- Node.js 18
- Python 3
- Nginx
- MySQL
- Certbot (for SSL)
- All required dependencies

**Save the database credentials shown at the end!**

### Step 3: Configure DNS in Hostinger

1. Login to Hostinger Control Panel
2. Go to: Domains → Your Domain → DNS/Name Servers
3. Add these A records (replace `YOUR_VPS_IP` with your actual IP):

```
Type    Name    Value           TTL
A       @       YOUR_VPS_IP     14400
A       www     YOUR_VPS_IP     14400
A       admin   YOUR_VPS_IP     14400
A       api     YOUR_VPS_IP     14400
```

4. Wait 10-30 minutes for DNS propagation

### Step 4: Upload Your Project Files

**Option A: Using Git (Recommended)**
```bash
cd /var/www/peckup
git clone https://github.com/yourusername/peckup.git peckup
```

**Option B: Using SFTP**
- Use FileZilla or WinSCP
- Connect to your VPS
- Upload all project files to `/var/www/peckup/peckup`

### Step 5: Configure Backend Environment

#### 5.1 Generate Secret Keys First

**CRITICAL**: Generate secure random keys before creating the .env file.

```bash
cd /var/www/peckup/peckup/backend

# Generate SECRET_KEY
python3 -c "import secrets; print('SECRET_KEY=' + secrets.token_hex(32))"

# Generate JWT_SECRET_KEY
python3 -c "import secrets; print('JWT_SECRET_KEY=' + secrets.token_hex(32))"
```

**COPY THESE KEYS!** You'll need them in the next step.

Example output:
```
SECRET_KEY=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2
JWT_SECRET_KEY=z9y8x7w6v5u4t3s2r1q0p9o8n7m6l5k4j3i2h1g0f9e8d7c6b5a4z3y2x1w0v9u8
```

#### 5.2 Create .env File

```bash
nano .env
```

Paste this configuration (replace ALL CAPS placeholders with your actual values):

```env
# Flask Configuration
FLASK_APP=app.py
FLASK_ENV=production
SECRET_KEY=PASTE_YOUR_GENERATED_SECRET_KEY_HERE
JWT_SECRET_KEY=PASTE_YOUR_GENERATED_JWT_SECRET_KEY_HERE

# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=peckup_db
DB_USER=peckup_user
DB_PASSWORD=PASTE_YOUR_MYSQL_PASSWORD_FROM_STEP2_HERE

# Upload Configuration
UPLOAD_FOLDER=uploads
MAX_CONTENT_LENGTH=16777216

# Domain Configuration (Production - Hostinger VPS)
MAIN_DOMAIN=peckup.in
MAIN_URL=https://peckup.in
ADMIN_DOMAIN=admin.peckup.in
ADMIN_URL=https://admin.peckup.in
API_DOMAIN=api.peckup.in
API_URL=https://api.peckup.in

# Upload URL Configuration (Production)
# This is where uploaded files will be publicly accessible
UPLOAD_BASE_URL=https://api.peckup.in/uploads

# CORS Configuration (Production - Only allow your domains)
# IMPORTANT: No localhost URLs in production!
CORS_ORIGINS=https://peckup.in,https://admin.peckup.in,https://www.peckup.in

# Production Settings
DEBUG=False
TESTING=False
```

**Save and exit:**
- Press `Ctrl + X`
- Press `Y` to confirm
- Press `Enter` to save

#### 5.3 Verify Configuration

```bash
# Check file exists
ls -la .env

# Set proper permissions
chmod 600 .env
```

### Step 6: Setup Backend

```bash
cd /var/www/peckup/peckup/backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Initialize database
python init_db.py

# Create admin user (follow the prompts)
python create_admin_user.py
```

**When prompted, enter:**
- Admin email: `admin@peckup.in` (or your preferred email)
- Admin password: (use a strong password!)
- Confirm password

**IMPORTANT**: Save your admin credentials securely!

```bash
# Test backend starts without errors
python app.py
# You should see: "Running on http://0.0.0.0:5000"
# Press Ctrl+C to stop

# Deactivate virtual environment
deactivate
```

### Step 7: Setup Frontend

```bash
cd /var/www/peckup/peckup

# Install dependencies
npm install

# Build for production
npm run build
```

### Step 8: Configure Systemd Service

```bash
# Copy service file
sudo cp systemd/peckup-backend.service /etc/systemd/system/

# Create log directory
sudo mkdir -p /var/log/peckup
sudo chown -R www-data:www-data /var/log/peckup

# Set permissions
sudo chown -R www-data:www-data /var/www/peckup/peckup/backend/uploads

# Enable and start service
sudo systemctl daemon-reload
sudo systemctl enable peckup-backend
sudo systemctl start peckup-backend

# Check status
sudo systemctl status peckup-backend
```

### Step 9: Configure Nginx

```bash
# Copy Nginx configurations
sudo cp nginx-configs/peckup.in.conf /etc/nginx/sites-available/
sudo cp nginx-configs/admin.peckup.in.conf /etc/nginx/sites-available/
sudo cp nginx-configs/api.peckup.in.conf /etc/nginx/sites-available/

# Enable sites
sudo ln -s /etc/nginx/sites-available/peckup.in.conf /etc/nginx/sites-enabled/
sudo ln -s /etc/nginx/sites-available/admin.peckup.in.conf /etc/nginx/sites-enabled/
sudo ln -s /etc/nginx/sites-available/api.peckup.in.conf /etc/nginx/sites-enabled/

# Remove default site
sudo rm /etc/nginx/sites-enabled/default

# Test configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

### Step 10: Setup SSL Certificates

**Wait for DNS propagation first!** Test with: `ping peckup.in`

```bash
# Install SSL for all domains
sudo certbot --nginx -d peckup.in -d www.peckup.in
sudo certbot --nginx -d admin.peckup.in
sudo certbot --nginx -d api.peckup.in

# Test auto-renewal
sudo certbot renew --dry-run
```

### Step 11: Configure Firewall

```bash
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

### Step 12: Setup Automated Backups

```bash
# Update database password in backup script
sudo nano scripts/backup-peckup.sh
# Change: DB_PASSWORD="YOUR_DATABASE_PASSWORD_HERE"

# Make scripts executable
sudo chmod +x scripts/backup-peckup.sh
sudo chmod +x scripts/restore-backup.sh
sudo chmod +x scripts/monitor.sh

# Copy to system directory
sudo cp scripts/backup-peckup.sh /usr/local/bin/

# Setup daily backup (2 AM)
sudo crontab -e
# Add this line:
0 2 * * * /usr/local/bin/backup-peckup.sh >> /var/log/peckup/backup.log 2>&1
```

## ✅ Verification

### Test Your Websites

1. **Main Website**: https://peckup.in
2. **Admin Dashboard**: https://admin.peckup.in/admin/login
3. **API Health**: https://api.peckup.in/api/health

### Check Service Status

```bash
# Backend
sudo systemctl status peckup-backend

# Nginx
sudo systemctl status nginx

# MySQL
sudo systemctl status mysql

# View logs
sudo journalctl -u peckup-backend -f
```

### Run Monitor Script

```bash
sudo ./scripts/monitor.sh
```

## 🔄 Future Updates

When you need to update your application:

```bash
cd /var/www/peckup/peckup
sudo ./deploy.sh
```

Or manually:

```bash
cd /var/www/peckup/peckup

# Pull changes
git pull origin main

# Update backend
cd backend
source venv/bin/activate
pip install -r requirements.txt
deactivate
sudo systemctl restart peckup-backend

# Update frontend
cd ..
npm install
npm run build

# Restart services
sudo systemctl restart nginx
```

## 🆘 Troubleshooting

### Backend Not Starting

```bash
# Check logs
sudo journalctl -u peckup-backend -n 50

# Check if port is in use
sudo netstat -tulpn | grep 5000

# Restart
sudo systemctl restart peckup-backend
```

### Website Not Loading

```bash
# Check Nginx
sudo nginx -t
sudo systemctl status nginx

# Check logs
sudo tail -f /var/log/nginx/error.log
```

### Database Connection Failed

```bash
# Test connection
mysql -u peckup_user -p peckup_db

# Check MySQL status
sudo systemctl status mysql
```

### SSL Certificate Issues

```bash
# Check certificates
sudo certbot certificates

# Renew manually
sudo certbot renew --force-renewal
```

## 📞 Need Help?

Check these logs:
- Backend: `sudo journalctl -u peckup-backend -f`
- Nginx: `sudo tail -f /var/log/nginx/error.log`
- Application: `/var/log/peckup/error.log`

## 🎉 You're Done!

Your Peckup e-commerce store is now live!

- 🌐 Shop: https://peckup.in
- 👨‍💼 Admin: https://admin.peckup.in
- 🔌 API: https://api.peckup.in

Happy selling! 🚀
