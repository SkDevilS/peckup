# 🔧 Localhost Conflict Fix Summary

## Problem

Hardcoded `localhost:5000` URLs in the code would cause conflicts when deploying to production on `api.peckup.in`.

## Solution

All hardcoded localhost references have been replaced with environment-based configuration.

## Changes Made

### 1. backend/routes/admin.py

**Before:**
```python
api_url = current_app.config.get('API_URL', 'http://localhost:5000')
upload_base_url = f"{api_url}/uploads"
```

**After:**
```python
upload_base_url = current_app.config.get('UPLOAD_BASE_URL')
if not upload_base_url:
    api_url = current_app.config.get('API_URL')
    if not api_url:
        # Fallback to request context
        from flask import request
        api_url = f"{request.scheme}://{request.host}"
    upload_base_url = f"{api_url}/uploads"
```

### 2. backend/app.py

**Before:**
```python
'sample_urls': [
    f"http://localhost:5000/uploads/products/{f}" for f in files_in_products[:3]
]
```

**After:**
```python
upload_base_url = app.config.get('UPLOAD_BASE_URL')
if not upload_base_url:
    api_url = app.config.get('API_URL', 'https://api.peckup.in')
    upload_base_url = f"{api_url}/uploads"

'sample_urls': [
    f"{upload_base_url}/products/{f}" for f in files_in_products[:3]
]
```

### 3. backend/config.py

**Already Fixed:**
```python
# Smart default based on environment
_default_api_url = 'http://localhost:5000' if os.getenv('FLASK_ENV') == 'development' else 'https://api.peckup.in'
API_URL = os.getenv('API_URL', _default_api_url)
```

This ensures:
- Development: Uses `http://localhost:5000`
- Production: Uses `https://api.peckup.in`

## How It Works Now

### Development Environment

When `FLASK_ENV=development`:
```env
API_URL=http://localhost:5000
UPLOAD_BASE_URL=http://localhost:5000/uploads
```

### Production Environment

When `FLASK_ENV=production`:
```env
API_URL=https://api.peckup.in
UPLOAD_BASE_URL=https://api.peckup.in/uploads
```

## Fallback Chain

The code now uses a smart fallback chain:

1. **First**: Check `UPLOAD_BASE_URL` in config
2. **Second**: Check `API_URL` in config and append `/uploads`
3. **Third**: Use request context to build URL dynamically
4. **Last Resort**: Use environment-based default

```python
# Priority 1: UPLOAD_BASE_URL from .env
upload_base_url = current_app.config.get('UPLOAD_BASE_URL')

if not upload_base_url:
    # Priority 2: API_URL from .env + /uploads
    api_url = current_app.config.get('API_URL')
    
    if not api_url:
        # Priority 3: Build from request context
        from flask import request
        api_url = f"{request.scheme}://{request.host}"
    
    upload_base_url = f"{api_url}/uploads"
```

## Verification

### Run the Check Script

```bash
chmod +x scripts/check-localhost-references.sh
./scripts/check-localhost-references.sh
```

This will scan your codebase for any hardcoded localhost references.

### Manual Verification

#### Check Backend Configuration

```bash
cd backend
source venv/bin/activate

# Test development config
export FLASK_ENV=development
python3 << EOF
from config import Config
print(f"Dev API_URL: {Config.API_URL}")
print(f"Dev UPLOAD_BASE_URL: {Config.UPLOAD_BASE_URL}")
EOF

# Test production config
export FLASK_ENV=production
python3 << EOF
from config import Config
print(f"Prod API_URL: {Config.API_URL}")
print(f"Prod UPLOAD_BASE_URL: {Config.UPLOAD_BASE_URL}")
EOF
```

Expected output:
```
Dev API_URL: http://localhost:5000
Dev UPLOAD_BASE_URL: http://localhost:5000/uploads
Prod API_URL: https://api.peckup.in
Prod UPLOAD_BASE_URL: https://api.peckup.in/uploads
```

#### Check Image URL Generation

```bash
# In Python shell
cd backend
source venv/bin/activate
python3 << EOF
import os
os.environ['FLASK_ENV'] = 'production'
os.environ['API_URL'] = 'https://api.peckup.in'
os.environ['UPLOAD_BASE_URL'] = 'https://api.peckup.in/uploads'

from config import Config
print(f"Image URL: {Config.get_upload_url('products/test.jpg')}")
EOF
```

Expected output:
```
Image URL: https://api.peckup.in/uploads/products/test.jpg
```

## Testing

### Test in Development

1. Create `backend/.env`:
```env
FLASK_ENV=development
API_URL=http://localhost:5000
UPLOAD_BASE_URL=http://localhost:5000/uploads
```

2. Start backend:
```bash
cd backend
source venv/bin/activate
python app.py
```

3. Upload an image via admin panel
4. Check the returned URL - should be `http://localhost:5000/uploads/...`

### Test in Production

1. Create `backend/.env` on VPS:
```env
FLASK_ENV=production
API_URL=https://api.peckup.in
UPLOAD_BASE_URL=https://api.peckup.in/uploads
```

2. Start backend:
```bash
sudo systemctl restart peckup-backend
```

3. Upload an image via admin panel
4. Check the returned URL - should be `https://api.peckup.in/uploads/...`

## Benefits

### ✅ No Hardcoded URLs
- All URLs come from environment variables
- Easy to change without code modifications

### ✅ Environment-Aware
- Automatically uses correct URLs based on `FLASK_ENV`
- Development and production can coexist

### ✅ Flexible Fallbacks
- Multiple fallback options ensure it always works
- Can even build URLs from request context if needed

### ✅ No Conflicts
- Production will never use localhost
- Development will never use production URLs

## Configuration Reference

### Required Environment Variables

| Variable | Development | Production |
|----------|-------------|------------|
| `FLASK_ENV` | `development` | `production` |
| `API_URL` | `http://localhost:5000` | `https://api.peckup.in` |
| `UPLOAD_BASE_URL` | `http://localhost:5000/uploads` | `https://api.peckup.in/uploads` |

### Optional (with Smart Defaults)

If you don't set `API_URL`, it will default based on `FLASK_ENV`:
- Development: `http://localhost:5000`
- Production: `https://api.peckup.in`

If you don't set `UPLOAD_BASE_URL`, it will be constructed as:
- `{API_URL}/uploads`

## Troubleshooting

### Issue: Images still showing localhost URLs in production

**Check:**
```bash
# On VPS
cd /var/www/peckup/peckup/backend
cat .env | grep API_URL
cat .env | grep UPLOAD_BASE_URL
```

**Should show:**
```
API_URL=https://api.peckup.in
UPLOAD_BASE_URL=https://api.peckup.in/uploads
```

**If not, fix it:**
```bash
nano .env
# Update the URLs
# Save and restart
sudo systemctl restart peckup-backend
```

### Issue: Configuration not loading

**Check:**
```bash
cd /var/www/peckup/peckup/backend
source venv/bin/activate
python3 -c "from config import Config; print(Config.API_URL)"
```

**Should output:**
```
https://api.peckup.in
```

### Issue: Still seeing localhost in logs

**Check logs:**
```bash
sudo journalctl -u peckup-backend -n 50 | grep localhost
```

**If found:**
1. Verify `.env` file has correct values
2. Restart backend: `sudo systemctl restart peckup-backend`
3. Clear browser cache
4. Test again

## Summary

✅ **All hardcoded localhost references removed**
✅ **Environment-based configuration implemented**
✅ **Smart fallbacks in place**
✅ **Development and production work independently**
✅ **No conflicts when deploying to api.peckup.in**

Your application is now ready for production deployment without any localhost conflicts! 🎉

## Quick Checklist

Before deploying to production:

- [ ] Run `./scripts/check-localhost-references.sh`
- [ ] Verify `.env` on VPS has `API_URL=https://api.peckup.in`
- [ ] Verify `.env` on VPS has `UPLOAD_BASE_URL=https://api.peckup.in/uploads`
- [ ] Verify `.env` on VPS has `FLASK_ENV=production`
- [ ] Test image upload after deployment
- [ ] Check image URLs in API responses
- [ ] Verify images load correctly in browser

All checks passed? You're good to go! 🚀
