#!/usr/bin/env python3
"""
Database Setup Script for Peckup
This script creates the database, tables, and initial data
Reads configuration from .env file
"""

import os
import sys
from dotenv import load_dotenv
import pymysql
from sqlalchemy import create_engine, inspect
from sqlalchemy.exc import OperationalError, ProgrammingError

# Load environment variables
load_dotenv()

# Colors for terminal output
class Colors:
    GREEN = '\033[92m'
    RED = '\033[91m'
    YELLOW = '\033[93m'
    BLUE = '\033[94m'
    END = '\033[0m'
    BOLD = '\033[1m'

def print_success(message):
    print(f"{Colors.GREEN}✓ {message}{Colors.END}")

def print_error(message):
    print(f"{Colors.RED}✗ {message}{Colors.END}")

def print_info(message):
    print(f"{Colors.BLUE}ℹ {message}{Colors.END}")

def print_warning(message):
    print(f"{Colors.YELLOW}⚠ {message}{Colors.END}")

def print_header(message):
    print(f"\n{Colors.BOLD}{Colors.BLUE}{'='*70}{Colors.END}")
    print(f"{Colors.BOLD}{Colors.BLUE}{message}{Colors.END}")
    print(f"{Colors.BOLD}{Colors.BLUE}{'='*70}{Colors.END}\n")

def get_db_config():
    """Get database configuration from environment variables"""
    config = {
        'host': os.getenv('DB_HOST', 'localhost'),
        'port': int(os.getenv('DB_PORT', 3306)),
        'user': os.getenv('DB_USER', 'root'),
        'password': os.getenv('DB_PASSWORD', ''),
        'database': os.getenv('DB_NAME', 'peckup_db'),
        'charset': os.getenv('DB_CHARSET', 'utf8mb4')
    }
    return config

def test_mysql_connection(config):
    """Test if MySQL server is accessible"""
    print_info("Testing MySQL connection...")
    try:
        # Try to connect without database first
        conn = pymysql.connect(
            host=config['host'],
            port=config['port'],
            user=config['user'],
            password=config['password'],
            charset=config['charset']
        )
        conn.close()
        print_success("MySQL server is accessible")
        return True
    except pymysql.err.OperationalError as e:
        print_error(f"Cannot connect to MySQL server: {e}")
        print_info("Please check:")
        print_info("  1. MySQL is running: sudo systemctl status mysql")
        print_info("  2. Credentials in .env file are correct")
        print_info("  3. User has proper permissions")
        return False

def create_database_if_not_exists(config):
    """Create database if it doesn't exist"""
    print_info(f"Checking if database '{config['database']}' exists...")
    try:
        conn = pymysql.connect(
            host=config['host'],
            port=config['port'],
            user=config['user'],
            password=config['password'],
            charset=config['charset']
        )
        cursor = conn.cursor()
        
        # Check if database exists
        cursor.execute(f"SHOW DATABASES LIKE '{config['database']}'")
        result = cursor.fetchone()
        
        if result:
            print_success(f"Database '{config['database']}' already exists")
        else:
            print_info(f"Creating database '{config['database']}'...")
            cursor.execute(
                f"CREATE DATABASE {config['database']} "
                f"CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci"
            )
            print_success(f"Database '{config['database']}' created successfully")
        
        cursor.close()
        conn.close()
        return True
    except Exception as e:
        print_error(f"Error creating database: {e}")
        return False

def get_sqlalchemy_url(config):
    """Build SQLAlchemy connection URL"""
    password = config['password'].replace('@', '%40')  # URL encode @ symbol
    return (
        f"mysql+pymysql://{config['user']}:{password}@"
        f"{config['host']}:{config['port']}/{config['database']}"
        f"?charset={config['charset']}"
    )

def create_tables(config):
    """Create all tables using SQLAlchemy models"""
    print_info("Creating database tables...")
    
    try:
        # Import app and db
        from app import create_app
        from models import db
        
        # Create app context
        app = create_app()
        
        with app.app_context():
            # Create all tables
            db.create_all()
            
            # Verify tables were created
            inspector = inspect(db.engine)
            tables = inspector.get_table_names()
            
            if tables:
                print_success(f"Created {len(tables)} tables:")
                for table in sorted(tables):
                    print(f"  • {table}")
                return True
            else:
                print_error("No tables were created")
                return False
                
    except Exception as e:
        print_error(f"Error creating tables: {e}")
        import traceback
        traceback.print_exc()
        return False

def verify_tables(config):
    """Verify all required tables exist"""
    print_info("Verifying database tables...")
    
    required_tables = [
        'users',
        'sections',
        'products',
        'cart_items',
        'wishlist_items',
        'addresses',
        'orders',
        'order_items',
        'analytics'
    ]
    
    try:
        conn = pymysql.connect(
            host=config['host'],
            port=config['port'],
            user=config['user'],
            password=config['password'],
            database=config['database'],
            charset=config['charset']
        )
        cursor = conn.cursor()
        
        cursor.execute("SHOW TABLES")
        existing_tables = [table[0] for table in cursor.fetchall()]
        
        missing_tables = [t for t in required_tables if t not in existing_tables]
        
        if missing_tables:
            print_warning(f"Missing tables: {', '.join(missing_tables)}")
            return False
        else:
            print_success("All required tables exist")
            return True
            
    except Exception as e:
        print_error(f"Error verifying tables: {e}")
        return False
    finally:
        cursor.close()
        conn.close()

def create_default_sections(config):
    """Create default product sections"""
    print_info("Creating default sections...")
    
    try:
        from app import create_app
        from models import db, Section
        
        app = create_app()
        
        with app.app_context():
            # Check if sections already exist
            existing_count = Section.query.count()
            
            if existing_count > 0:
                print_info(f"Sections already exist ({existing_count} sections)")
                return True
            
            # Create default sections
            default_sections = [
                {
                    'name': 'Featured Products',
                    'slug': 'featured',
                    'description': 'Our handpicked featured products',
                    'display_order': 1,
                    'is_active': True
                },
                {
                    'name': 'New Arrivals',
                    'slug': 'new-arrivals',
                    'description': 'Latest products in our store',
                    'display_order': 2,
                    'is_active': True
                },
                {
                    'name': 'Best Sellers',
                    'slug': 'best-sellers',
                    'description': 'Most popular products',
                    'display_order': 3,
                    'is_active': True
                }
            ]
            
            for section_data in default_sections:
                section = Section(**section_data)
                db.session.add(section)
            
            db.session.commit()
            print_success(f"Created {len(default_sections)} default sections")
            return True
            
    except Exception as e:
        print_error(f"Error creating default sections: {e}")
        return False

def show_summary(config):
    """Show summary of database setup"""
    print_header("Database Setup Summary")
    
    try:
        conn = pymysql.connect(
            host=config['host'],
            port=config['port'],
            user=config['user'],
            password=config['password'],
            database=config['database'],
            charset=config['charset']
        )
        cursor = conn.cursor()
        
        # Get table count
        cursor.execute("SHOW TABLES")
        tables = cursor.fetchall()
        
        print(f"Database: {config['database']}")
        print(f"Host: {config['host']}:{config['port']}")
        print(f"User: {config['user']}")
        print(f"Tables: {len(tables)}")
        print()
        
        # Get row counts for each table
        print("Table Statistics:")
        print("-" * 50)
        for (table_name,) in sorted(tables):
            cursor.execute(f"SELECT COUNT(*) FROM {table_name}")
            count = cursor.fetchone()[0]
            print(f"  {table_name:20} {count:>10} rows")
        
        cursor.close()
        conn.close()
        
    except Exception as e:
        print_error(f"Error getting summary: {e}")

def main():
    """Main function"""
    print_header("Peckup Database Setup")
    
    # Check if .env file exists
    if not os.path.exists('.env'):
        print_error(".env file not found!")
        print_info("Please create .env file with database configuration")
        print_info("See .env.production for template")
        sys.exit(1)
    
    print_success(".env file found")
    
    # Get database configuration
    config = get_db_config()
    
    print_info("Database Configuration:")
    print(f"  Host: {config['host']}:{config['port']}")
    print(f"  Database: {config['database']}")
    print(f"  User: {config['user']}")
    print(f"  Password: {'*' * len(config['password'])}")
    print()
    
    # Step 1: Test MySQL connection
    if not test_mysql_connection(config):
        sys.exit(1)
    
    # Step 2: Create database if not exists
    if not create_database_if_not_exists(config):
        sys.exit(1)
    
    # Step 3: Create tables
    if not create_tables(config):
        sys.exit(1)
    
    # Step 4: Verify tables
    if not verify_tables(config):
        print_warning("Some tables are missing, but continuing...")
    
    # Step 5: Create default sections
    create_default_sections(config)
    
    # Step 6: Show summary
    show_summary(config)
    
    print_header("Database Setup Complete!")
    print_success("Database is ready to use")
    print()
    print_info("Next steps:")
    print_info("  1. Create admin user: python create_admin_user.py")
    print_info("  2. Start the application: python app.py")
    print()

if __name__ == '__main__':
    main()
