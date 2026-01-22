# 🔐 Secret Key Generation Guide

This guide explains how to generate secure SECRET_KEY and JWT_SECRET_KEY for your Peckup application.

## Why Do You Need These Keys?

- **SECRET_KEY**: Used by Flask to encrypt session data and cookies
- **JWT_SECRET_KEY**: Used to sign and verify JWT authentication tokens

**⚠️ CRITICAL**: These keys must be:
- Random and unpredictable
- At least 32 characters long
- Different for each environment (dev/production)
- Kept SECRET and never committed to Git

## Method 1: Using Python Script (Recommended)

### Step 1: Run the Generator Script

```bash
# On your local machine or VPS
python3 generate_secrets.py
```

### Step 2: Copy the Generated Keys

The script will output something like:

```
======================================================================
🔐 Peckup Secret Key Generator
======================================================================

✅ Generated secure keys for your application!

----------------------------------------------------------------------
SECRET_KEY (Flask Session Key):
----------------------------------------------------------------------
a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2

----------------------------------------------------------------------
JWT_SECRET_KEY (JWT Token Key):
----------------------------------------------------------------------
z9y8x7w6v5u4t3s2r1q0p9o8n7m6l5k4j3i2h1g0f9e8d7c6b5a4z3y2x1w0v9u8

======================================================================

📋 Copy these keys to your backend/.env file:

SECRET_KEY=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2
JWT_SECRET_KEY=z9y8x7w6v5u4t3s2r1q0p9o8n7m6l5k4j3i2h1g0f9e8d7c6b5a4z3y2x1w0v9u8
```

### Step 3: Add to Your .env File

Open `backend/.env` and add the keys:

```env
SECRET_KEY=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2
JWT_SECRET_KEY=z9y8x7w6v5u4t3s2r1q0p9o8n7m6l5k4j3i2h1g0f9e8d7c6b5a4z3y2x1w0v9u8
```

## Method 2: Using OpenSSL (Linux/Mac/Git Bash)

### Generate SECRET_KEY

```bash
openssl rand -hex 32
```

Output example:
```
a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2
```

### Generate JWT_SECRET_KEY

```bash
openssl rand -hex 32
```

Output example:
```
z9y8x7w6v5u4t3s2r1q0p9o8n7m6l5k4j3i2h1g0f9e8d7c6b5a4z3y2x1w0v9u8
```

### Add to .env File

```env
SECRET_KEY=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2
JWT_SECRET_KEY=z9y8x7w6v5u4t3s2r1q0p9o8n7m6l5k4j3i2h1g0f9e8d7c6b5a4z3y2x1w0v9u8
```

## Method 3: Using Python One-Liner

### On Linux/Mac/Git Bash:

```bash
python3 -c "import secrets; print('SECRET_KEY=' + secrets.token_hex(32))"
python3 -c "import secrets; print('JWT_SECRET_KEY=' + secrets.token_hex(32))"
```

### On Windows PowerShell:

```powershell
python -c "import secrets; print('SECRET_KEY=' + secrets.token_hex(32))"
python -c "import secrets; print('JWT_SECRET_KEY=' + secrets.token_hex(32))"
```

## Method 4: Using Online Generator (Not Recommended for Production)

⚠️ **Use this only for development/testing, NOT for production!**

1. Visit: https://randomkeygen.com/
2. Copy a "CodeIgniter Encryption Key" (256-bit)
3. Use it for both SECRET_KEY and JWT_SECRET_KEY (but use different keys!)

## Complete .env File Example

Here's what your complete `backend/.env` file should look like:

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
DB_PASSWORD=your_mysql_password_here

# Upload Configuration
UPLOAD_FOLDER=uploads
MAX_CONTENT_LENGTH=16777216

# CORS Configuration
CORS_ORIGINS=https://peckup.in,https://admin.peckup.in

# Production Settings
DEBUG=False
TESTING=False
```

## Step-by-Step: Creating .env File on VPS

### Option A: Using nano (Text Editor)

```bash
# Navigate to backend directory
cd /var/www/peckup/peckup/backend

# Create .env file
nano .env
```

Paste the following (replace with your actual values):

```env
FLASK_APP=app.py
FLASK_ENV=production
SECRET_KEY=PASTE_YOUR_GENERATED_SECRET_KEY_HERE
JWT_SECRET_KEY=PASTE_YOUR_GENERATED_JWT_SECRET_KEY_HERE
DB_HOST=localhost
DB_PORT=3306
DB_NAME=peckup_db
DB_USER=peckup_user
DB_PASSWORD=your_mysql_password_from_setup
UPLOAD_FOLDER=uploads
MAX_CONTENT_LENGTH=16777216
CORS_ORIGINS=https://peckup.in,https://admin.peckup.in
DEBUG=False
TESTING=False
```

Save and exit:
- Press `Ctrl + X`
- Press `Y` to confirm
- Press `Enter` to save

### Option B: Using echo Commands

```bash
cd /var/www/peckup/peckup/backend

# Generate keys first
SECRET_KEY=$(python3 -c "import secrets; print(secrets.token_hex(32))")
JWT_SECRET_KEY=$(python3 -c "import secrets; print(secrets.token_hex(32))")

# Create .env file
cat > .env << EOF
FLASK_APP=app.py
FLASK_ENV=production
SECRET_KEY=$SECRET_KEY
JWT_SECRET_KEY=$JWT_SECRET_KEY
DB_HOST=localhost
DB_PORT=3306
DB_NAME=peckup_db
DB_USER=peckup_user
DB_PASSWORD=your_mysql_password_here
UPLOAD_FOLDER=uploads
MAX_CONTENT_LENGTH=16777216
CORS_ORIGINS=https://peckup.in,https://admin.peckup.in
DEBUG=False
TESTING=False
EOF

echo "✅ .env file created with generated keys!"
```

### Option C: Upload via SFTP

1. Create `.env` file on your local machine
2. Generate keys using `python3 generate_secrets.py`
3. Fill in all values in the `.env` file
4. Upload to VPS using FileZilla/WinSCP to `/var/www/peckup/peckup/backend/.env`

## Verify Your .env File

```bash
# Check if file exists
ls -la /var/www/peckup/peckup/backend/.env

# View file contents (be careful - contains secrets!)
cat /var/www/peckup/peckup/backend/.env

# Check file permissions (should be readable)
chmod 600 /var/www/peckup/peckup/backend/.env
```

## Security Best Practices

### ✅ DO:
- Generate new keys for each environment
- Use at least 32 characters (64 recommended)
- Store keys in environment variables or .env files
- Add .env to .gitignore
- Use different keys for development and production
- Keep keys in a password manager
- Rotate keys periodically

### ❌ DON'T:
- Commit keys to Git
- Share keys publicly
- Use simple or predictable keys
- Reuse keys across projects
- Store keys in code
- Use the same keys for dev and production

## Troubleshooting

### "SECRET_KEY not found" Error

**Problem**: Flask can't find the SECRET_KEY

**Solution**:
```bash
# Check if .env file exists
ls -la backend/.env

# Verify SECRET_KEY is set
grep SECRET_KEY backend/.env

# Make sure python-dotenv is installed
pip install python-dotenv
```

### "Invalid JWT token" Error

**Problem**: JWT_SECRET_KEY mismatch or not set

**Solution**:
```bash
# Verify JWT_SECRET_KEY is set
grep JWT_SECRET_KEY backend/.env

# Restart backend service
sudo systemctl restart peckup-backend

# Clear browser cookies and try again
```

### Keys Not Loading

**Problem**: Environment variables not being read

**Solution**:
```bash
# Check if config.py loads .env
cat backend/config.py | grep load_dotenv

# Verify .env file location
pwd  # Should be in /var/www/peckup/peckup/backend
ls -la .env

# Check file permissions
chmod 600 .env
chown www-data:www-data .env
```

## Quick Reference

### Generate Both Keys at Once

```bash
# Linux/Mac/Git Bash
echo "SECRET_KEY=$(openssl rand -hex 32)"
echo "JWT_SECRET_KEY=$(openssl rand -hex 32)"

# Or using Python
python3 -c "import secrets; print('SECRET_KEY=' + secrets.token_hex(32)); print('JWT_SECRET_KEY=' + secrets.token_hex(32))"
```

### Test Keys Are Working

```bash
# Activate virtual environment
cd /var/www/peckup/peckup/backend
source venv/bin/activate

# Test in Python
python3 << EOF
from config import Config
print("SECRET_KEY:", Config.SECRET_KEY[:10] + "..." if Config.SECRET_KEY else "NOT SET")
print("JWT_SECRET_KEY:", Config.JWT_SECRET_KEY[:10] + "..." if Config.JWT_SECRET_KEY else "NOT SET")
EOF
```

## Summary

1. **Generate keys** using one of the methods above
2. **Create** `backend/.env` file
3. **Add** SECRET_KEY and JWT_SECRET_KEY
4. **Fill in** other configuration values
5. **Verify** keys are loaded correctly
6. **Never commit** .env file to Git

Your keys should be:
- ✅ Random and unpredictable
- ✅ At least 64 characters (32 bytes hex)
- ✅ Different for each environment
- ✅ Kept secret and secure

🎉 **You're ready to deploy!**
