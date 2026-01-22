from datetime import datetime
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    
    # Basic Information
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    
    # Contact Information
    phone = db.Column(db.String(20))
    
    # System Fields
    role = db.Column(db.String(20), default='customer')  # customer or admin
    is_active = db.Column(db.Boolean, default=True)
    is_verified = db.Column(db.Boolean, default=False)
    email_verified_at = db.Column(db.DateTime)
    last_login_at = db.Column(db.DateTime)
    login_count = db.Column(db.Integer, default=0)
    
    # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    addresses = db.relationship('Address', backref='user', lazy=True, cascade='all, delete-orphan')
    orders = db.relationship('Order', backref='user', lazy=True, cascade='all, delete-orphan')
    cart_items = db.relationship('CartItem', backref='user', lazy=True, cascade='all, delete-orphan')
    wishlist_items = db.relationship('WishlistItem', backref='user', lazy=True, cascade='all, delete-orphan')
    
    def set_password(self, password):
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)
    
    def to_dict(self, include_sensitive=False):
        data = {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'phone': self.phone,
            'role': self.role,
            'is_active': self.is_active,
            'is_verified': self.is_verified,
            'email_verified_at': self.email_verified_at.isoformat() if self.email_verified_at else None,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
        
        # Include sensitive data only if requested (for admin)
        if include_sensitive:
            data.update({
                'last_login_at': self.last_login_at.isoformat() if self.last_login_at else None,
                'login_count': self.login_count,
            })
        
        return data
    
    def update_login_info(self):
        """Update login timestamp and count"""
        self.last_login_at = datetime.utcnow()
        self.login_count = (self.login_count or 0) + 1

class Address(db.Model):
    __tablename__ = 'addresses'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    full_name = db.Column(db.String(100), nullable=False)
    phone = db.Column(db.String(20), nullable=False)
    address_line1 = db.Column(db.String(255), nullable=False)
    address_line2 = db.Column(db.String(255))
    city = db.Column(db.String(100), nullable=False)
    state = db.Column(db.String(100), nullable=False)
    pincode = db.Column(db.String(10), nullable=False)
    is_default = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'full_name': self.full_name,
            'phone': self.phone,
            'address_line1': self.address_line1,
            'address_line2': self.address_line2,
            'city': self.city,
            'state': self.state,
            'pincode': self.pincode,
            'is_default': self.is_default
        }

class Section(db.Model):
    __tablename__ = 'sections'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False, unique=True)
    slug = db.Column(db.String(100), nullable=False, unique=True, index=True)
    description = db.Column(db.Text)
    display_order = db.Column(db.Integer, default=0)
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    products = db.relationship('Product', backref='section', lazy=True)
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'slug': self.slug,
            'description': self.description,
            'display_order': self.display_order,
            'is_active': self.is_active,
            'product_count': len(self.products)
        }

class Product(db.Model):
    __tablename__ = 'products'
    
    id = db.Column(db.Integer, primary_key=True)
    sku = db.Column(db.String(50), unique=True, nullable=False, index=True)
    title = db.Column(db.String(255), nullable=False)
    slug = db.Column(db.String(255), nullable=False, unique=True, index=True)
    description = db.Column(db.Text)
    price = db.Column(db.Float, nullable=False)
    original_price = db.Column(db.Float)
    is_on_sale = db.Column(db.Boolean, default=False)
    stock = db.Column(db.Integer, default=0)
    section_id = db.Column(db.Integer, db.ForeignKey('sections.id'), nullable=False)
    images = db.Column(db.Text)  # JSON string of image URLs
    sizes = db.Column(db.Text)  # JSON string of sizes
    colors = db.Column(db.Text)  # JSON string of colors
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        import json
        return {
            'id': self.id,
            'sku': self.sku,
            'title': self.title,
            'slug': self.slug,
            'description': self.description,
            'price': self.price,
            'original_price': self.original_price,
            'is_on_sale': self.is_on_sale,
            'stock': self.stock,
            'section_id': self.section_id,
            'category': self.section.slug if self.section else None,
            'images': json.loads(self.images) if self.images else [],
            'sizes': json.loads(self.sizes) if self.sizes else [],
            'colors': json.loads(self.colors) if self.colors else [],
            'is_active': self.is_active
        }

class CartItem(db.Model):
    __tablename__ = 'cart_items'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('products.id'), nullable=False)
    quantity = db.Column(db.Integer, default=1)
    size = db.Column(db.String(50))
    color = db.Column(db.String(50))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    product = db.relationship('Product', backref='cart_items')
    
    def to_dict(self):
        return {
            'id': self.id,
            'product': self.product.to_dict() if self.product else None,
            'quantity': self.quantity,
            'size': self.size,
            'color': self.color
        }

class WishlistItem(db.Model):
    __tablename__ = 'wishlist_items'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('products.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    product = db.relationship('Product', backref='wishlist_items')
    
    def to_dict(self):
        return {
            'id': self.id,
            'product': self.product.to_dict() if self.product else None
        }

class Order(db.Model):
    __tablename__ = 'orders'
    
    id = db.Column(db.Integer, primary_key=True)
    order_number = db.Column(db.String(50), unique=True, nullable=False, index=True)
    receipt_number = db.Column(db.String(20), unique=True, nullable=False, index=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    address_id = db.Column(db.Integer, db.ForeignKey('addresses.id'), nullable=False)
    total_amount = db.Column(db.Float, nullable=False)
    status = db.Column(db.String(50), default='pending')  # pending, confirmed, shipped, delivered, cancelled
    payment_method = db.Column(db.String(50))
    payment_status = db.Column(db.String(50), default='pending')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    address = db.relationship('Address', backref='orders')
    order_items = db.relationship('OrderItem', backref='order', lazy=True, cascade='all, delete-orphan')
    payment_details = db.relationship('PaymentDetail', backref='order', uselist=False, cascade='all, delete-orphan')
    
    def to_dict(self, include_user=False):
        result = {
            'id': self.id,
            'order_number': self.order_number,
            'receipt_number': self.receipt_number,
            'total_amount': self.total_amount,
            'subtotal': self.total_amount,  # For now, same as total
            'shipping_cost': 0.00,  # Free shipping
            'status': self.status,
            'payment_method': self.payment_method,
            'payment_status': self.payment_status,
            'shipping_address': self.address.to_dict() if self.address else None,
            'order_items': [item.to_dict() for item in self.order_items],
            'payment_details': self.payment_details.to_dict() if self.payment_details else None,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
        
        if include_user and self.user:
            result['user'] = self.user.to_dict()
            result['customer'] = self.user.to_dict()
            
        return result

class OrderItem(db.Model):
    __tablename__ = 'order_items'
    
    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey('orders.id'), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('products.id'), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    price = db.Column(db.Float, nullable=False)
    size = db.Column(db.String(50))
    color = db.Column(db.String(50))
    
    product = db.relationship('Product', backref='order_items')
    
    def to_dict(self):
        product_dict = self.product.to_dict() if self.product else {}
        return {
            'id': self.id,
            'product_id': self.product_id,
            'product_name': product_dict.get('title', 'Unknown Product'),
            'product': product_dict,
            'quantity': self.quantity,
            'price': self.price,
            'size': self.size,
            'color': self.color
        }

class PaymentDetail(db.Model):
    __tablename__ = 'payment_details'
    
    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey('orders.id'), nullable=False)
    payment_method = db.Column(db.String(50), nullable=False)  # card, upi
    
    # Card details (encrypted in production)
    card_number_last4 = db.Column(db.String(4))  # Only store last 4 digits
    card_holder_name = db.Column(db.String(100))
    card_expiry_month = db.Column(db.String(2))
    card_expiry_year = db.Column(db.String(4))
    
    # UPI details
    upi_id = db.Column(db.String(100))
    upi_name = db.Column(db.String(100))
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'payment_method': self.payment_method,
            'card_number_last4': self.card_number_last4,
            'card_holder_name': self.card_holder_name,
            'card_expiry_month': self.card_expiry_month,
            'card_expiry_year': self.card_expiry_year,
            'upi_id': self.upi_id,
            'upi_name': self.upi_name
        }


class Analytics(db.Model):
    __tablename__ = 'analytics'
    
    id = db.Column(db.Integer, primary_key=True)
    metric_name = db.Column(db.String(50), unique=True, nullable=False)  # 'views' or 'clicks'
    count = db.Column(db.Integer, default=0)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'metric_name': self.metric_name,
            'count': self.count,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
