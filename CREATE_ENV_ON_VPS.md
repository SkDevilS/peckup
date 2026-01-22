# 📝 Creating .env File on VPS (Production)

## Why This Guide?

The `.env` file contains sensitive information (passwords, secret keys) and is **NOT included in Git** for security reasons. You must create it manually on your VPS after deploying your code.

## 🚨 Important Notes

- ✅ `.env` is in `.gitignore` - it will NOT be pushed to GitHub
- ✅ This is a security best practice
- ✅ You must create `.env` manually on the VPS
- ❌ Never commit `.env` to Git
- ❌ Never share `.env` publicly

## 🎯 Quick Steps

### Step 1: Connect to Your VPS

```bash
ssh root@your-vps-ip
```

### Step 2: Navigate to Backend Directory

```bash
cd /var/www/peckup/peckup/backend
```

### Step 3: Generate Secret Keys

```bash
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

### Step 4: Create .env File

```bash
nano .env
```

### Step 5: Paste Configuration

Copy and paste this template, then replace the placeholders:

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
DB_PASSWORD=YOUR_MYSQL_PASSWORD_FROM_SETUP

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
```

### Step 6: Save the File

- Press `Ctrl + X`
- Press `Y` to confirm
- Press `Enter` to save

### Step 7: Set Proper Permissions

```bash
chmod 600 .env
```

### Step 8: Verify

```bash
# Check file exists
ls -la .env

# Should show: -rw------- (only owner can read/write)
```

## 🤖 Automated Method (Alternative)

If you prefer automation, use this script:

```bash
cd /var/www/peckup/peckup/backend

# Generate keys automatically
SECRET_KEY=$(python3 -c "import secrets; print(secrets.token_hex(32))")
JWT_SECRET_KEY=$(python3 -c "import secrets; print(secrets.token_hex(32))")

# Set your MySQL password here
DB_PASSWORD="YOUR_MYSQL_PASSWORD"

# Create .env file
cat > .env << 'EOF'
# Flask Configuration
FLASK_APP=app.py
FLASK_ENV=production
SECRET_KEY=SECRET_KEY_PLACEHOLDER
JWT_SECRET_KEY=JWT_SECRET_KEY_PLACEHOLDER

# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=peckup_db
DB_USER=peckup_user
DB_PASSWORD=DB_PASSWORD_PLACEHOLDER

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

# Replace placeholders with actual values
sed -i "s/SECRET_KEY_PLACEHOLDER/$SECRET_KEY/" .env
sed -i "s/JWT_SECRET_KEY_PLACEHOLDER/$JWT_SECRET_KEY/" .env
sed -i "s/DB_PASSWORD_PLACEHOLDER/$DB_PASSWORD/" .env

# Set permissions
chmod 600 .env

echo "✅ .env file created successfully!"
echo "SECRET_KEY: $SECRET_KEY"
echo "JWT_SECRET_KEY: $JWT_SECRET_KEY"
```

## ✅ Verification Checklist

After creating the .env file:

- [ ] File exists: `ls -la backend/.env`
- [ ] Permissions are 600: `-rw-------`
- [ ] SECRET_KEY is set (64 characters)
- [ ] JWT_SECRET_KEY is set (64 characters)
- [ ] DB_PASSWORD matches your MySQL password
- [ ] API_URL is `https://api.peckup.in` (NOT localhost)
- [ ] CORS_ORIGINS does NOT include localhost
- [ ] DEBUG is False

### Test Configuration

```bash
cd /var/www/peckup/peckup/backend
source venv/bin/activate

python3 << EOF
from config import Config
print("✅ Configuration Test")
print(f"API_URL: {Config.API_URL}")
print(f"UPLOAD_BASE_URL: {Config.UPLOAD_BASE_URL}")
print(f"CORS_ORIGINS: {Config.CORS_ORIGINS}")
print(f"DEBUG: {Config.DEBUG}")
print(f"SECRET_KEY: {'SET ✓' if Config.SECRET_KEY else 'NOT SET ✗'}")
print(f"JWT_SECRET_KEY: {'SET ✓' if Config.JWT_SECRET_KEY else 'NOT SET ✗'}")
EOF
```

Expected output:
```
✅ Configuration Test
API_URL: https://api.peckup.in
UPLOAD_BASE_URL: https://api.peckup.in/uploads
CORS_ORIGINS: ['https://peckup.in', 'https://admin.peckup.in', 'https://www.peckup.in']
DEBUG: False
SECRET_KEY: SET ✓
JWT_SECRET_KEY: SET ✓
```

## 🔄 Updating .env File

If you need to update the .env file later:

```bash
# Edit file
cd /var/www/peckup/peckup/backend
nano .env

# Make changes and save (Ctrl+X, Y, Enter)

# Restart backend service
sudo systemctl restart peckup-backend

# Verify service started
sudo systemctl status peckup-backend
```

## 🚨 Common Issues

### Issue: "No such file or directory: .env"

**Solution**: You forgot to create the .env file. Follow Step 4 above.

### Issue: Backend won't start after creating .env

**Possible causes**:
1. Syntax error in .env file (check for typos)
2. Missing required variables
3. Wrong permissions

**Solution**:
```bash
# Check for syntax errors
cat backend/.env

# Verify all required variables are present
grep -E "SECRET_KEY|JWT_SECRET_KEY|DB_PASSWORD|API_URL" backend/.env

# Fix permissions
chmod 600 backend/.env

# Check logs
sudo journalctl -u peckup-backend -n 50
```

### Issue: CORS errors after deployment

**Cause**: CORS_ORIGINS includes localhost or has wrong format

**Solution**:
```bash
# Check CORS configuration
grep CORS_ORIGINS backend/.env

# Should be (no spaces!):
# CORS_ORIGINS=https://peckup.in,https://admin.peckup.in,https://www.peckup.in

# NOT:
# CORS_ORIGINS=https://peckup.in, https://admin.peckup.in  (has spaces)
# CORS_ORIGINS=http://localhost:5173,https://peckup.in  (has localhost)
```

### Issue: Images not loading

**Cause**: API_URL or UPLOAD_BASE_URL is wrong

**Solution**:
```bash
# Check configuration
grep -E "API_URL|UPLOAD_BASE_URL" backend/.env

# Should be:
# API_URL=https://api.peckup.in
# UPLOAD_BASE_URL=https://api.peckup.in/uploads

# NOT:
# API_URL=http://localhost:5000
```

## 📋 Quick Reference

### Required Variables

| Variable | Production Value | Example |
|----------|-----------------|---------|
| FLASK_ENV | `production` | `production` |
| SECRET_KEY | Random 64 chars | `a1b2c3d4...` |
| JWT_SECRET_KEY | Random 64 chars | `z9y8x7w6...` |
| DB_PASSWORD | Your MySQL password | `SecurePass123!` |
| API_URL | Production API domain | `https://api.peckup.in` |
| UPLOAD_BASE_URL | Upload files URL | `https://api.peckup.in/uploads` |
| CORS_ORIGINS | Production domains | `https://peckup.in,https://admin.peckup.in` |
| DEBUG | `False` | `False` |

### Commands Cheat Sheet

```bash
# Navigate to backend
cd /var/www/peckup/peckup/backend

# Generate secret key
python3 -c "import secrets; print(secrets.token_hex(32))"

# Create .env file
nano .env

# Set permissions
chmod 600 .env

# Verify file
ls -la .env
cat .env

# Test configuration
source venv/bin/activate
python3 -c "from config import Config; print(Config.API_URL)"

# Restart service
sudo systemctl restart peckup-backend

# Check logs
sudo journalctl -u peckup-backend -f
```

## 🔐 Security Best Practices

1. ✅ **Never commit .env to Git**
   - Already in .gitignore
   - Double-check: `git status` should not show .env

2. ✅ **Use strong, random keys**
   - Generate with `secrets.token_hex(32)`
   - At least 64 characters

3. ✅ **Set proper file permissions**
   - `chmod 600 .env` (only owner can read/write)

4. ✅ **Different keys for each environment**
   - Development keys ≠ Production keys

5. ✅ **Store backup securely**
   - Save .env in password manager
   - Don't email or share publicly

6. ✅ **Rotate keys periodically**
   - Change keys every 6-12 months
   - Change immediately if compromised

## 📞 Need Help?

If you're stuck:

1. Check this guide step-by-step
2. Verify .env file exists: `ls -la backend/.env`
3. Check logs: `sudo journalctl -u peckup-backend -n 50`
4. Review HOSTINGER_DEPLOYMENT.md for full deployment guide

---

**Remember**: The .env file is the most important configuration file. Take your time to set it up correctly!

🎉 **Once created, your application will be ready to run!**
