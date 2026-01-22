# 🔧 Environment Variables Guide

This guide explains all environment variables used in the Peckup application.

## 📋 Table of Contents

1. [Flask Configuration](#flask-configuration)
2. [Database Configuration](#database-configuration)
3. [Upload Configuration](#upload-configuration)
4. [Domain Configuration](#domain-configuration)
5. [CORS Configuration](#cors-configuration)
6. [Security Settings](#security-settings)
7. [Complete Examples](#complete-examples)

---

## Flask Configuration

### FLASK_APP
- **Description**: Entry point for the Flask application
- **Required**: Yes
- **Default**: `app.py`
- **Example**: `FLASK_APP=app.py`

### FLASK_ENV
- **Description**: Application environment (development/production)
- **Required**: Yes
- **Values**: `development`, `production`
- **Example**: `FLASK_ENV=production`

### SECRET_KEY
- **Description**: Secret key for Flask session encryption
- **Required**: Yes
- **Security**: Must be random and at least 32 characters
- **Generate**: `python3 -c "import secrets; print(secrets.token_hex(32))"`
- **Example**: `SECRET_KEY=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6...`

### JWT_SECRET_KEY
- **Description**: Secret key for JWT token signing
- **Required**: Yes
- **Security**: Must be random and at least 32 characters
- **Generate**: `python3 -c "import secrets; print(secrets.token_hex(32))"`
- **Example**: `JWT_SECRET_KEY=z9y8x7w6v5u4t3s2r1q0p9o8n7m6l5k4...`

### DEBUG
- **Description**: Enable/disable debug mode
- **Required**: No
- **Default**: `False`
- **Values**: `True`, `False`
- **Example**: `DEBUG=False`
- **⚠️ Warning**: Never set to `True` in production!

---

## Database Configuration

### DB_HOST
- **Description**: MySQL database host
- **Required**: Yes
- **Default**: `localhost`
- **Example**: `DB_HOST=localhost`

### DB_PORT
- **Description**: MySQL database port
- **Required**: No
- **Default**: `3306`
- **Example**: `DB_PORT=3306`

### DB_NAME
- **Description**: Database name
- **Required**: Yes
- **Default**: `peckup_db`
- **Example**: `DB_NAME=peckup_db`

### DB_USER
- **Description**: Database username
- **Required**: Yes
- **Example**: `DB_USER=peckup_user`

### DB_PASSWORD
- **Description**: Database password
- **Required**: Yes
- **Security**: Use a strong password
- **Example**: `DB_PASSWORD=your_secure_password_here`

---

## Upload Configuration

### UPLOAD_FOLDER
- **Description**: Directory for uploaded files (relative to backend/)
- **Required**: No
- **Default**: `uploads`
- **Example**: `UPLOAD_FOLDER=uploads`

### MAX_CONTENT_LENGTH
- **Description**: Maximum upload file size in bytes
- **Required**: No
- **Default**: `16777216` (16 MB)
- **Example**: `MAX_CONTENT_LENGTH=16777216`
- **Note**: 16 MB = 16 * 1024 * 1024 bytes

### ALLOWED_EXTENSIONS
- **Description**: Comma-separated list of allowed file extensions
- **Required**: No
- **Default**: `png,jpg,jpeg,gif,webp`
- **Example**: `ALLOWED_EXTENSIONS=png,jpg,jpeg,gif,webp`

---

## Domain Configuration

### MAIN_DOMAIN
- **Description**: Main website domain (without protocol)
- **Required**: Yes
- **Example**: `MAIN_DOMAIN=peckup.in`

### MAIN_URL
- **Description**: Full URL of main website (with protocol)
- **Required**: Yes
- **Example**: `MAIN_URL=https://peckup.in`

### ADMIN_DOMAIN
- **Description**: Admin dashboard domain (without protocol)
- **Required**: Yes
- **Example**: `ADMIN_DOMAIN=admin.peckup.in`

### ADMIN_URL
- **Description**: Full URL of admin dashboard (with protocol)
- **Required**: Yes
- **Example**: `ADMIN_URL=https://admin.peckup.in`

### API_DOMAIN
- **Description**: API backend domain (without protocol)
- **Required**: Yes
- **Example**: `API_DOMAIN=api.peckup.in`

### API_URL
- **Description**: Full URL of API backend (with protocol)
- **Required**: Yes
- **Example**: `API_URL=https://api.peckup.in`
- **Development**: `API_URL=http://localhost:5000`

### UPLOAD_BASE_URL
- **Description**: Public URL where uploaded files are accessible
- **Required**: Yes
- **Example**: `UPLOAD_BASE_URL=https://api.peckup.in/uploads`
- **Note**: This is used to generate image URLs in API responses

---

## CORS Configuration

### CORS_ORIGINS
- **Description**: Comma-separated list of allowed origins for CORS
- **Required**: Yes
- **Format**: `origin1,origin2,origin3` (no spaces!)
- **Example**: `CORS_ORIGINS=https://peckup.in,https://www.peckup.in,https://admin.peckup.in`
- **Development**: Add `http://localhost:5173,http://localhost:5174`
- **Important**: Only include FRONTEND domains (not api.peckup.in)

### CORS_SUPPORTS_CREDENTIALS
- **Description**: Allow credentials in CORS requests
- **Required**: No
- **Default**: `True`
- **Values**: `True`, `False`
- **Example**: `CORS_SUPPORTS_CREDENTIALS=True`

### CORS_MAX_AGE
- **Description**: CORS preflight cache duration in seconds
- **Required**: No
- **Default**: `3600` (1 hour)
- **Example**: `CORS_MAX_AGE=3600`

---

## Security Settings

### TESTING
- **Description**: Enable/disable testing mode
- **Required**: No
- **Default**: `False`
- **Values**: `True`, `False`
- **Example**: `TESTING=False`

---

## Complete Examples

### Production Environment (.env)

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

# Domain Configuration
MAIN_DOMAIN=peckup.in
MAIN_URL=https://peckup.in
ADMIN_DOMAIN=admin.peckup.in
ADMIN_URL=https://admin.peckup.in
API_DOMAIN=api.peckup.in
API_URL=https://api.peckup.in

# Upload URL Configuration
UPLOAD_BASE_URL=https://api.peckup.in/uploads

# CORS Configuration
CORS_ORIGINS=https://peckup.in,https://admin.peckup.in
CORS_SUPPORTS_CREDENTIALS=True
CORS_MAX_AGE=3600

# Production Settings
DEBUG=False
TESTING=False
```

### Development Environment (.env.local)

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
DB_PASSWORD=root

# Upload Configuration
UPLOAD_FOLDER=uploads
MAX_CONTENT_LENGTH=16777216
ALLOWED_EXTENSIONS=png,jpg,jpeg,gif,webp

# Domain Configuration
MAIN_DOMAIN=localhost
MAIN_URL=http://localhost:5173
ADMIN_DOMAIN=localhost
ADMIN_URL=http://localhost:5173
API_DOMAIN=localhost
API_URL=http://localhost:5000

# Upload URL Configuration
UPLOAD_BASE_URL=http://localhost:5000/uploads

# CORS Configuration
CORS_ORIGINS=http://localhost:5173,http://localhost:5174,http://127.0.0.1:5173
CORS_SUPPORTS_CREDENTIALS=True
CORS_MAX_AGE=3600

# Development Settings
DEBUG=True
TESTING=False
```

---

## 🔍 Verification

### Check Environment Variables are Loaded

```bash
# Navigate to backend directory
cd /var/www/peckup/peckup/backend

# Activate virtual environment
source venv/bin/activate

# Test configuration
python3 << EOF
from config import Config
print("✅ Configuration loaded successfully!")
print(f"API_URL: {Config.API_URL}")
print(f"UPLOAD_BASE_URL: {Config.UPLOAD_BASE_URL}")
print(f"CORS_ORIGINS: {Config.CORS_ORIGINS}")
print(f"SECRET_KEY: {'SET' if Config.SECRET_KEY else 'NOT SET'}")
print(f"JWT_SECRET_KEY: {'SET' if Config.JWT_SECRET_KEY else 'NOT SET'}")
EOF
```

### Test CORS Configuration

```bash
# Test CORS headers
curl -I -X OPTIONS https://api.peckup.in/api/health \
  -H "Origin: https://peckup.in" \
  -H "Access-Control-Request-Method: GET"

# Should return headers like:
# Access-Control-Allow-Origin: https://peckup.in
# Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS, PATCH
```

### Test Upload URL Generation

```bash
# In Python shell
python3 << EOF
from config import Config
test_filename = "products/test.jpg"
full_url = f"{Config.UPLOAD_BASE_URL}/{test_filename}"
print(f"Upload URL: {full_url}")
# Should output: https://api.peckup.in/uploads/products/test.jpg
EOF
```

---

## 🚨 Common Issues

### Issue: CORS errors in browser

**Symptoms**: 
- Browser console shows CORS errors
- API requests fail with "blocked by CORS policy"

**Solution**:
1. Check `CORS_ORIGINS` includes your frontend domain
2. Ensure no spaces in the comma-separated list
3. Include protocol (https:// or http://)
4. Restart backend service after changes

```bash
# Correct
CORS_ORIGINS=https://peckup.in,https://admin.peckup.in

# Wrong (has spaces)
CORS_ORIGINS=https://peckup.in, https://admin.peckup.in

# Wrong (missing protocol)
CORS_ORIGINS=peckup.in,admin.peckup.in
```

### Issue: Images not loading

**Symptoms**:
- Product images show broken image icon
- Image URLs return 404

**Solution**:
1. Check `UPLOAD_BASE_URL` is correct
2. Verify Nginx is serving `/uploads/` path
3. Check file permissions on uploads directory

```bash
# Verify UPLOAD_BASE_URL
grep UPLOAD_BASE_URL backend/.env

# Check uploads directory
ls -la backend/uploads/products/

# Fix permissions
sudo chown -R www-data:www-data backend/uploads
sudo chmod -R 775 backend/uploads
```

### Issue: Environment variables not loading

**Symptoms**:
- Application uses default values
- Configuration doesn't match .env file

**Solution**:
1. Verify .env file exists in backend directory
2. Check file has no syntax errors
3. Ensure python-dotenv is installed
4. Restart backend service

```bash
# Check .env exists
ls -la backend/.env

# Verify python-dotenv installed
pip list | grep python-dotenv

# Restart service
sudo systemctl restart peckup-backend
```

---

## 📝 Best Practices

### ✅ DO:
- Use different keys for development and production
- Generate random keys using secure methods
- Keep .env file out of version control
- Use strong database passwords
- Include all frontend domains in CORS_ORIGINS
- Use HTTPS URLs in production
- Set DEBUG=False in production
- Document any custom environment variables

### ❌ DON'T:
- Commit .env files to Git
- Use simple or predictable keys
- Share environment variables publicly
- Use development keys in production
- Include spaces in comma-separated lists
- Mix HTTP and HTTPS in production
- Enable DEBUG in production
- Hardcode sensitive values in code

---

## 🔄 Updating Environment Variables

### On VPS (Production)

```bash
# 1. Edit .env file
cd /var/www/peckup/peckup/backend
nano .env

# 2. Make changes and save (Ctrl+X, Y, Enter)

# 3. Restart backend service
sudo systemctl restart peckup-backend

# 4. Verify service started successfully
sudo systemctl status peckup-backend

# 5. Check logs for any errors
sudo journalctl -u peckup-backend -n 50
```

### Testing Changes

```bash
# Test API is responding
curl https://api.peckup.in/api/health

# Test CORS
curl -I -X OPTIONS https://api.peckup.in/api/health \
  -H "Origin: https://peckup.in"

# Check configuration in logs
sudo journalctl -u peckup-backend -n 20 | grep -i "cors\|api_url\|upload"
```

---

## 📞 Need Help?

If you're having issues with environment variables:

1. Check this guide for the correct format
2. Verify .env file syntax (no spaces around `=`)
3. Check logs: `sudo journalctl -u peckup-backend -f`
4. Test configuration loading (see Verification section)
5. Restart services after changes

---

**Last Updated**: January 2026
**Version**: 1.0.0
