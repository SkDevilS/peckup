# 🔧 Environment Setup Guide

This guide explains how to properly configure your Peckup application for different environments.

## 📋 Overview

The Peckup application uses different configurations for:
- **Development** (Local machine with localhost)
- **Production** (Hostinger VPS with api.peckup.in)

## 🏠 Development Environment (Local)

### When to Use
- Running the application on your local machine
- Testing new features
- Debugging issues

### Configuration File
Use `backend/.env.development` or create `backend/.env` with development settings.

### Key Settings

```env
# Flask Configuration
FLASK_ENV=development
DEBUG=True

# API runs on localhost
API_URL=http://localhost:5000
UPLOAD_BASE_URL=http://localhost:5000/uploads

# Frontend runs on localhost
MAIN_URL=http://localhost:5173
ADMIN_URL=http://localhost:5173

# CORS allows localhost
CORS_ORIGINS=http://localhost:5173,http://localhost:5174,http://127.0.0.1:5173
```

### How It Works

```
┌─────────────────────────────────────────────────────────┐
│                    LOCAL MACHINE                         │
│                                                          │
│  Frontend (Vite)          Backend (Flask)               │
│  http://localhost:5173 ←→ http://localhost:5000         │
│                                                          │
│  - Main Site              - API Endpoints               │
│  - Admin Panel            - File Uploads                │
│                           - Database                    │
└─────────────────────────────────────────────────────────┘
```

### Starting Development Server

```bash
# Terminal 1: Start Backend
cd backend
source venv/bin/activate
python app.py
# Runs on http://localhost:5000

# Terminal 2: Start Frontend
npm run dev
# Runs on http://localhost:5173
```

---

## 🌐 Production Environment (Hostinger VPS)

### When to Use
- Deploying to Hostinger VPS
- Live website accessible to users
- Production traffic

### Configuration File
Use `backend/.env` on the VPS with production settings.

### Key Settings

```env
# Flask Configuration
FLASK_ENV=production
DEBUG=False

# API runs on api.peckup.in
API_URL=https://api.peckup.in
UPLOAD_BASE_URL=https://api.peckup.in/uploads

# Frontend domains
MAIN_URL=https://peckup.in
ADMIN_URL=https://admin.peckup.in

# CORS only allows production domains (NO localhost!)
CORS_ORIGINS=https://peckup.in,https://admin.peckup.in,https://www.peckup.in
```

### How It Works

```
┌─────────────────────────────────────────────────────────────────┐
│                    HOSTINGER VPS (Ubuntu)                        │
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐ │
│  │ peckup.in    │  │admin.peckup  │  │ api.peckup.in        │ │
│  │ (Main Site)  │  │.in (Admin)   │  │ (Backend API)        │ │
│  │              │  │              │  │                      │ │
│  │ React Build  │  │ React Build  │  │ Flask + Gunicorn    │ │
│  │ /dist        │  │ /dist        │  │ Port 5000           │ │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────────────┘ │
│         │                 │                  │                  │
│         └─────────────────┴──────────────────┘                  │
│                           │                                     │
│                      ┌────▼─────┐                              │
│                      │  Nginx   │                              │
│                      │  (Proxy) │                              │
│                      └──────────┘                              │
│                                                                  │
│  All domains use HTTPS (SSL certificates from Let's Encrypt)   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔑 Critical Differences

### API URL

| Environment | API_URL | Why |
|------------|---------|-----|
| Development | `http://localhost:5000` | Backend runs locally |
| Production | `https://api.peckup.in` | Backend runs on VPS with domain |

### CORS Origins

| Environment | CORS_ORIGINS | Why |
|------------|--------------|-----|
| Development | `http://localhost:5173,...` | Frontend runs on localhost |
| Production | `https://peckup.in,https://admin.peckup.in` | Frontend runs on production domains |

**⚠️ CRITICAL**: Never include `localhost` in production CORS settings!

### Upload URLs

| Environment | UPLOAD_BASE_URL | Example Image URL |
|------------|-----------------|-------------------|
| Development | `http://localhost:5000/uploads` | `http://localhost:5000/uploads/products/image.jpg` |
| Production | `https://api.peckup.in/uploads` | `https://api.peckup.in/uploads/products/image.jpg` |

### Debug Mode

| Environment | DEBUG | Why |
|------------|-------|-----|
| Development | `True` | Shows detailed errors for debugging |
| Production | `False` | Hides sensitive error information |

---

## 📝 Complete Configuration Examples

### Development (.env)

```env
# Flask Configuration
FLASK_APP=app.py
FLASK_ENV=development
SECRET_KEY=dev-secret-key-not-for-production
JWT_SECRET_KEY=dev-jwt-secret-key-not-for-production

# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=peckup_dev_db
DB_USER=root
DB_PASSWORD=

# Upload Configuration
UPLOAD_FOLDER=uploads
MAX_CONTENT_LENGTH=16777216
ALLOWED_EXTENSIONS=png,jpg,jpeg,gif,webp

# Domain Configuration (Local Development)
MAIN_DOMAIN=localhost
MAIN_URL=http://localhost:5173
ADMIN_DOMAIN=localhost
ADMIN_URL=http://localhost:5173
API_DOMAIN=localhost
API_URL=http://localhost:5000

# Upload URL Configuration (Local)
UPLOAD_BASE_URL=http://localhost:5000/uploads

# CORS Configuration (Allow local development)
CORS_ORIGINS=http://localhost:5173,http://localhost:5174,http://127.0.0.1:5173
CORS_SUPPORTS_CREDENTIALS=True
CORS_MAX_AGE=3600

# Development Settings
DEBUG=True
TESTING=False
```

### Production (.env)

```env
# Flask Configuration
FLASK_APP=app.py
FLASK_ENV=production
SECRET_KEY=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2
JWT_SECRET_KEY=z9y8x7w6v5u4t3s2r1q0p9o8n7m6l5k4j3i2h1g0f9e8d7c6b5a4z3y2x1w0v9u8

# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=peckup_db
DB_USER=peckup_user
DB_PASSWORD=your_secure_mysql_password

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

# CORS Configuration (Production - NO localhost!)
CORS_ORIGINS=https://peckup.in,https://admin.peckup.in,https://www.peckup.in
CORS_SUPPORTS_CREDENTIALS=True
CORS_MAX_AGE=3600

# Production Settings
DEBUG=False
TESTING=False
```

---

## 🚀 Setup Instructions

### For Local Development

1. **Copy development template**
   ```bash
   cd backend
   cp .env.development .env
   ```

2. **Update database credentials** (if needed)
   ```bash
   nano .env
   # Update DB_USER and DB_PASSWORD
   ```

3. **Start development servers**
   ```bash
   # Terminal 1: Backend
   cd backend
   source venv/bin/activate
   python app.py

   # Terminal 2: Frontend
   npm run dev
   ```

4. **Access application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000
   - Admin: http://localhost:5173/admin/login

### For Production Deployment

1. **Copy production template on VPS**
   ```bash
   cd /var/www/peckup/peckup/backend
   cp .env.production .env
   ```

2. **Generate secure keys**
   ```bash
   python3 -c "import secrets; print('SECRET_KEY=' + secrets.token_hex(32))"
   python3 -c "import secrets; print('JWT_SECRET_KEY=' + secrets.token_hex(32))"
   ```

3. **Edit .env file**
   ```bash
   nano .env
   ```

4. **Update these values:**
   - `SECRET_KEY` - Paste generated key
   - `JWT_SECRET_KEY` - Paste generated key
   - `DB_PASSWORD` - Your MySQL password
   - Verify all URLs use `https://` and correct domains

5. **Verify configuration**
   ```bash
   # Check API_URL is set to production domain
   grep API_URL .env
   # Should show: API_URL=https://api.peckup.in

   # Check CORS doesn't include localhost
   grep CORS_ORIGINS .env
   # Should NOT contain localhost
   ```

6. **Start services**
   ```bash
   sudo systemctl restart peckup-backend
   sudo systemctl restart nginx
   ```

---

## ✅ Verification Checklist

### Development Environment

- [ ] `API_URL=http://localhost:5000`
- [ ] `CORS_ORIGINS` includes `http://localhost:5173`
- [ ] `DEBUG=True`
- [ ] Backend runs on port 5000
- [ ] Frontend runs on port 5173
- [ ] Can access http://localhost:5173
- [ ] Can access http://localhost:5000/api/health

### Production Environment

- [ ] `API_URL=https://api.peckup.in`
- [ ] `CORS_ORIGINS` does NOT include localhost
- [ ] `DEBUG=False`
- [ ] Strong SECRET_KEY and JWT_SECRET_KEY
- [ ] Database password is secure
- [ ] All URLs use `https://`
- [ ] Can access https://peckup.in
- [ ] Can access https://admin.peckup.in
- [ ] Can access https://api.peckup.in/api/health

---

## 🚨 Common Mistakes

### ❌ Mistake 1: Using localhost in production

```env
# WRONG - Production .env
API_URL=http://localhost:5000
CORS_ORIGINS=http://localhost:5173,https://peckup.in
```

**Problem**: API won't be accessible from internet, CORS will fail

**Fix**:
```env
# CORRECT - Production .env
API_URL=https://api.peckup.in
CORS_ORIGINS=https://peckup.in,https://admin.peckup.in
```

### ❌ Mistake 2: Using production URLs in development

```env
# WRONG - Development .env
API_URL=https://api.peckup.in
```

**Problem**: Local backend won't work, requests will go to production

**Fix**:
```env
# CORRECT - Development .env
API_URL=http://localhost:5000
```

### ❌ Mistake 3: Mixed HTTP/HTTPS in production

```env
# WRONG - Production .env
API_URL=http://api.peckup.in  # HTTP
MAIN_URL=https://peckup.in    # HTTPS
```

**Problem**: Mixed content errors, security issues

**Fix**:
```env
# CORRECT - Production .env
API_URL=https://api.peckup.in
MAIN_URL=https://peckup.in
```

### ❌ Mistake 4: Spaces in CORS_ORIGINS

```env
# WRONG
CORS_ORIGINS=https://peckup.in, https://admin.peckup.in
```

**Problem**: CORS will fail due to spaces

**Fix**:
```env
# CORRECT (no spaces!)
CORS_ORIGINS=https://peckup.in,https://admin.peckup.in
```

---

## 🔍 Testing Your Configuration

### Test API URL

```bash
# Development
curl http://localhost:5000/api/health

# Production
curl https://api.peckup.in/api/health
```

### Test CORS

```bash
# Development
curl -I -X OPTIONS http://localhost:5000/api/health \
  -H "Origin: http://localhost:5173"

# Production
curl -I -X OPTIONS https://api.peckup.in/api/health \
  -H "Origin: https://peckup.in"
```

### Test Upload URLs

```bash
# Check configuration
cd backend
source venv/bin/activate
python3 << EOF
from config import Config
print(f"API_URL: {Config.API_URL}")
print(f"UPLOAD_BASE_URL: {Config.UPLOAD_BASE_URL}")
print(f"CORS_ORIGINS: {Config.CORS_ORIGINS}")
EOF
```

---

## 📞 Need Help?

If you're having environment configuration issues:

1. **Check which environment you're in**
   ```bash
   grep FLASK_ENV backend/.env
   ```

2. **Verify API_URL matches your environment**
   - Development: Should be `http://localhost:5000`
   - Production: Should be `https://api.peckup.in`

3. **Check CORS configuration**
   - Development: Should include localhost
   - Production: Should NOT include localhost

4. **Review logs**
   ```bash
   # Development
   # Check terminal where you ran `python app.py`

   # Production
   sudo journalctl -u peckup-backend -n 50
   ```

---

**Remember**: 
- 🏠 Development = localhost URLs
- 🌐 Production = api.peckup.in URLs
- Never mix them!
