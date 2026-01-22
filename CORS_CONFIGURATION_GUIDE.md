# 🔒 CORS Configuration Guide

## What is CORS?

CORS (Cross-Origin Resource Sharing) is a security feature that controls which domains can access your API.

## Understanding Your Domains

Your Peckup application has 3 domains:

```
┌─────────────────────────────────────────────────────────────┐
│  1. peckup.in (Main Website)                                │
│     - Customer-facing store                                 │
│     - Needs to call API                                     │
│     - ✅ MUST be in CORS_ORIGINS                            │
│                                                              │
│  2. admin.peckup.in (Admin Dashboard)                       │
│     - Admin panel                                           │
│     - Needs to call API                                     │
│     - ✅ MUST be in CORS_ORIGINS                            │
│                                                              │
│  3. api.peckup.in (API Backend)                             │
│     - The API itself                                        │
│     - Doesn't call itself from browser                      │
│     - ❌ NOT needed in CORS_ORIGINS                         │
└─────────────────────────────────────────────────────────────┘
```

## Why api.peckup.in is NOT in CORS

### Same-Origin Policy

When the API calls itself, it's the **same origin**, so CORS doesn't apply.

```
❌ WRONG THINKING:
"The API needs to access itself, so add api.peckup.in to CORS"

✅ CORRECT THINKING:
"Only the FRONTEND domains (peckup.in, admin.peckup.in) need to 
access the API from the browser, so only they need CORS"
```

### How It Works

```
Browser at peckup.in
    │
    ├─→ Makes request to api.peckup.in
    │   (Different origin - CORS check happens)
    │
    └─→ CORS allows it because peckup.in is in CORS_ORIGINS ✓

Browser at admin.peckup.in
    │
    ├─→ Makes request to api.peckup.in
    │   (Different origin - CORS check happens)
    │
    └─→ CORS allows it because admin.peckup.in is in CORS_ORIGINS ✓

Server at api.peckup.in
    │
    ├─→ Internal function calls
    │   (Same origin - NO CORS check)
    │
    └─→ No CORS needed ✓
```

## Correct CORS Configuration

### Production (.env)

```env
# CORS Configuration
# Only include domains that will access the API from a browser
CORS_ORIGINS=https://peckup.in,https://www.peckup.in,https://admin.peckup.in
```

**Breakdown:**
- `https://peckup.in` - Main website
- `https://www.peckup.in` - Main website with www
- `https://admin.peckup.in` - Admin dashboard
- ❌ NOT `https://api.peckup.in` - The API itself

### Development (.env)

```env
# CORS Configuration
# Include localhost for local development
CORS_ORIGINS=http://localhost:5173,http://localhost:5174,http://127.0.0.1:5173
```

**Breakdown:**
- `http://localhost:5173` - Vite dev server (main)
- `http://localhost:5174` - Vite dev server (alternate port)
- `http://127.0.0.1:5173` - Same as localhost (some browsers use this)
- ❌ NOT `http://localhost:5000` - The API itself

## Common Mistakes

### ❌ Mistake 1: Adding API domain to CORS

```env
# WRONG
CORS_ORIGINS=https://peckup.in,https://admin.peckup.in,https://api.peckup.in
```

**Why it's wrong:** The API doesn't need to access itself via CORS.

**Fix:**
```env
# CORRECT
CORS_ORIGINS=https://peckup.in,https://www.peckup.in,https://admin.peckup.in
```

### ❌ Mistake 2: Forgetting www subdomain

```env
# INCOMPLETE
CORS_ORIGINS=https://peckup.in,https://admin.peckup.in
```

**Why it's wrong:** Users might access `www.peckup.in` and get CORS errors.

**Fix:**
```env
# COMPLETE
CORS_ORIGINS=https://peckup.in,https://www.peckup.in,https://admin.peckup.in
```

### ❌ Mistake 3: Using wildcard in production

```env
# INSECURE
CORS_ORIGINS=*
```

**Why it's wrong:** Allows ANY domain to access your API (security risk).

**Fix:**
```env
# SECURE
CORS_ORIGINS=https://peckup.in,https://www.peckup.in,https://admin.peckup.in
```

### ❌ Mistake 4: Spaces in CORS_ORIGINS

```env
# WRONG (has spaces)
CORS_ORIGINS=https://peckup.in, https://admin.peckup.in
```

**Why it's wrong:** Spaces break the parsing.

**Fix:**
```env
# CORRECT (no spaces)
CORS_ORIGINS=https://peckup.in,https://admin.peckup.in
```

### ❌ Mistake 5: Mixing HTTP and HTTPS

```env
# WRONG (mixed protocols)
CORS_ORIGINS=http://peckup.in,https://admin.peckup.in
```

**Why it's wrong:** Production should use HTTPS only.

**Fix:**
```env
# CORRECT (all HTTPS)
CORS_ORIGINS=https://peckup.in,https://admin.peckup.in
```

## Testing CORS

### Test from Browser Console

1. Open `https://peckup.in` in browser
2. Open Developer Tools (F12)
3. Go to Console tab
4. Run:

```javascript
fetch('https://api.peckup.in/api/health')
  .then(r => r.json())
  .then(data => console.log('✓ CORS working:', data))
  .catch(err => console.error('✗ CORS error:', err));
```

**Expected:** `✓ CORS working: {status: 'ok', ...}`

### Test with curl

```bash
# Test CORS headers
curl -I -X OPTIONS https://api.peckup.in/api/health \
  -H "Origin: https://peckup.in" \
  -H "Access-Control-Request-Method: GET"
```

**Expected response headers:**
```
Access-Control-Allow-Origin: https://peckup.in
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS, PATCH
Access-Control-Allow-Headers: Content-Type, Authorization, ...
```

### Test from Admin Panel

1. Open `https://admin.peckup.in/admin/login`
2. Try to login
3. Check Network tab in Developer Tools
4. Look for API requests to `api.peckup.in`

**Expected:** No CORS errors, requests succeed

## Troubleshooting

### Error: "blocked by CORS policy"

**Symptom:** Browser console shows:
```
Access to fetch at 'https://api.peckup.in/api/...' from origin 
'https://peckup.in' has been blocked by CORS policy
```

**Solution:**

1. Check CORS_ORIGINS in backend/.env:
```bash
ssh root@your-vps-ip
cd /var/www/peckup/peckup/backend
grep CORS_ORIGINS .env
```

2. Should show:
```
CORS_ORIGINS=https://peckup.in,https://www.peckup.in,https://admin.peckup.in
```

3. If wrong, fix it:
```bash
nano .env
# Update CORS_ORIGINS
# Save (Ctrl+X, Y, Enter)
```

4. Restart backend:
```bash
sudo systemctl restart peckup-backend
```

5. Clear browser cache and test again

### Error: CORS works for peckup.in but not www.peckup.in

**Cause:** Missing `www.peckup.in` in CORS_ORIGINS

**Solution:**
```bash
# Add www subdomain
nano backend/.env
# Change:
# CORS_ORIGINS=https://peckup.in,https://admin.peckup.in
# To:
# CORS_ORIGINS=https://peckup.in,https://www.peckup.in,https://admin.peckup.in

sudo systemctl restart peckup-backend
```

### Error: CORS works locally but not in production

**Cause:** Production .env has localhost in CORS_ORIGINS

**Solution:**
```bash
# Check production .env
cat backend/.env | grep CORS_ORIGINS

# Should NOT contain localhost
# If it does, fix it:
nano backend/.env
# Remove localhost, add production domains
sudo systemctl restart peckup-backend
```

## Complete Configuration Examples

### Production Environment

```env
# Flask Configuration
FLASK_APP=app.py
FLASK_ENV=production
SECRET_KEY=your-generated-secret-key
JWT_SECRET_KEY=your-generated-jwt-secret-key

# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=peckup_db
DB_USER=peckup_user
DB_PASSWORD=your-mysql-password

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

# CORS Configuration (ONLY frontend domains)
CORS_ORIGINS=https://peckup.in,https://www.peckup.in,https://admin.peckup.in
CORS_SUPPORTS_CREDENTIALS=True
CORS_MAX_AGE=3600

# Production Settings
DEBUG=False
TESTING=False
```

### Development Environment

```env
# Flask Configuration
FLASK_APP=app.py
FLASK_ENV=development
SECRET_KEY=dev-secret-key
JWT_SECRET_KEY=dev-jwt-secret-key

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

# Domain Configuration
MAIN_DOMAIN=localhost
MAIN_URL=http://localhost:5173
ADMIN_DOMAIN=localhost
ADMIN_URL=http://localhost:5173
API_DOMAIN=localhost
API_URL=http://localhost:5000

# Upload URL Configuration
UPLOAD_BASE_URL=http://localhost:5000/uploads

# CORS Configuration (ONLY frontend localhost ports)
CORS_ORIGINS=http://localhost:5173,http://localhost:5174,http://127.0.0.1:5173
CORS_SUPPORTS_CREDENTIALS=True
CORS_MAX_AGE=3600

# Development Settings
DEBUG=True
TESTING=False
```

## Quick Reference

### What to Include in CORS_ORIGINS

| Domain | Include? | Why |
|--------|----------|-----|
| `peckup.in` | ✅ YES | Main website (frontend) |
| `www.peckup.in` | ✅ YES | Main website with www |
| `admin.peckup.in` | ✅ YES | Admin dashboard (frontend) |
| `api.peckup.in` | ❌ NO | API itself (backend) |

### Format Rules

- ✅ Use commas (no spaces): `domain1,domain2,domain3`
- ✅ Include protocol: `https://peckup.in`
- ✅ Include www if used: `https://www.peckup.in`
- ❌ No trailing slashes: `https://peckup.in/` ← WRONG
- ❌ No wildcards in production: `*` ← INSECURE

## Summary

✅ **CORS_ORIGINS should include:**
- Main website: `https://peckup.in`
- Main website with www: `https://www.peckup.in`
- Admin dashboard: `https://admin.peckup.in`

❌ **CORS_ORIGINS should NOT include:**
- API domain: `https://api.peckup.in`
- Localhost (in production)
- Wildcards (`*`)

**Remember:** CORS is for controlling which **frontend domains** can access your API from a browser. The API itself doesn't need permission to access itself!

🎯 **Correct Production CORS:**
```env
CORS_ORIGINS=https://peckup.in,https://www.peckup.in,https://admin.peckup.in
```
