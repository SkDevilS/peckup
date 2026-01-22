import os
from datetime import timedelta
from dotenv import load_dotenv

load_dotenv()

class Config:
    # Flask Settings
    SECRET_KEY = os.getenv('SECRET_KEY', 'peckup-secret-key-2024')
    DEBUG = os.getenv('FLASK_DEBUG', 'True').lower() == 'true'
    
    # JWT Settings
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'peckup-jwt-secret-key-2024')
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=int(os.getenv('JWT_ACCESS_TOKEN_EXPIRES', 24)))
    JWT_REFRESH_TOKEN_EXPIRES = timedelta(hours=int(os.getenv('JWT_REFRESH_TOKEN_EXPIRES', 720)))
    JWT_IDENTITY_CLAIM = 'sub'
    JWT_TOKEN_LOCATION = ['headers']
    
    # Database Settings - Build URL from components
    @staticmethod
    def get_database_uri():
        db_type = os.getenv('DB_TYPE', 'mysql').lower()
        
        if db_type == 'sqlite':
            db_file = os.getenv('DB_FILE', 'peckup.db')
            return f'sqlite:///{db_file}'
        
        elif db_type == 'mysql':
            db_host = os.getenv('DB_HOST', 'localhost')
            db_port = os.getenv('DB_PORT', '3306')
            db_name = os.getenv('DB_NAME', 'peckup_db')
            db_user = os.getenv('DB_USER', 'root')
            db_password = os.getenv('DB_PASSWORD', '')
            db_charset = os.getenv('DB_CHARSET', 'utf8mb4')
            
            # Build MySQL connection string
            password_part = f':{db_password}' if db_password else ''
            return f'mysql+pymysql://{db_user}{password_part}@{db_host}:{db_port}/{db_name}?charset={db_charset}'
        
        elif db_type == 'postgresql':
            db_host = os.getenv('DB_HOST', 'localhost')
            db_port = os.getenv('DB_PORT', '5432')
            db_name = os.getenv('DB_NAME', 'peckup_db')
            db_user = os.getenv('DB_USER', 'postgres')
            db_password = os.getenv('DB_PASSWORD', '')
            
            # Build PostgreSQL connection string
            password_part = f':{db_password}' if db_password else ''
            return f'postgresql://{db_user}{password_part}@{db_host}:{db_port}/{db_name}'
        
        else:
            raise ValueError(f'Unsupported database type: {db_type}')
    
    SQLALCHEMY_DATABASE_URI = get_database_uri.__func__()
    SQLALCHEMY_TRACK_MODIFICATIONS = os.getenv('SQLALCHEMY_TRACK_MODIFICATIONS', 'False').lower() == 'true'
    SQLALCHEMY_ECHO = os.getenv('SQLALCHEMY_ECHO', 'False').lower() == 'true'
    SQLALCHEMY_POOL_SIZE = int(os.getenv('DB_POOL_SIZE', 10))
    SQLALCHEMY_POOL_RECYCLE = int(os.getenv('DB_POOL_RECYCLE', 3600))
    SQLALCHEMY_POOL_TIMEOUT = int(os.getenv('DB_POOL_TIMEOUT', 30))
    SQLALCHEMY_MAX_OVERFLOW = int(os.getenv('DB_MAX_OVERFLOW', 20))
    
    # File Upload Settings
    UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), 
                                  os.getenv('UPLOAD_FOLDER', 'uploads'))
    MAX_CONTENT_LENGTH = int(os.getenv('MAX_CONTENT_LENGTH', 16 * 1024 * 1024))
    ALLOWED_EXTENSIONS = set(os.getenv('ALLOWED_EXTENSIONS', 'png,jpg,jpeg,gif,webp').split(','))
    
    # Domain Configuration
    MAIN_DOMAIN = os.getenv('MAIN_DOMAIN', 'localhost')
    MAIN_URL = os.getenv('MAIN_URL', 'http://localhost:5173')
    ADMIN_DOMAIN = os.getenv('ADMIN_DOMAIN', 'localhost')
    ADMIN_URL = os.getenv('ADMIN_URL', 'http://localhost:5173')
    API_DOMAIN = os.getenv('API_DOMAIN', 'localhost')
    
    # API_URL: Determine based on environment
    # In production, this should be the public API URL (e.g., https://api.peckup.in)
    # In development, this should be localhost
    _default_api_url = 'http://localhost:5000' if os.getenv('FLASK_ENV') == 'development' else 'https://api.peckup.in'
    API_URL = os.getenv('API_URL', _default_api_url)
    
    # Upload URL Configuration (for serving uploaded files)
    # This is the public URL where uploaded files can be accessed
    # Defaults to API_URL + /uploads
    UPLOAD_BASE_URL = os.getenv('UPLOAD_BASE_URL', f"{API_URL}/uploads")
    
    # CORS Settings
    # Default CORS origins based on environment
    _default_cors = 'http://localhost:5173,http://localhost:5174' if os.getenv('FLASK_ENV') == 'development' else 'https://peckup.in,https://admin.peckup.in'
    CORS_ORIGINS = os.getenv('CORS_ORIGINS', _default_cors).split(',')
    CORS_SUPPORTS_CREDENTIALS = os.getenv('CORS_SUPPORTS_CREDENTIALS', 'True').lower() == 'true'
    CORS_MAX_AGE = int(os.getenv('CORS_MAX_AGE', 3600))
    
    # Helper method to get full upload URL
    @staticmethod
    def get_upload_url(filename):
        """Generate full URL for uploaded file"""
        upload_base = os.getenv('UPLOAD_BASE_URL')
        if not upload_base:
            api_url = os.getenv('API_URL', 'https://api.peckup.in')
            upload_base = f"{api_url}/uploads"
        return f"{upload_base}/{filename}"
    
    # Application Settings
    ITEMS_PER_PAGE = int(os.getenv('ITEMS_PER_PAGE', 20))
    SESSION_TIMEOUT = int(os.getenv('SESSION_TIMEOUT', 60))
    
    # Logging Settings
    LOG_LEVEL = os.getenv('LOG_LEVEL', 'INFO')
    LOG_FILE = os.getenv('LOG_FILE', 'logs/peckup.log')
    LOG_SQL_QUERIES = os.getenv('LOG_SQL_QUERIES', 'False').lower() == 'true'
