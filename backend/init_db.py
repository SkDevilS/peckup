"""
Initialize Peckup Database and Create Admin User

This script creates all database tables and sets up the default admin user.
Run this script once to set up the database.
"""

from app import create_app
from models import db, User

def init_database():
    app = create_app()
    
    with app.app_context():
        # Create all tables
        db.create_all()
        print("✓ Database tables created successfully!")
        
        # Check if admin user exists
        admin_email = 'admin@peckup.in'
        admin = User.query.filter_by(email=admin_email).first()
        
        if not admin:
            # Create admin user
            admin = User(
                name='Peckup Admin',
                email=admin_email,
                role='admin',
                is_active=True
            )
            admin.set_password('admin@123')
            
            db.session.add(admin)
            db.session.commit()
            print(f"✓ Admin user created: {admin_email}")
            print("  Password: admin@123")
        else:
            print(f"✓ Admin user already exists: {admin_email}")
        
        print("\n✓ Database initialization complete!")
        print("\nYou can now start the server with: python app.py")

if __name__ == '__main__':
    init_database()
