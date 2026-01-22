# 🚀 Final Production Deployment Guide - Peckup

This is the complete, tested, step-by-step guide to deploy Peckup on Hostinger VPS.

## 📋 Prerequisites

- ✅ Hostinger VPS with Ubuntu (20.04/22.04)
- ✅ Domains: peckup.in, admin.peckup.in, api.peckup.in
- ✅ SSH access to VPS
- ✅ VPS IP: 31.97.231.188

## 🎯 Deployment Overview

```
Local Machine → GitHub → VPS → Build → Configure → Deploy → SSL → Live!
```

---

## PART 1: LOCAL SETUP (On Your Computer)

### Step 1.1: Verify Project Structure

```bash
# Check logo and favicon are in public folder
ls public/logo.png
ls public/favicon.png

# If not, create public folder and copy files
mkdir -p public
cp logo.png public/
cp favicon.png public/
```

### Step 1.2: Test Build Locally

```bash
# Install dependencies
npm install

# Build for production
npm run build

# Verify dist folder has assets
ls dist/
ls dist/assets/

# Check if logo is accessible
ls dist/logo.png  # Should exist
```

### Step 1.3: Commit and Push to GitHub

```bash
# Add all changes
git add .

# Commit
git commit -m "Production deployment ready"

# Push to GitHub
git push origin main
```

**✅ Checkpoint**: Code is on GitHub, ready to deploy

---

## PART 2: DNS CONFIGURATION (Hostinger Panel)

### Step 2.1: Configure DNS Records

Login to Hostinger → Domains → peckup.in → DNS/Name Servers

**Add these A records:**

| Type | Name | Content | TTL |
|------|------|---------|-----|
| A | @ | 31.97.231.188 | 14400 |
| A | admin | 31.97.231.188 | 14400 |
| A | api | 31.97.231.188 | 14400 |
| CNAME | www | peckup.in | 14400 |

### Step 2.2: Wait for DNS Propagation

```bash
# Wait 10-30 minutes, then test from your computer:
ping peckup.in
ping admin.peckup.in
ping api.peckup.in

# All should respond with: 31.97.231.188
```

**✅ Checkpoint**: DNS is configured and propagated

---

## PART 3: VPS INITIAL SETUP

### Step 3.1: Connect to VPS

```bash
ssh root@31.97.231.188
```

### Step 3.2: Update System

```bash
sudo apt update && sudo apt upgrade -y
```

### Step 3.3: Install Required Software

```bash
# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Verify
node --version  # Should show v18.x.x
npm --version

# Install Python 3
sudo apt install -y python3 python3-pip python3-venv

# Verify
python3 --version

# Install Nginx
sudo apt install -y nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# Install MySQL
sudo apt install -y mysql-server
sudo systemctl start mysql
sudo systemctl enable mysql

# Install Certbot for SSL
sudo apt install -y certbot python3-certbot-nginx
```

**✅ Checkpoint**: All software installed

### Step 3.4: Configure MySQL

```bash
# Secure MySQL
sudo mysql_secure_installation
# Answer: Y to all questions
# Set root password when prompted

# Create database and user
sudo mysql << 'EOF'
CREATE DATABASE peckup_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'peckup_user'@'localhost' IDENTIFIED BY 'Peckup%40123';
GRANT ALL PRIVILEGES ON peckup_db.* TO 'peckup_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
EOF

# Test connection
mysql -u peckup_user -p'Peckup@123' peckup_db
# Type: EXIT;
```

**✅ Checkpoint**: Database created and accessible

---

## PART 4: DEPLOY APPLICATION CODE

### Step 4.1: Create Project Directory

```bash
sudo mkdir -p /var/www/peckup
sudo chown -R $USER:$USER /var/www/peckup
cd /var/www/peckup
```

### Step 4.2: Clone Repository

```bash
git clone https://github.com/yourusername/peckup.git peckup
cd peckup
```

**✅ Checkpoint**: Code is on VPS

---

## PART 5: CONFIGURE BACKEND

### Step 5.1: Navigate to Backend

```bash
cd /var/www/peckup/peckup/backend
```

### Step 5.2: Generate Secret Keys

```bash
# Generate SECRET_KEY
python3 -c "import secrets; print('SECRET_KEY=' + secrets.token_hex(32))"

# Generate JWT_SECRET_KEY
python3 -c "import secrets; print('JWT_SECRET_KEY=' + secrets.token_hex(32))"

# SAVE THESE KEYS! You'll need them in the next step
```

### Step 5.3: Create .env File

```bash
nano .env
```

**Paste this configuration** (replace placeholders with your actual values):

```env
FLASK_APP=app.py
FLASK_ENV=production
SECRET_KEY=PASTE_YOUR_GENERATED_SECRET_KEY_HERE
JWT_SECRET_KEY=PASTE_YOUR_GENERATED_JWT_SECRET_KEY_HERE
DB_HOST=localhost
DB_PORT=3306
DB_NAME=peckup_db
DB_USER=peckup_user
DB_PASSWORD=Peckup%40123
UPLOAD_FOLDER=uploads
MAX_CONTENT_LENGTH=16777216
ALLOWED_EXTENSIONS=png,jpg,jpeg,gif,webp
MAIN_DOMAIN=peckup.in
MAIN_URL=https://peckup.in
ADMIN_DOMAIN=admin.peckup.in
ADMIN_URL=https://admin.peckup.in
API_DOMAIN=api.peckup.in
API_URL=https://api.peckup.in
UPLOAD_BASE_URL=https://api.peckup.in/uploads
CORS_ORIGINS=https://peckup.in,https://www.peckup.in,https://admin.peckup.in
CORS_SUPPORTS_CREDENTIALS=True
CORS_MAX_AGE=3600
DEBUG=False
TESTING=False
```

**Save**: `Ctrl+X`, `Y`, `Enter`

### Step 5.4: Set Permissions on .env

```bash
chmod 640 .env
```

### Step 5.5: Create Virtual Environment

```bash
python3 -m venv venv
source venv/bin/activate
```

### Step 5.6: Install Python Dependencies

```bash
pip install -r requirements.txt
```

### Step 5.7: Setup Database (Automated)

```bash
python setup_database.py
```

**This script will:**
1. ✅ Test MySQL connection
2. ✅ Create database if not exists
3. ✅ Create all tables
4. ✅ Verify tables were created
5. ✅ Create default sections
6. ✅ Show summary

**Expected output:**
```
======================================================================
Peckup Database Setup
======================================================================

✓ .env file found
ℹ Database Configuration:
  Host: localhost:3306
  Database: peckup_db
  User: peckup_user
  Password: ************

ℹ Testing MySQL connection...
✓ MySQL server is accessible
ℹ Checking if database 'peckup_db' exists...
✓ Database 'peckup_db' already exists
ℹ Creating database tables...
✓ Created 9 tables:
  • addresses
  • analytics
  • cart_items
  • order_items
  • orders
  • products
  • sections
  • users
  • wishlist_items
ℹ Verifying database tables...
✓ All required tables exist
ℹ Creating default sections...
✓ Created 3 default sections

======================================================================
Database Setup Summary
======================================================================

Database: peckup_db
Host: localhost:3306
User: peckup_user
Tables: 9

Table Statistics:
--------------------------------------------------
  addresses                     0 rows
  analytics                     1 rows
  cart_items                    0 rows
  order_items                   0 rows
  orders                        0 rows
  products                      0 rows
  sections                      3 rows
  users                         0 rows
  wishlist_items                0 rows

======================================================================
Database Setup Complete!
======================================================================

✓ Database is ready to use

ℹ Next steps:
ℹ   1. Create admin user: python create_admin_user.py
ℹ   2. Start the application: python app.py
```

**If you see errors:**

```bash
# Check MySQL is running
sudo systemctl status mysql

# Test connection manually
mysql -u peckup_user -p'Peckup@123' peckup_db

# Check .env file
cat .env | grep DB_
```

### Step 5.8: Create Admin User

```bash
python create_admin_user.py
```

**Enter when prompted:**
- Email: `admin@peckup.in`
- Password: (choose a strong password)
- Confirm password

**SAVE YOUR ADMIN CREDENTIALS!**

### Step 5.9: Test Backend

```bash
# Test if app starts
python app.py
# Should see: "Running on http://0.0.0.0:5000"
# Press Ctrl+C to stop

deactivate
```

**✅ Checkpoint**: Backend configured and database initialized

---

## PART 6: BUILD FRONTEND

### Step 6.1: Navigate to Project Root

```bash
cd /var/www/peckup/peckup
```

### Step 6.2: Install Node Dependencies

```bash
npm install
```

### Step 6.3: Build Frontend

```bash
npm run build
```

**Expected output**: `✓ built in X.XXs`

### Step 6.4: Verify Build

```bash
ls -la dist/
ls -la dist/assets/
ls -la dist/logo.png  # Should exist
ls -la dist/favicon.png  # Should exist
```

**✅ Checkpoint**: Frontend built successfully

---

## PART 7: CONFIGURE SYSTEMD SERVICE

### Step 7.1: Create Log Directory

```bash
sudo mkdir -p /var/log/peckup
sudo touch /var/log/peckup/access.log
sudo touch /var/log/peckup/error.log
sudo chown -R www-data:www-data /var/log/peckup
sudo chmod -R 755 /var/log/peckup
```

### Step 7.2: Set Permissions

```bash
# Backend directory
sudo chown -R www-data:www-data /var/www/peckup/peckup/backend
sudo chmod -R 755 /var/www/peckup/peckup/backend

# .env file (more restrictive)
sudo chown www-data:www-data /var/www/peckup/peckup/backend/.env
sudo chmod 640 /var/www/peckup/peckup/backend/.env

# Uploads directory (writable)
sudo mkdir -p /var/www/peckup/peckup/backend/uploads/products
sudo mkdir -p /var/www/peckup/peckup/backend/uploads/bulk_images
sudo chown -R www-data:www-data /var/www/peckup/peckup/backend/uploads
sudo chmod -R 775 /var/www/peckup/peckup/backend/uploads

# Frontend dist
sudo chown -R www-data:www-data /var/www/peckup/peckup/dist
sudo chmod -R 755 /var/www/peckup/peckup/dist
```

### Step 7.3: Copy Systemd Service File

```bash
sudo cp /var/www/peckup/peckup/systemd/peckup-backend.service /etc/systemd/system/
```

### Step 7.4: Start Backend Service

```bash
sudo systemctl daemon-reload
sudo systemctl enable peckup-backend
sudo systemctl start peckup-backend
```

### Step 7.5: Verify Backend is Running

```bash
sudo systemctl status peckup-backend
```

**Expected**: `Active: active (running)` in green

**If failed**, check logs:
```bash
sudo journalctl -u peckup-backend -n 50
```

**✅ Checkpoint**: Backend service running

---

## PART 8: CONFIGURE NGINX

### Step 8.1: Copy Nginx Configurations

```bash
sudo cp /var/www/peckup/peckup/nginx-configs/peckup.in.conf /etc/nginx/sites-available/
sudo cp /var/www/peckup/peckup/nginx-configs/admin.peckup.in.conf /etc/nginx/sites-available/
sudo cp /var/www/peckup/peckup/nginx-configs/api.peckup.in.conf /etc/nginx/sites-available/
```

### Step 8.2: Enable Sites

```bash
sudo ln -s /etc/nginx/sites-available/peckup.in.conf /etc/nginx/sites-enabled/
sudo ln -s /etc/nginx/sites-available/admin.peckup.in.conf /etc/nginx/sites-enabled/
sudo ln -s /etc/nginx/sites-available/api.peckup.in.conf /etc/nginx/sites-enabled/
```

### Step 8.3: Remove Default Site

```bash
sudo rm /etc/nginx/sites-enabled/default
```

### Step 8.4: Test Nginx Configuration

```bash
sudo nginx -t
```

**Expected**: `syntax is ok` and `test is successful`

### Step 8.5: Restart Nginx

```bash
sudo systemctl restart nginx
```

### Step 8.6: Verify Nginx is Running

```bash
sudo systemctl status nginx
```

**Expected**: `Active: active (running)` in green

**✅ Checkpoint**: Nginx configured and running

---

## PART 9: INSTALL SSL CERTIFICATES

### Step 9.1: Install SSL for Main Domain

```bash
sudo certbot --nginx -d peckup.in -d www.peckup.in
```

**When prompted:**
- Enter email address
- Agree to terms: `Y`
- Share email: `N` (optional)
- Redirect HTTP to HTTPS: `2` (recommended)

### Step 9.2: Install SSL for Admin Domain

```bash
sudo certbot --nginx -d admin.peckup.in
```

### Step 9.3: Install SSL for API Domain

```bash
sudo certbot --nginx -d api.peckup.in
```

### Step 9.4: Test Auto-Renewal

```bash
sudo certbot renew --dry-run
```

**Expected**: `Congratulations, all simulated renewals succeeded`

**✅ Checkpoint**: SSL certificates installed

---

## PART 10: CONFIGURE FIREWALL

```bash
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
sudo ufw status
```

**✅ Checkpoint**: Firewall configured

---

## PART 11: VERIFICATION & TESTING

### Step 11.1: Test Backend API

```bash
curl https://api.peckup.in/api/health
```

**Expected**: `{"status":"ok","message":"Peckup API is running"}`

### Step 11.2: Test Main Website

Open browser: `https://peckup.in`

**Verify:**
- ✅ Website loads
- ✅ Logo displays
- ✅ No console errors (F12)
- ✅ Products load (if any)

### Step 11.3: Test Admin Dashboard

Open browser: `https://admin.peckup.in`

**Verify:**
- ✅ Redirects to `/admin/login`
- ✅ Logo displays
- ✅ Can login with admin credentials
- ✅ Dashboard loads

### Step 11.4: Test Image Upload

1. Login to admin dashboard
2. Go to Products
3. Try to add a product with image
4. Verify image uploads and displays

### Step 11.5: Check Service Status

```bash
# Backend
sudo systemctl status peckup-backend

# Nginx
sudo systemctl status nginx

# MySQL
sudo systemctl status mysql
```

**All should show**: `Active: active (running)`

### Step 11.6: Check Logs for Errors

```bash
# Backend logs
sudo journalctl -u peckup-backend -n 20

# Nginx error logs
sudo tail -20 /var/log/nginx/error.log

# Application logs
sudo tail -20 /var/log/peckup/error.log
```

**Expected**: No critical errors

**✅ Checkpoint**: All systems operational

---

## PART 12: SETUP AUTOMATED BACKUPS

### Step 12.1: Update Backup Script

```bash
sudo nano /var/www/peckup/peckup/scripts/backup-peckup.sh
```

Update the password:
```bash
DB_PASSWORD="Peckup@123"
```

Save: `Ctrl+X`, `Y`, `Enter`

### Step 12.2: Make Script Executable

```bash
sudo chmod +x /var/www/peckup/peckup/scripts/backup-peckup.sh
sudo cp /var/www/peckup/peckup/scripts/backup-peckup.sh /usr/local/bin/
```

### Step 12.3: Test Backup

```bash
sudo /usr/local/bin/backup-peckup.sh
```

**Verify backup files created:**
```bash
ls -lh /var/backups/peckup/
```

### Step 12.4: Schedule Daily Backups

```bash
sudo crontab -e
```

Add this line:
```
0 2 * * * /usr/local/bin/backup-peckup.sh >> /var/log/peckup/backup.log 2>&1
```

Save and exit.

**✅ Checkpoint**: Backups configured

---

## 🎉 DEPLOYMENT COMPLETE!

Your Peckup e-commerce application is now live!

### 🌐 Access Your Application

- **Main Website**: https://peckup.in
- **Admin Dashboard**: https://admin.peckup.in
- **API Backend**: https://api.peckup.in

### 📊 Monitor Your Application

```bash
# Check all services
sudo systemctl status peckup-backend nginx mysql

# View live logs
sudo journalctl -u peckup-backend -f

# Monitor system resources
htop
```

### 🔄 Future Updates

When you need to update your application:

```bash
cd /var/www/peckup/peckup
git pull origin main
npm install
npm run build
cd backend
source venv/bin/activate
pip install -r requirements.txt
deactivate
sudo systemctl restart peckup-backend
sudo systemctl restart nginx
```

---

## 🚨 Troubleshooting

### Backend Not Starting

```bash
# Check logs
sudo journalctl -u peckup-backend -n 50

# Check .env file
cat /var/www/peckup/peckup/backend/.env

# Test manually
cd /var/www/peckup/peckup/backend
source venv/bin/activate
python app.py
```

### Images Not Loading

```bash
# Check if logo exists in dist
ls -la /var/www/peckup/peckup/dist/logo.png

# Check permissions
ls -la /var/www/peckup/peckup/dist/

# Rebuild if needed
cd /var/www/peckup/peckup
npm run build
sudo chown -R www-data:www-data dist/
```

### CORS Errors

```bash
# Check CORS configuration
grep CORS_ORIGINS /var/www/peckup/peckup/backend/.env

# Should be:
# CORS_ORIGINS=https://peckup.in,https://www.peckup.in,https://admin.peckup.in

# Restart backend
sudo systemctl restart peckup-backend
```

### SSL Certificate Issues

```bash
# Check certificates
sudo certbot certificates

# Renew manually
sudo certbot renew

# Check Nginx config
sudo nginx -t
```

---

## 📝 Important Notes

1. **Save your credentials securely:**
   - MySQL root password
   - Database password: `Peckup@123`
   - Admin email and password
   - SECRET_KEY and JWT_SECRET_KEY

2. **Regular maintenance:**
   - Update system packages monthly
   - Check logs weekly
   - Monitor disk space
   - Review backups

3. **Security:**
   - Change default passwords
   - Keep software updated
   - Monitor access logs
   - Use strong passwords

---

## ✅ Final Checklist

- [ ] DNS configured and propagated
- [ ] All software installed
- [ ] Database created and accessible
- [ ] Backend .env file configured
- [ ] Frontend built successfully
- [ ] Backend service running
- [ ] Nginx configured and running
- [ ] SSL certificates installed
- [ ] Firewall configured
- [ ] All three domains accessible via HTTPS
- [ ] Logo and images loading
- [ ] Admin login working
- [ ] API responding
- [ ] Backups scheduled
- [ ] Credentials saved securely

**If all checked ✅ - Congratulations! Your deployment is complete! 🎉**
