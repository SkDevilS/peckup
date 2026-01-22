# 📖 READ THIS FIRST - Peckup Deployment Guide

## 🎯 Quick Navigation

Choose the guide that matches your needs:

### 🚀 For Quick Deployment
**[QUICK_START.md](QUICK_START.md)** - Fast deployment in ~30 minutes

### 📚 For Detailed Instructions
**[HOSTINGER_DEPLOYMENT.md](HOSTINGER_DEPLOYMENT.md)** - Complete step-by-step guide

### 🔐 For Creating .env File
**[CREATE_ENV_ON_VPS.md](CREATE_ENV_ON_VPS.md)** - How to create .env on production

### 🔄 For Understanding Workflow
**[DEPLOYMENT_WORKFLOW.md](DEPLOYMENT_WORKFLOW.md)** - Complete deployment process

---

## ⚠️ CRITICAL: About the .env File

### Why is this important?

The `.env` file contains sensitive information (passwords, secret keys) and is **NOT included in Git** for security reasons.

### What you need to know:

```
┌─────────────────────────────────────────────────────────────┐
│  ❌ .env file is NOT in GitHub                              │
│  ✅ .env file is in .gitignore                              │
│  ✅ You MUST create .env manually on VPS                    │
│  ✅ Templates are provided (.env.production)                │
│  ✅ NO hardcoded localhost - all URLs from environment      │
└─────────────────────────────────────────────────────────────┘
```

### The Process:

1. **On Local Machine**: 
   - Write code
   - Test with local .env (localhost URLs)
   - Push code to GitHub
   - ⚠️ .env is NOT pushed (excluded by .gitignore)

2. **On VPS (Production)**:
   - Clone code from GitHub
   - ⚠️ **MANUALLY create .env file** (see CREATE_ENV_ON_VPS.md)
   - Use production URLs (https://api.peckup.in)
   - Generate secure secret keys
   - Deploy application

---

## 📋 Deployment Checklist

### Before You Start

- [ ] Hostinger VPS with Ubuntu
- [ ] Domains purchased: peckup.in, admin.peckup.in, api.peckup.in
- [ ] SSH access to VPS
- [ ] Basic Linux command knowledge

### Phase 1: Server Setup (15 minutes)

- [ ] Run `setup-server.sh` on VPS
- [ ] Configure DNS in Hostinger
- [ ] Wait for DNS propagation

### Phase 2: Deploy Code (10 minutes)

- [ ] Clone repository to VPS
- [ ] ⚠️ **CREATE .env FILE** (most important step!)
- [ ] Install dependencies
- [ ] Build frontend

### Phase 3: Configure Services (10 minutes)

- [ ] Setup systemd service
- [ ] Configure Nginx
- [ ] Install SSL certificates

### Phase 4: Test (5 minutes)

- [ ] Test all three domains
- [ ] Verify API works
- [ ] Test admin login
- [ ] Upload test product

---

## 🔑 Key Configuration Differences

### Development (Local)

```env
FLASK_ENV=development
API_URL=http://localhost:5000
CORS_ORIGINS=http://localhost:5173
DEBUG=True
```

### Production (VPS)

```env
FLASK_ENV=production
API_URL=https://api.peckup.in
CORS_ORIGINS=https://peckup.in,https://admin.peckup.in
DEBUG=False
```

**⚠️ NEVER use localhost URLs in production!**

---

## 📚 Documentation Index

### Essential Guides

| Document | Purpose | When to Use |
|----------|---------|-------------|
| **QUICK_START.md** | Fast deployment | First-time deployment |
| **HOSTINGER_DEPLOYMENT.md** | Detailed guide | Need step-by-step instructions |
| **CREATE_ENV_ON_VPS.md** | .env file creation | Creating .env on VPS |
| **DEPLOYMENT_WORKFLOW.md** | Complete workflow | Understanding the process |

### Configuration Guides

| Document | Purpose |
|----------|---------|
| **ENV_VARIABLES_GUIDE.md** | All environment variables explained |
| **ENVIRONMENT_SETUP_GUIDE.md** | Dev vs Production setup |
| **GENERATE_SECRETS_GUIDE.md** | How to generate secret keys |

### Reference Guides

| Document | Purpose |
|----------|---------|
| **DEPLOYMENT_CHECKLIST.md** | Step-by-step checklist |
| **DEPLOYMENT_SUMMARY.md** | Architecture overview |
| **README_DEPLOYMENT.md** | File structure reference |

### Scripts

| Script | Purpose |
|--------|---------|
| `setup-server.sh` | Initial VPS setup |
| `deploy.sh` | Deploy updates |
| `generate_secrets.py` | Generate secret keys |
| `scripts/backup-peckup.sh` | Backup database |
| `scripts/monitor.sh` | System monitoring |

---

## 🚀 Quick Start (TL;DR)

### 1. On VPS

```bash
# Run setup
sudo ./setup-server.sh

# Clone code
cd /var/www/peckup
git clone https://github.com/yourusername/peckup.git peckup

# ⚠️ CREATE .env FILE (CRITICAL!)
cd peckup/backend
python3 -c "import secrets; print('SECRET_KEY=' + secrets.token_hex(32))"
python3 -c "import secrets; print('JWT_SECRET_KEY=' + secrets.token_hex(32))"
nano .env
# Paste configuration from CREATE_ENV_ON_VPS.md

# Setup backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python init_db.py
python create_admin_user.py
deactivate

# Build frontend
cd ..
npm install
npm run build

# Start services
sudo cp systemd/peckup-backend.service /etc/systemd/system/
sudo systemctl start peckup-backend
sudo cp nginx-configs/*.conf /etc/nginx/sites-available/
sudo ln -s /etc/nginx/sites-available/*.conf /etc/nginx/sites-enabled/
sudo systemctl restart nginx

# Install SSL
sudo certbot --nginx -d peckup.in -d www.peckup.in
sudo certbot --nginx -d admin.peckup.in
sudo certbot --nginx -d api.peckup.in
```

### 2. Test

- https://peckup.in
- https://admin.peckup.in
- https://api.peckup.in/api/health

---

## 🚨 Common Issues & Solutions

### Issue: Backend won't start

**Cause**: .env file missing or incorrect

**Solution**: 
```bash
# Check if .env exists
ls -la backend/.env

# If missing, create it
# See CREATE_ENV_ON_VPS.md
```

### Issue: CORS errors

**Cause**: CORS_ORIGINS includes localhost or has wrong format

**Solution**:
```bash
# Check CORS configuration
grep CORS_ORIGINS backend/.env

# Should be (no spaces!):
CORS_ORIGINS=https://peckup.in,https://admin.peckup.in
```

### Issue: Images not loading

**Cause**: API_URL or UPLOAD_BASE_URL is wrong

**Solution**:
```bash
# Check configuration
grep API_URL backend/.env

# Should be:
API_URL=https://api.peckup.in
UPLOAD_BASE_URL=https://api.peckup.in/uploads
```

---

## 🔐 Security Reminders

### ✅ DO:
- Create .env manually on VPS
- Use strong random secret keys
- Set DEBUG=False in production
- Use HTTPS URLs in production
- Keep .env in .gitignore
- Backup .env securely

### ❌ DON'T:
- Commit .env to Git
- Use localhost URLs in production
- Share .env publicly
- Use simple passwords
- Enable DEBUG in production
- Include localhost in CORS_ORIGINS

---

## 📞 Getting Help

### Step-by-Step Help

1. **Read the appropriate guide** (see Documentation Index above)
2. **Check logs**: `sudo journalctl -u peckup-backend -n 50`
3. **Verify .env**: `cat backend/.env`
4. **Test configuration**: See verification sections in guides

### Quick Checks

```bash
# Is .env file present?
ls -la backend/.env

# Is backend running?
sudo systemctl status peckup-backend

# Is Nginx running?
sudo systemctl status nginx

# Can API be reached?
curl https://api.peckup.in/api/health

# Check recent errors
sudo journalctl -u peckup-backend -n 20
```

---

## 🎯 Your Deployment Path

```
START HERE
    │
    ├─→ Read this file (README_FIRST.md) ✓
    │
    ├─→ Choose deployment guide:
    │   ├─→ Quick: QUICK_START.md
    │   └─→ Detailed: HOSTINGER_DEPLOYMENT.md
    │
    ├─→ Setup VPS (setup-server.sh)
    │
    ├─→ Clone code from GitHub
    │
    ├─→ ⚠️ CREATE .env FILE (CREATE_ENV_ON_VPS.md)
    │
    ├─→ Deploy application
    │
    ├─→ Configure services
    │
    ├─→ Install SSL
    │
    └─→ TEST & VERIFY
        │
        └─→ SUCCESS! 🎉
```

---

## 🎉 Ready to Deploy?

1. **Start with**: [QUICK_START.md](QUICK_START.md) or [HOSTINGER_DEPLOYMENT.md](HOSTINGER_DEPLOYMENT.md)
2. **Remember**: Create .env file manually on VPS (see [CREATE_ENV_ON_VPS.md](CREATE_ENV_ON_VPS.md))
3. **Need help?**: Check the documentation index above

---

## 📊 Deployment Time Estimate

- **Server Setup**: 15 minutes
- **Code Deployment**: 10 minutes
- **Service Configuration**: 10 minutes
- **SSL Installation**: 5 minutes
- **Testing**: 5 minutes

**Total**: ~45 minutes for first deployment

**Updates**: ~5 minutes using `deploy.sh`

---

**Good luck with your deployment! 🚀**

Remember: The .env file is the most important part. Take your time to set it up correctly!
