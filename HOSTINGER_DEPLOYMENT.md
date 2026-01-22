# Hostinger VPS Deployment Guide for Peckup

This guide will help you deploy the Peckup e-commerce application on Hostinger VPS with Ubuntu.

## 🌐 Domain Configuration

- **Main Website**: `peckup.in`
- **Admin Dashboard**: `admin.peckup.in`
- **API Backend**: `api.peckup.in`

## 📋 Prerequisites

- Hostinger VPS with Ubuntu (20.04 or 22.04 recommended)
- Root or sudo access
- Domains purchased and configured in Hostinger
- SSH access to your VPS

## 🚀 Deployment Steps

### 1. Initial Server Setup

```bash
# Connect to your VPS via SSH
ssh root@your-vps-ip

# Update system packages
sudo apt update && sudo apt upgrade -y

# Install essential tools
sudo apt install -y git curl wget vim ufw
```

### 2. Install Required Software

#### Install Node.js (v18 LTS)
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs
node --version
npm --version
```

#### Install Python 3 and pip
```bash
sudo apt install -y python3 python3-pip python3-venv
python3 --version
pip3 --version
```

#### Install Nginx
```bash
sudo apt install -y nginx
sudo systemctl start nginx
sudo systemctl enable nginx
```

#### Install MySQL
```bash
sudo apt install -y mysql-server
sudo mysql_secure_installation
```

#### Install Certbot for SSL
```bash
sudo apt install -y certbot python3-certbot-nginx
```

### 3. Configure MySQL Database

```bash
# Login to MySQL
sudo mysql

# Create database and user
CREATE DATABASE peckup_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'peckup_user'@'localhost' IDENTIFIED BY 'your_strong_password_here';
GRANT ALL PRIVILEGES ON peckup_db.* TO 'peckup_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### 4. Setup Project Directory

```bash
# Create project directory
sudo mkdir -p /var/www/peckup
sudo chown -R $USER:$USER /var/www/peckup

# Navigate to project directory
cd /var/www/peckup

# Clone your repository (or upload files via SFTP)
git clone https://github.com/yourusername/peckup.git .
# OR upload files using SFTP to /var/www/peckup/peckup
```

**⚠️ IMPORTANT NOTE**: The `.env` file is NOT in the Git repository (it's in .gitignore for security). You will create it manually in Step 5.

### 5. Setup Backend (Flask API)

```bash
cd /var/www/peckup/peckup/backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install Python dependencies
pip install -r requirements.txt
```

#### 5.1 Generate Secret Keys

**IMPORTANT**: You need to generate secure random keys for your application.

**Method 1: Using Python (Recommended)**
```bash
# Generate SECRET_KEY
python3 -c "import secrets; print('SECRET_KEY=' + secrets.token_hex(32))"

# Generate JWT_SECRET_KEY
python3 -c "import secrets; print('JWT_SECRET_KEY=' + secrets.token_hex(32))"
```

**Method 2: Using OpenSSL**
```bash
# Generate SECRET_KEY
echo "SECRET_KEY=$(openssl rand -hex 32)"

# Generate JWT_SECRET_KEY
echo "JWT_SECRET_KEY=$(openssl rand -hex 32)"
```

**Method 3: Using the provided script**
```bash
# Run the generator script
cd /var/www/peckup/peckup
python3 generate_secrets.py
# Copy the generated keys
```

**SAVE THESE KEYS!** You'll need them in the next step.

Example output:
```
SECRET_KEY=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2
JWT_SECRET_KEY=z9y8x7w6v5u4t3s2r1q0p9o8n7m6l5k4j3i2h1g0f9e8d7c6b5a4z3y2x1w0v9u8
```

#### 5.2 Create .env File

**IMPORTANT**: The `.env` file is NOT in your Git repository (it's in .gitignore for security reasons). You must create it manually on the VPS.

**Step 1: Navigate to backend directory**
```bash
cd /var/www/peckup/peckup/backend
```

**Step 2: Create the .env file**
```bash
nano .env
```

**Step 3: Copy and paste the following configuration**

Replace ALL CAPS placeholders with your actual values:

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
DB_PASSWORD=PASTE_YOUR_MYSQL_PASSWORD_FROM_STEP_3_HERE

# Upload Configuration
UPLOAD_FOLDER=uploads
MAX_CONTENT_LENGTH=16777216
ALLOWED_EXTENSIONS=png,jpg,jpeg,gif,webp

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
# Note: api.peckup.in doesn't need to be in CORS (it's the API itself)
CORS_ORIGINS=https://peckup.in,https://www.peckup.in,https://admin.peckup.in
CORS_SUPPORTS_CREDENTIALS=True
CORS_MAX_AGE=3600

# Production Settings
DEBUG=False
TESTING=False
```

**Step 4: Save the file**
- Press `Ctrl + X`
- Press `Y` to confirm
- Press `Enter` to save

**Step 5: Verify the file was created**
```bash
# Check file exists
ls -la .env

# View file contents (be careful - contains secrets!)
cat .env

# Set proper permissions (only owner can read/write)
chmod 600 .env
```

**Alternative Method: Create .env using echo commands**

If you prefer, you can create the .env file using commands:

```bash
cd /var/www/peckup/peckup/backend

# Generate keys first
SECRET_KEY=$(python3 -c "import secrets; print(secrets.token_hex(32))")
JWT_SECRET_KEY=$(python3 -c "import secrets; print(secrets.token_hex(32))")

# Replace YOUR_MYSQL_PASSWORD with your actual password
DB_PASSWORD="YOUR_MYSQL_PASSWORD"

# Create .env file
cat > .env << EOF
# Flask Configuration
FLASK_APP=app.py
FLASK_ENV=production
SECRET_KEY=$SECRET_KEY
JWT_SECRET_KEY=$JWT_SECRET_KEY

# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=peckup_db
DB_USER=peckup_user
DB_PASSWORD=$DB_PASSWORD

# Upload Configuration
UPLOAD_FOLDER=uploads
MAX_CONTENT_LENGTH=16777216
ALLOWED_EXTENSIONS=png,jpg,jpeg,gif,webp

# Domain Configuration (Production - Hostinger VPS)
MAIN_DOMAIN=peckup.in
MAIN_URL=https://peckup.in
ADMIN_DOMAIN=admin.peckup.in
ADMIN_URL=https://admin.peckup.in
API_DOMAIN=api.peckup.in
API_URL=https://api.peckup.in

# Upload URL Configuration (Production)
UPLOAD_BASE_URL=https://api.peckup.in/uploads

# CORS Configuration (Production - Only allow your domains)
CORS_ORIGINS=https://peckup.in,https://admin.peckup.in,https://www.peckup.in
CORS_SUPPORTS_CREDENTIALS=True
CORS_MAX_AGE=3600

# Production Settings
DEBUG=False
TESTING=False
EOF

echo "✅ .env file created successfully!"
chmod 600 .env
```

#### 5.3 Initialize Database and Create Admin User

```bash
# Make sure you're in the backend directory with venv activated
cd /var/www/peckup/peckup/backend
source venv/bin/activate

# Initialize database tables
python init_db.py

# Create admin user (follow the prompts)
python create_admin_user.py
```

**When prompted, enter:**
- Admin email (e.g., admin@peckup.in)
- Admin password (use a strong password!)
- Confirm password

**SAVE YOUR ADMIN CREDENTIALS!**

#### 5.4 Test the Backend

```bash
# Test if backend starts without errors
gunicorn --bind 0.0.0.0:5000 app:app

# You should see output like:
# [INFO] Starting gunicorn 21.2.0
# [INFO] Listening at: http://0.0.0.0:5000

# Press Ctrl+C to stop

# Deactivate virtual environment
deactivate
```

### 6. Setup Frontend (React)

```bash
cd /var/www/peckup/peckup

# Install dependencies
npm install

# Create production environment file
nano .env.production
```

Add the following to `.env.production`:
```env
VITE_API_BASE_URL=https://api.peckup.in
VITE_API_PREFIX=/api
VITE_APP_ENV=production
```

```bash
# Build the frontend
npm run build

# The build output will be in the 'dist' folder
```

### 7. Create Systemd Service for Backend

```bash
sudo nano /etc/systemd/system/peckup-backend.service
```

Add the following content:
```ini
[Unit]
Description=Peckup Flask Backend
After=network.target mysql.service

[Service]
Type=notify
User=www-data
Group=www-data
WorkingDirectory=/var/www/peckup/peckup/backend
Environment="PATH=/var/www/peckup/peckup/backend/venv/bin"
ExecStart=/var/www/peckup/peckup/backend/venv/bin/gunicorn --workers 4 --bind 127.0.0.1:5000 --timeout 120 --access-logfile /var/log/peckup/access.log --error-logfile /var/log/peckup/error.log app:app
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

```bash
# Create log directory
sudo mkdir -p /var/log/peckup
sudo chown -R www-data:www-data /var/log/peckup

# Set proper permissions
sudo chown -R www-data:www-data /var/www/peckup/peckup/backend/uploads

# Enable and start the service
sudo systemctl daemon-reload
sudo systemctl enable peckup-backend
sudo systemctl start peckup-backend
sudo systemctl status peckup-backend
```

### 8. Configure Nginx

#### Main Website (peckup.in)
```bash
sudo nano /etc/nginx/sites-available/peckup.in
```

Add the following:
```nginx
server {
    listen 80;
    server_name peckup.in www.peckup.in;
    
    root /var/www/peckup/peckup/dist;
    index index.html;
    
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/javascript application/json;
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    
    # Static files caching
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # React Router - serve index.html for all routes
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Prevent access to hidden files
    location ~ /\. {
        deny all;
    }
}
```

#### Admin Dashboard (admin.peckup.in)
```bash
sudo nano /etc/nginx/sites-available/admin.peckup.in
```

Add the following:
```nginx
server {
    listen 80;
    server_name admin.peckup.in;
    
    root /var/www/peckup/peckup/dist;
    index index.html;
    
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/javascript application/json;
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    
    # Static files caching
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # React Router - serve index.html for all routes
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Prevent access to hidden files
    location ~ /\. {
        deny all;
    }
}
```

#### API Backend (api.peckup.in)
```bash
sudo nano /etc/nginx/sites-available/api.peckup.in
```

Add the following:
```nginx
server {
    listen 80;
    server_name api.peckup.in;
    
    client_max_body_size 20M;
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    
    # API endpoints
    location / {
        proxy_pass http://127.0.0.1:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 120s;
        proxy_connect_timeout 120s;
    }
    
    # Serve uploaded files directly
    location /uploads/ {
        alias /var/www/peckup/peckup/backend/uploads/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

#### Enable sites
```bash
# Enable sites
sudo ln -s /etc/nginx/sites-available/peckup.in /etc/nginx/sites-enabled/
sudo ln -s /etc/nginx/sites-available/admin.peckup.in /etc/nginx/sites-enabled/
sudo ln -s /etc/nginx/sites-available/api.peckup.in /etc/nginx/sites-enabled/

# Remove default site
sudo rm /etc/nginx/sites-enabled/default

# Test Nginx configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

### 9. Configure DNS in Hostinger

Login to your Hostinger account and configure DNS records:

1. Go to Domains → Manage → DNS/Name Servers
2. Add the following A records:

```
Type    Name    Value               TTL
A       @       your-vps-ip         14400
A       www     your-vps-ip         14400
A       admin   your-vps-ip         14400
A       api     your-vps-ip         14400
```

Wait 5-30 minutes for DNS propagation.

### 10. Setup SSL Certificates (HTTPS)

```bash
# Install SSL certificates for all domains
sudo certbot --nginx -d peckup.in -d www.peckup.in
sudo certbot --nginx -d admin.peckup.in
sudo certbot --nginx -d api.peckup.in

# Test auto-renewal
sudo certbot renew --dry-run

# Certificates will auto-renew via cron
```

### 11. Configure Firewall

```bash
# Allow SSH, HTTP, and HTTPS
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
sudo ufw status
```

### 12. Setup Automatic Backups

```bash
# Create backup script
sudo nano /usr/local/bin/backup-peckup.sh
```

Add the following:
```bash
#!/bin/bash
BACKUP_DIR="/var/backups/peckup"
DATE=$(date +%Y%m%d_%H%M%S)

# Create backup directory
mkdir -p $BACKUP_DIR

# Backup database
mysqldump -u peckup_user -p'your_strong_password_here' peckup_db | gzip > $BACKUP_DIR/db_backup_$DATE.sql.gz

# Backup uploads
tar -czf $BACKUP_DIR/uploads_backup_$DATE.tar.gz /var/www/peckup/peckup/backend/uploads

# Keep only last 7 days of backups
find $BACKUP_DIR -name "*.gz" -mtime +7 -delete

echo "Backup completed: $DATE"
```

```bash
# Make script executable
sudo chmod +x /usr/local/bin/backup-peckup.sh

# Add to crontab (daily at 2 AM)
sudo crontab -e
# Add this line:
0 2 * * * /usr/local/bin/backup-peckup.sh >> /var/log/peckup/backup.log 2>&1
```

## 🔍 Verification

### Check Services
```bash
# Check backend service
sudo systemctl status peckup-backend

# Check Nginx
sudo systemctl status nginx

# Check MySQL
sudo systemctl status mysql

# View backend logs
sudo journalctl -u peckup-backend -f

# View Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### Test URLs
- Main Website: https://peckup.in
- Admin Dashboard: https://admin.peckup.in/admin/login
- API Health: https://api.peckup.in/api/health

## 🔄 Deployment Updates

When you need to update the application:

```bash
cd /var/www/peckup/peckup

# Pull latest changes
git pull origin main

# Update backend
cd backend
source venv/bin/activate
pip install -r requirements.txt
sudo systemctl restart peckup-backend

# Update frontend
cd ..
npm install
npm run build

# Restart services
sudo systemctl restart nginx
```

## 🛠️ Troubleshooting

### Backend not starting
```bash
# Check logs
sudo journalctl -u peckup-backend -n 50

# Check if port 5000 is in use
sudo netstat -tulpn | grep 5000

# Restart service
sudo systemctl restart peckup-backend
```

### Frontend not loading
```bash
# Check Nginx configuration
sudo nginx -t

# Check Nginx error logs
sudo tail -f /var/log/nginx/error.log

# Rebuild frontend
cd /var/www/peckup/peckup
npm run build
```

### Database connection issues
```bash
# Check MySQL status
sudo systemctl status mysql

# Test database connection
mysql -u peckup_user -p peckup_db
```

### SSL certificate issues
```bash
# Renew certificates manually
sudo certbot renew

# Check certificate status
sudo certbot certificates
```

## 📊 Monitoring

### Setup basic monitoring
```bash
# Install htop for system monitoring
sudo apt install -y htop

# Monitor system resources
htop

# Monitor disk usage
df -h

# Monitor backend process
ps aux | grep gunicorn
```

## 🔐 Security Best Practices

1. **Change default passwords** in `.env` file
2. **Keep system updated**: `sudo apt update && sudo apt upgrade`
3. **Monitor logs regularly**: Check `/var/log/peckup/` and `/var/log/nginx/`
4. **Backup regularly**: Ensure backup script is running
5. **Use strong JWT secrets**: Generate with `openssl rand -hex 32`
6. **Limit SSH access**: Consider using SSH keys only
7. **Enable fail2ban**: `sudo apt install fail2ban`

## 📞 Support

For issues or questions:
- Check logs in `/var/log/peckup/`
- Review Nginx logs in `/var/log/nginx/`
- Check systemd service status: `sudo systemctl status peckup-backend`

## 🎉 Deployment Complete!

Your Peckup e-commerce application should now be live at:
- 🌐 Main Site: https://peckup.in
- 👨‍💼 Admin: https://admin.peckup.in
- 🔌 API: https://api.peckup.in

Happy selling! 🚀
