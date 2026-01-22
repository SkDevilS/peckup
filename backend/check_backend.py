#!/usr/bin/env python3
"""
Quick backend health check for Peckup
"""

import sys
import os

def check_dependencies():
    """Check if required Python packages are installed"""
    required_packages = [
        'flask',
        'flask_sqlalchemy', 
        'flask_jwt_extended',
        'flask_cors',
        'werkzeug',
        'reportlab'
    ]
    
    missing = []
    for package in required_packages:
        try:
            __import__(package)
        except ImportError:
            missing.append(package)
    
    if missing:
        print(f"❌ Missing packages: {', '.join(missing)}")
        print("💡 Install with: pip install flask flask-sqlalchemy flask-jwt-extended flask-cors reportlab")
        return False
    
    print("✅ All required packages are installed")
    return True

def check_database():
    """Check if database can be initialized"""
    try:
        from models import db, User, Product, Order, Address
        print("✅ Database models imported successfully")
        return True
    except Exception as e:
        print(f"❌ Database model error: {e}")
        return False

def check_config():
    """Check configuration"""
    try:
        from config import Config
        print("✅ Configuration loaded successfully")
        return True
    except Exception as e:
        print(f"❌ Configuration error: {e}")
        return False

def main():
    print("🔍 Peckup Backend Health Check")
    print("=" * 40)
    
    # Check if we're in the right directory
    if not os.path.exists('app.py'):
        print("❌ app.py not found. Run this from the backend directory.")
        return False
    
    # Run checks
    checks = [
        ("Dependencies", check_dependencies),
        ("Database Models", check_database), 
        ("Configuration", check_config)
    ]
    
    all_passed = True
    for name, check_func in checks:
        print(f"\n{name}:")
        if not check_func():
            all_passed = False
    
    print("\n" + "=" * 40)
    if all_passed:
        print("🎉 Backend health check passed!")
        print("💡 Start the server with: python app.py")
        return True
    else:
        print("❌ Some checks failed. Please fix the issues above.")
        return False

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)