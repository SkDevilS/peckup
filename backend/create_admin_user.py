#!/usr/bin/env python3
"""
Create Admin User
This script creates an admin user for testing.
"""

from app import create_app
from models import db, User

def create_admin_user():
    """Create an admin user"""
    
    app = create_app()
    
    with app.app_context():
        try:
            # Check if admin user already exists
            admin_user = User.query.filter_by(email='admin@peckup.com').first()
            
            if admin_user:
                print("ℹ️  Admin user already exists, updating password...")
                admin_user.set_password('admin123')
                admin_user.role = 'admin'
                admin_user.is_active = True
                admin_user.is_verified = True
            else:
                print("➕ Creating new admin user...")
                admin_user = User(
                    name='Admin User',
                    email='admin@peckup.in',
                    role='admin',
                    is_active=True,
                    is_verified=True
                )
                admin_user.set_password('admin@123')
                db.session.add(admin_user)
            
            db.session.commit()
            
            print("✅ Admin user created/updated successfully!")
            print("📧 Email: admin@peckup.com")
            print("🔑 Password: admin123")
            return True
            
        except Exception as e:
            db.session.rollback()
            print(f"❌ Error creating admin user: {e}")
            return False

if __name__ == "__main__":
    print("=" * 50)
    print("👤 Create Peckup Admin User")
    print("=" * 50)
    
    success = create_admin_user()
    
    if success:
        print("\n🎉 Admin user ready!")
        print("💡 You can now test admin login with:")
        print("   Email: admin@peckup.in")
        print("   Password: admin@123")
    else:
        print("\n❌ Failed to create admin user!")
        print("💡 Please check the error messages above.")