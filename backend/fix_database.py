#!/usr/bin/env python3
"""
Fix Database Schema
This script adds the missing is_verified column to the users table.
"""

from sqlalchemy import create_engine, text
from config import Config

def fix_database():
    """Add missing is_verified column"""
    
    # Get database URL from config
    config = Config()
    database_url = config.SQLALCHEMY_DATABASE_URI
    
    if not database_url:
        print("❌ Error: SQLALCHEMY_DATABASE_URI not found in config")
        return False
    
    try:
        # Create engine
        engine = create_engine(database_url)
        
        print("🔧 Fixing database schema...")
        
        with engine.connect() as conn:
            # Start transaction
            trans = conn.begin()
            
            try:
                # Check if is_verified column exists
                result = conn.execute(text("SHOW COLUMNS FROM users LIKE 'is_verified'"))
                column_exists = result.fetchone() is not None
                
                if not column_exists:
                    print("➕ Adding is_verified column...")
                    conn.execute(text("ALTER TABLE users ADD COLUMN is_verified BOOLEAN DEFAULT 0"))
                    print("✅ Added is_verified column")
                else:
                    print("ℹ️  is_verified column already exists")
                
                # Check if email_verified_at column exists
                result = conn.execute(text("SHOW COLUMNS FROM users LIKE 'email_verified_at'"))
                column_exists = result.fetchone() is not None
                
                if not column_exists:
                    print("➕ Adding email_verified_at column...")
                    conn.execute(text("ALTER TABLE users ADD COLUMN email_verified_at DATETIME"))
                    print("✅ Added email_verified_at column")
                else:
                    print("ℹ️  email_verified_at column already exists")
                
                # Check if last_login_at column exists
                result = conn.execute(text("SHOW COLUMNS FROM users LIKE 'last_login_at'"))
                column_exists = result.fetchone() is not None
                
                if not column_exists:
                    print("➕ Adding last_login_at column...")
                    conn.execute(text("ALTER TABLE users ADD COLUMN last_login_at DATETIME"))
                    print("✅ Added last_login_at column")
                else:
                    print("ℹ️  last_login_at column already exists")
                
                # Check if login_count column exists
                result = conn.execute(text("SHOW COLUMNS FROM users LIKE 'login_count'"))
                column_exists = result.fetchone() is not None
                
                if not column_exists:
                    print("➕ Adding login_count column...")
                    conn.execute(text("ALTER TABLE users ADD COLUMN login_count INTEGER DEFAULT 0"))
                    print("✅ Added login_count column")
                else:
                    print("ℹ️  login_count column already exists")
                
                # Commit transaction
                trans.commit()
                
                print("✅ Database schema fixed successfully!")
                return True
                
            except Exception as e:
                # Rollback on error
                trans.rollback()
                print(f"❌ Error fixing database: {e}")
                return False
                
    except Exception as e:
        print(f"❌ Database connection error: {e}")
        return False

if __name__ == "__main__":
    print("=" * 50)
    print("🔧 Peckup Database Schema Fix")
    print("=" * 50)
    
    success = fix_database()
    
    if success:
        print("\n🎉 Database fixed successfully!")
        print("💡 You can now restart the backend server and test admin APIs.")
    else:
        print("\n❌ Database fix failed!")
        print("💡 Please check the error messages above.")