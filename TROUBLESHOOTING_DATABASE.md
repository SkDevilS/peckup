# 🔧 Database Connection Troubleshooting

## Your Error

```
pymysql.err.OperationalError: (2003, "Can't connect to MySQL server on '123@localhost'")
```

## Problem Analysis

The error `'123@localhost'` suggests your `.env` file has a formatting issue. The database password or username is being parsed incorrectly.

## Common Causes

### 1. Special Characters in Password Without Quotes

If your password contains special characters like `@`, `#`, `$`, etc., they need to be handled carefully.

### 2. Incorrect .env Format

The .env file format is sensitive to spaces and special characters.

## Solution Steps

### Step 1: Check Your Current .env File

```bash
cd /var/www/peckup/peckup/backend
cat .env | grep -E "DB_USER|DB_PASSWORD|DB_HOST"
```

### Step 2: Fix the .env File

```bash
nano .env
```

**CORRECT FORMAT:**

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=peckup_db
DB_USER=peckup_user
DB_PASSWORD=your_password_here
```

**IMPORTANT RULES:**
- ❌ NO spaces around `=`
- ❌ NO quotes around values (unless password has spaces)
- ❌ NO special formatting

**Examples:**

✅ **CORRECT:**
```env
DB_USER=peckup_user
DB_PASSWORD=MyPass123
DB_HOST=localhost
```

❌ **WRONG:**
```env
DB_USER = peckup_user          # Has spaces
DB_PASSWORD="MyPass123"        # Has quotes (not needed)
DB_HOST = localhost            # Has spaces
```

❌ **WRONG:**
```env
DB_USER=peckup_user@localhost  # @ in username
DB_PASSWORD=123@localhost      # @ in password
```

### Step 3: If Password Has Special Characters

If your password contains special characters, you have two options:

**Option A: Use a simpler password (Recommended)**

```bash
# Change MySQL password to something without special characters
sudo mysql

ALTER USER 'peckup_user'@'localhost' IDENTIFIED BY 'NewSimplePassword123';
FLUSH PRIVILEGES;
EXIT;
```

Then update .env:
```env
DB_PASSWORD=NewSimplePassword123
```

**Option B: Escape special characters**

If you must use special characters, escape them properly:

```env
# If password is: Pass@123
DB_PASSWORD=Pass@123

# If password has spaces: Pass 123
DB_PASSWORD="Pass 123"
```

### Step 4: Test Database Connection

```bash
# Test MySQL connection manually
mysql -u peckup_user -p peckup_db

# Enter your password when prompted
# If successful, you'll see: mysql>
# Type: EXIT;
```

### Step 5: Verify .env is Correct

```bash
cd /var/www/peckup/peckup/backend
source venv/bin/activate

# Test configuration loading
python3 << 'EOF'
from config import Config
import os

print("=== Database Configuration ===")
print(f"DB_HOST: {os.getenv('DB_HOST')}")
print(f"DB_PORT: {os.getenv('DB_PORT')}")
print(f"DB_NAME: {os.getenv('DB_NAME')}")
print(f"DB_USER: {os.getenv('DB_USER')}")
print(f"DB_PASSWORD: {'***' if os.getenv('DB_PASSWORD') else 'NOT SET'}")
print(f"\nConnection String: {Config.SQLALCHEMY_DATABASE_URI}")
EOF
```

Expected output:
```
=== Database Configuration ===
DB_HOST: localhost
DB_PORT: 3306
DB_NAME: peckup_db
DB_USER: peckup_user
DB_PASSWORD: ***

Connection String: mysql+pymysql://peckup_user:***@localhost:3306/peckup_db?charset=utf8mb4
```

### Step 6: Run init_db.py Again

```bash
python3 init_db.py
```

Should see:
```
Database tables created successfully!
```

## Complete .env Template

Here's a complete, working .env template:

```env
# Flask Configuration
FLASK_APP=app.py
FLASK_ENV=production
SECRET_KEY=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2
JWT_SECRET_KEY=z9y8x7w6v5u4t3s2r1q0p9o8n7m6l5k4j3i2h1g0f9e8d7c6b5a4z3y2x1w0v9u8

# Database Configuration (NO SPACES, NO QUOTES)
DB_HOST=localhost
DB_PORT=3306
DB_NAME=peckup_db
DB_USER=peckup_user
DB_PASSWORD=YourPasswordHere123

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
CORS_ORIGINS=https://peckup.in,https://www.peckup.in,https://admin.peckup.in
CORS_SUPPORTS_CREDENTIALS=True
CORS_MAX_AGE=3600

# Production Settings
DEBUG=False
TESTING=False
```

## Quick Fix Script

Run this to recreate your .env file:

```bash
cd /var/www/peckup/peckup/backend

# Backup current .env
cp .env .env.backup

# Prompt for database password
read -sp "Enter MySQL password for peckup_user: " DB_PASS
echo ""

# Generate secret keys
SECRET_KEY=$(python3 -c "import secrets; print(secrets.token_hex(32))")
JWT_SECRET_KEY=$(python3 -c "import secrets; print(secrets.token_hex(32))")

# Create new .env file
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
DB_PASSWORD=$DB_PASS

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
CORS_ORIGINS=https://peckup.in,https://www.peckup.in,https://admin.peckup.in
CORS_SUPPORTS_CREDENTIALS=True
CORS_MAX_AGE=3600

# Production Settings
DEBUG=False
TESTING=False
EOF

chmod 600 .env

echo "✅ .env file recreated!"
echo "Testing database connection..."

# Test connection
python3 << 'PYEOF'
from config import Config
print(f"Connection string: {Config.SQLALCHEMY_DATABASE_URI}")
PYEOF
```

## Verify MySQL is Running

```bash
# Check MySQL status
sudo systemctl status mysql

# If not running, start it
sudo systemctl start mysql

# Enable auto-start
sudo systemctl enable mysql
```

## Verify Database Exists

```bash
# Login to MySQL as root
sudo mysql

# Check if database exists
SHOW DATABASES;

# Check if user exists
SELECT User, Host FROM mysql.user WHERE User='peckup_user';

# If database doesn't exist, create it
CREATE DATABASE IF NOT EXISTS peckup_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# If user doesn't exist, create it
CREATE USER IF NOT EXISTS 'peckup_user'@'localhost' IDENTIFIED BY 'YourPasswordHere';
GRANT ALL PRIVILEGES ON peckup_db.* TO 'peckup_user'@'localhost';
FLUSH PRIVILEGES;

EXIT;
```

## Common Mistakes

### ❌ Mistake 1: Spaces in .env

```env
DB_USER = peckup_user    # WRONG
DB_USER=peckup_user      # CORRECT
```

### ❌ Mistake 2: Quotes when not needed

```env
DB_PASSWORD="MyPass123"  # WRONG (unless password has spaces)
DB_PASSWORD=MyPass123    # CORRECT
```

### ❌ Mistake 3: Special characters in username

```env
DB_USER=peckup_user@localhost  # WRONG
DB_USER=peckup_user            # CORRECT
```

### ❌ Mistake 4: Wrong host format

```env
DB_HOST=user@localhost   # WRONG
DB_HOST=localhost        # CORRECT
```

## After Fixing

1. **Test database connection:**
```bash
mysql -u peckup_user -p peckup_db
```

2. **Run init_db.py:**
```bash
cd /var/www/peckup/peckup/backend
source venv/bin/activate
python3 init_db.py
```

3. **Create admin user:**
```bash
python3 create_admin_user.py
```

4. **Start backend service:**
```bash
sudo systemctl restart peckup-backend
sudo systemctl status peckup-backend
```

## Still Having Issues?

### Check .env file encoding

```bash
file .env
# Should show: .env: ASCII text
```

### Check for hidden characters

```bash
cat -A .env | grep DB_
# Should NOT show ^M or other special characters
```

### Recreate .env from scratch

```bash
rm .env
nano .env
# Manually type (don't copy-paste) the configuration
```

## Summary

The error `'123@localhost'` means your .env file has formatting issues. Follow these steps:

1. ✅ Check .env format (no spaces, no unnecessary quotes)
2. ✅ Use simple password without special characters
3. ✅ Test MySQL connection manually
4. ✅ Verify .env loads correctly
5. ✅ Run init_db.py again

Your database connection should work after fixing the .env file format!
