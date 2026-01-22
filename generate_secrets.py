#!/usr/bin/env python3
"""
Secret Key Generator for Peckup Application
This script generates secure random keys for Flask SECRET_KEY and JWT_SECRET_KEY
"""

import secrets
import string

def generate_secret_key(length=64):
    """Generate a secure random secret key"""
    alphabet = string.ascii_letters + string.digits + string.punctuation
    return ''.join(secrets.choice(alphabet) for _ in range(length))

def generate_hex_key(length=32):
    """Generate a secure random hex key"""
    return secrets.token_hex(length)

def main():
    print("=" * 70)
    print("🔐 Peckup Secret Key Generator")
    print("=" * 70)
    print()
    
    # Generate keys
    secret_key = generate_hex_key(32)
    jwt_secret_key = generate_hex_key(32)
    
    print("✅ Generated secure keys for your application!")
    print()
    print("-" * 70)
    print("SECRET_KEY (Flask Session Key):")
    print("-" * 70)
    print(secret_key)
    print()
    print("-" * 70)
    print("JWT_SECRET_KEY (JWT Token Key):")
    print("-" * 70)
    print(jwt_secret_key)
    print()
    print("=" * 70)
    print()
    print("📋 Copy these keys to your backend/.env file:")
    print()
    print(f"SECRET_KEY={secret_key}")
    print(f"JWT_SECRET_KEY={jwt_secret_key}")
    print()
    print("=" * 70)
    print()
    print("⚠️  IMPORTANT SECURITY NOTES:")
    print("   1. Keep these keys SECRET - never commit them to Git")
    print("   2. Use different keys for development and production")
    print("   3. Store them securely (password manager recommended)")
    print("   4. Never share these keys publicly")
    print("   5. If compromised, generate new keys immediately")
    print()
    print("=" * 70)
    
    # Save to file option
    save = input("\n💾 Save keys to .env.secrets file? (yes/no): ").lower()
    if save == 'yes':
        with open('.env.secrets', 'w') as f:
            f.write("# Generated Secret Keys for Peckup Application\n")
            f.write("# DO NOT COMMIT THIS FILE TO GIT!\n")
            f.write(f"# Generated on: {secrets.token_hex(8)}\n\n")
            f.write(f"SECRET_KEY={secret_key}\n")
            f.write(f"JWT_SECRET_KEY={jwt_secret_key}\n")
        print("✅ Keys saved to .env.secrets")
        print("⚠️  Remember to add .env.secrets to .gitignore!")
    else:
        print("ℹ️  Keys not saved. Copy them manually to your .env file.")

if __name__ == "__main__":
    main()
