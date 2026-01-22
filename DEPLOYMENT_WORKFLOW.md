# 🚀 Complete Deployment Workflow

This document provides a complete overview of deploying Peckup from development to production.

## 📊 Deployment Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    LOCAL DEVELOPMENT                             │
│                                                                  │
│  1. Write code                                                   │
│  2. Test locally with .env (localhost URLs)                     │
│  3. Commit code to Git                                          │
│  4. Push to GitHub                                              │
│     ⚠️  .env is NOT pushed (in .gitignore)                      │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                    GITHUB REPOSITORY                             │
│                                                                  │
│  ✓ Source code                                                  │
│  ✓ Configuration templates (.env.production)                   │
│  ✓ Deployment scripts                                           │
│  ✗ .env file (excluded by .gitignore)                          │
│  ✗ Secrets and passwords                                        │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                    HOSTINGER VPS                                 │
│                                                                  │
│  1. Clone repository from GitHub                                │
│  2. ⚠️  MANUALLY create .env file (not in Git!)                 │
│  3. Generate secret keys                                        │
│  4. Configure production URLs                                   │
│  5. Install dependencies                                        │
│  6. Build frontend                                              │
│  7. Start services                                              │
│  8. Configure Nginx                                             │
│  9. Install SSL certificates                                    │
└─────────────────────────────────────────────────────────────────┘
```

## 🔄 Step-by-Step Workflow

### Phase 1: Local Development

#### 1.1 Setup Local Environment

```bash
# Clone repository
git clone https://github.com/yourusername/peckup.git
cd peckup

# Create local .env file
cd backend
cp .env.development .env

# Update with local settings
nano .env
```

#### 1.2 Local .env Configuration

```env
FLASK_ENV=development
API_URL=http://localhost:5000
CORS_ORIGINS=http://localhost:5173,http://localhost:5174
DEBUG=True
```

#### 1.3 Test Locally

```bash
# Start backend
cd backend
source venv/bin/activate
python app.py

# Start frontend (new terminal)
npm run dev
```

#### 1.4 Commit and Push

```bash
# Add changes
git add .

# Commit (note: .env is automatically excluded)
git commit -m "Your commit message"

# Push to GitHub
git push origin main
```

**✅ What gets pushed:**
- Source code
- Configuration templates
- Deployment scripts
- Documentation

**❌ What does NOT get pushed:**
- `.env` file
- `node_modules/`
- `venv/`
- Uploaded files
- Database files

---

### Phase 2: VPS Preparation

#### 2.1 Initial Server Setup

```bash
# Connect to VPS
ssh root@your-vps-ip

# Run setup script
chmod +x setup-server.sh
sudo ./setup-server.sh
```

This installs:
- Node.js
- Python
- MySQL
- Nginx
- Certbot

#### 2.2 Configure DNS

In Hostinger control panel, add A records:
```
@       → your-vps-ip
www     → your-vps-ip
admin   → your-vps-ip
api     → your-vps-ip
```

Wait 10-30 minutes for DNS propagation.

---

### Phase 3: Deploy Application

#### 3.1 Clone Repository

```bash
cd /var/www/peckup
git clone https://github.com/yourusername/peckup.git peckup
cd peckup
```

**⚠️ IMPORTANT**: At this point, there is NO `.env` file because it's not in Git!

#### 3.2 Create .env File (CRITICAL STEP)

This is the most important step - the .env file must be created manually.

**Option A: Manual Creation**

```bash
cd /var/www/peckup/peckup/backend

# Generate keys
python3 -c "import secrets; print('SECRET_KEY=' + secrets.token_hex(32))"
python3 -c "import secrets; print('JWT_SECRET_KEY=' + secrets.token_hex(32))"

# Create file
nano .env
```

Paste configuration:
```env
FLASK_APP=app.py
FLASK_ENV=production
SECRET_KEY=<paste-generated-key>
JWT_SECRET_KEY=<paste-generated-key>
DB_HOST=localhost
DB_PORT=3306
DB_NAME=peckup_db
DB_USER=peckup_user
DB_PASSWORD=<your-mysql-password>
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
CORS_ORIGINS=https://peckup.in,https://admin.peckup.in,https://www.peckup.in
CORS_SUPPORTS_CREDENTIALS=True
CORS_MAX_AGE=3600
DEBUG=False
TESTING=False
```

Save: `Ctrl+X`, `Y`, `Enter`

**Option B: Automated Script**

```bash
cd /var/www/peckup/peckup/backend

# Set your MySQL password
DB_PASSWORD="your_mysql_password"

# Run automated creation
SECRET_KEY=$(python3 -c "import secrets; print(secrets.token_hex(32))")
JWT_SECRET_KEY=$(python3 -c "import secrets; print(secrets.token_hex(32))")

cat > .env << EOF
FLASK_APP=app.py
FLASK_ENV=production
SECRET_KEY=$SECRET_KEY
JWT_SECRET_KEY=$JWT_SECRET_KEY
DB_HOST=localhost
DB_PORT=3306
DB_NAME=peckup_db
DB_USER=peckup_user
DB_PASSWORD=$DB_PASSWORD
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
CORS_ORIGINS=https://peckup.in,https://admin.peckup.in,https://www.peckup.in
CORS_SUPPORTS_CREDENTIALS=True
CORS_MAX_AGE=3600
DEBUG=False
TESTING=False
EOF

chmod 600 .env
echo "✅ .env created successfully!"
```

#### 3.3 Verify .env File

```bash
# Check file exists
ls -la backend/.env

# Verify content (be careful - contains secrets!)
cat backend/.env

# Test configuration loads
cd backend
source venv/bin/activate
python3 -c "from config import Config; print('API_URL:', Config.API_URL)"
```

Expected output: `API_URL: https://api.peckup.in`

#### 3.4 Setup Backend

```bash
cd /var/www/peckup/peckup/backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Initialize database
python init_db.py

# Create admin user
python create_admin_user.py

deactivate
```

#### 3.5 Build Frontend

```bash
cd /var/www/peckup/peckup

# Install dependencies
npm install

# Build for production
npm run build
```

#### 3.6 Configure Services

```bash
# Copy systemd service
sudo cp systemd/peckup-backend.service /etc/systemd/system/

# Set permissions
sudo chown -R www-data:www-data /var/www/peckup/peckup/backend/uploads
sudo mkdir -p /var/log/peckup
sudo chown -R www-data:www-data /var/log/peckup

# Start backend service
sudo systemctl daemon-reload
sudo systemctl enable peckup-backend
sudo systemctl start peckup-backend
sudo systemctl status peckup-backend
```

#### 3.7 Configure Nginx

```bash
# Copy Nginx configs
sudo cp nginx-configs/*.conf /etc/nginx/sites-available/

# Enable sites
sudo ln -s /etc/nginx/sites-available/peckup.in.conf /etc/nginx/sites-enabled/
sudo ln -s /etc/nginx/sites-available/admin.peckup.in.conf /etc/nginx/sites-enabled/
sudo ln -s /etc/nginx/sites-available/api.peckup.in.conf /etc/nginx/sites-enabled/

# Remove default
sudo rm /etc/nginx/sites-enabled/default

# Test and restart
sudo nginx -t
sudo systemctl restart nginx
```

#### 3.8 Install SSL Certificates

```bash
# Install certificates
sudo certbot --nginx -d peckup.in -d www.peckup.in
sudo certbot --nginx -d admin.peckup.in
sudo certbot --nginx -d api.peckup.in

# Test auto-renewal
sudo certbot renew --dry-run
```

---

### Phase 4: Verification

#### 4.1 Test Services

```bash
# Check backend
sudo systemctl status peckup-backend

# Check Nginx
sudo systemctl status nginx

# Test API
curl https://api.peckup.in/api/health
```

#### 4.2 Test Websites

- Main: https://peckup.in
- Admin: https://admin.peckup.in/admin/login
- API: https://api.peckup.in/api/health

#### 4.3 Test Functionality

- [ ] Browse products
- [ ] Add to cart
- [ ] User registration
- [ ] User login
- [ ] Admin login
- [ ] Upload product image
- [ ] Create order

---

## 🔄 Update Workflow

When you need to update the application:

### 1. Local Changes

```bash
# Make changes locally
# Test locally
# Commit and push
git add .
git commit -m "Update message"
git push origin main
```

### 2. Deploy to VPS

```bash
# Connect to VPS
ssh root@your-vps-ip

# Navigate to project
cd /var/www/peckup/peckup

# Pull latest changes
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

**⚠️ IMPORTANT**: The `.env` file is NOT affected by `git pull` because it's not in the repository!

### 3. Quick Update Script

Or use the deploy script:

```bash
cd /var/www/peckup/peckup
sudo ./deploy.sh
```

---

## 🔐 Security Checklist

### .env File Security

- [ ] `.env` is in `.gitignore`
- [ ] `.env` has 600 permissions (`chmod 600`)
- [ ] `.env` contains strong random keys
- [ ] `.env` is backed up securely (password manager)
- [ ] `.env` is never committed to Git
- [ ] `.env` is never shared publicly

### Production Configuration

- [ ] `DEBUG=False`
- [ ] `FLASK_ENV=production`
- [ ] Strong `SECRET_KEY` (64+ characters)
- [ ] Strong `JWT_SECRET_KEY` (64+ characters)
- [ ] Strong database password
- [ ] `API_URL=https://api.peckup.in` (NOT localhost)
- [ ] `CORS_ORIGINS` does NOT include localhost
- [ ] All URLs use HTTPS

---

## 📋 Quick Reference

### Files NOT in Git (must create manually)

| File | Location | Created When | Contains |
|------|----------|--------------|----------|
| `.env` | `backend/.env` | On VPS | Secrets, passwords, production URLs |
| `node_modules/` | Root | After `npm install` | Node dependencies |
| `venv/` | `backend/venv/` | After `python3 -m venv venv` | Python dependencies |
| `dist/` | Root | After `npm run build` | Built frontend |
| `uploads/` | `backend/uploads/` | Runtime | Uploaded files |

### Files IN Git

| File | Purpose |
|------|---------|
| `.env.production` | Template for production .env |
| `.env.development` | Template for development .env |
| `.gitignore` | Excludes .env and sensitive files |
| `HOSTINGER_DEPLOYMENT.md` | Full deployment guide |
| `CREATE_ENV_ON_VPS.md` | Guide for creating .env |
| All source code | Application code |

---

## 🚨 Common Mistakes

### ❌ Mistake 1: Forgetting to create .env

**Symptom**: Backend won't start, "SECRET_KEY not found" error

**Solution**: Create .env file manually on VPS (see Phase 3.2)

### ❌ Mistake 2: Using localhost URLs in production .env

**Symptom**: API not accessible, CORS errors

**Solution**: Use `https://api.peckup.in` not `http://localhost:5000`

### ❌ Mistake 3: Committing .env to Git

**Symptom**: Secrets exposed publicly

**Solution**: 
```bash
# Remove from Git
git rm --cached backend/.env
git commit -m "Remove .env from Git"
git push

# Verify .gitignore includes .env
cat .gitignore | grep .env
```

### ❌ Mistake 4: Not setting proper permissions

**Symptom**: Security warning, unauthorized access

**Solution**:
```bash
chmod 600 backend/.env
sudo chown www-data:www-data backend/.env
```

---

## 📞 Need Help?

### Deployment Issues

1. Check `.env` file exists: `ls -la backend/.env`
2. Verify configuration: `cat backend/.env`
3. Check logs: `sudo journalctl -u peckup-backend -n 50`
4. Review: `CREATE_ENV_ON_VPS.md`

### .env File Issues

1. Read: `CREATE_ENV_ON_VPS.md`
2. Verify: `ENV_VARIABLES_GUIDE.md`
3. Compare: `ENVIRONMENT_SETUP_GUIDE.md`

### Full Deployment

1. Follow: `QUICK_START.md` (simplified)
2. Or: `HOSTINGER_DEPLOYMENT.md` (detailed)

---

## 🎉 Success Criteria

Your deployment is successful when:

1. ✅ Code is pushed to GitHub (without .env)
2. ✅ Code is cloned on VPS
3. ✅ .env file created manually on VPS
4. ✅ All services running
5. ✅ All three domains accessible via HTTPS
6. ✅ API responds correctly
7. ✅ CORS working properly
8. ✅ Images uploading and displaying
9. ✅ No errors in logs

**Remember**: The .env file is the bridge between your code (in Git) and your production environment (on VPS). It must be created manually on the VPS!
