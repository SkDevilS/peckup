import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { useOrderStore } from '../stores/orderStore';
import { motion } from 'framer-motion';
import AddressManager from '../components/AddressManager';

export default function AccountPage() {
    const navigate = useNavigate();
    
    // Initialize stores with error handling
    const authStore = useAuthStore();
    const orderStore = useOrderStore();
    
    // Safely destructure with fallbacks
    const {
        user = null,
        logout = () => {},
        isAuthenticated = false
    } = authStore || {};
    
    const {
        orders = [],
        fetchOrders = async () => ({ success: true }),
        downloadReceipt = async () => ({ success: true })
    } = orderStore || {};
    
    const [activeTab, setActiveTab] = useState('orders');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        fetchData();
    }, [isAuthenticated, activeTab]);

    const fetchData = async () => {
        setLoading(true);
        try {
            if (activeTab === 'orders' && fetchOrders) {
                await fetchOrders();
            }
        } catch (err) {
            console.error('Error fetching data:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadReceipt = async (order) => {
        if (downloadReceipt) {
            try {
                const result = await downloadReceipt(order.id);
                if (!result?.success) {
                    console.error('Failed to download receipt:', result?.error);
                    // Show error message to user
                    alert('Failed to download receipt. Please try again.');
                }
            } catch (error) {
                console.error('Receipt download error:', error);
                alert('Failed to download receipt. Please try again.');
            }
        }
    };

    const handleLogout = () => {
        if (logout) {
            logout();
        }
        navigate('/');
    };

    // Show loading if stores are not ready
    if (!authStore) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center">
                    <p className="text-gray-600">Please log in to access your account.</p>
                    <button 
                        onClick={() => navigate('/login')}
                        className="mt-4 px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                    >
                        Go to Login
                    </button>
                </div>
            </div>
        );
    }

    const tabs = [
        { id: 'orders', label: 'My Orders', icon: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z' },
        { id: 'addresses', label: 'Addresses', icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z' },
        { id: 'profile', label: 'Profile Settings', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
    ];

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-neutral-900 mb-8">My Account</h1>

            <div className="flex flex-col md:flex-row gap-8">
                {/* Sidebar */}
                <div className="w-full md:w-64 flex-shrink-0">
                    <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 overflow-hidden">
                        <div className="p-6 border-b border-neutral-100 bg-neutral-50/50">
                            <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 text-2xl font-bold mb-3 mx-auto">
                                {user.name?.[0]?.toUpperCase()}
                            </div>
                            <h3 className="text-center font-bold text-neutral-900">{user.name}</h3>
                            <p className="text-center text-sm text-neutral-500">{user.email}</p>
                        </div>
                        <nav className="p-2">
                            {tabs.map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${activeTab === tab.id
                                            ? 'bg-primary-50 text-primary-700'
                                            : 'text-neutral-600 hover:bg-neutral-50'
                                        }`}
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} />
                                    </svg>
                                    {tab.label}
                                </button>
                            ))}
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors mt-2"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                                Sign Out
                            </button>
                        </nav>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1">
                    {activeTab === 'orders' && (
                        <div className="space-y-4">
                            <h2 className="text-xl font-bold text-neutral-900 mb-4">Order History</h2>
                            {loading ? (
                                <div className="text-center py-12 text-neutral-500">Loading orders...</div>
                            ) : orders.length === 0 ? (
                                <div className="bg-white rounded-2xl p-12 text-center border border-dashed border-neutral-200">
                                    <div className="w-16 h-16 bg-neutral-50 rounded-full flex items-center justify-center mx-auto mb-4 text-neutral-400">
                                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-lg font-medium text-neutral-900 mb-1">No orders yet</h3>
                                    <p className="text-neutral-500 mb-6">Start shopping to see your orders here.</p>
                                    <button onClick={() => navigate('/')} className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
                                        Browse Products
                                    </button>
                                </div>
                            ) : (
                                orders.map(order => (
                                    <div key={order.id} className="bg-white rounded-2xl border border-neutral-100 overflow-hidden">
                                        <div className="p-4 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/30">
                                            <div>
                                                <p className="text-sm font-bold text-neutral-900">Order #{order.order_number}</p>
                                                <p className="text-xs text-neutral-500">{new Date(order.created_at).toLocaleDateString()}</p>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold
                                                    ${order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                                                        order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                                                            'bg-blue-100 text-blue-700'}`}>
                                                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                                </span>
                                                <span className="font-bold text-neutral-900">₹{order.total_amount.toFixed(2)}</span>
                                                {order.receipt_number && (
                                                    <button
                                                        onClick={() => handleDownloadReceipt(order)}
                                                        className="px-3 py-1 text-xs bg-orange-100 text-orange-700 rounded-full hover:bg-orange-200 transition-colors"
                                                    >
                                                        Download Receipt
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                        <div className="p-4">
                                            <div className="space-y-3">
                                                {order.order_items?.map((item, idx) => (
                                                    <div key={idx} className="flex items-center gap-4">
                                                        <div className="w-12 h-12 bg-neutral-100 rounded-lg flex-shrink-0 overflow-hidden">
                                                            {item.product?.images?.[0] ? (
                                                                <img src={item.product.images[0]} alt={item.product_name} className="w-full h-full object-cover" />
                                                            ) : (
                                                                <div className="w-full h-full bg-neutral-200"></div>
                                                            )}
                                                        </div>
                                                        <div className="flex-1">
                                                            <p className="font-medium text-sm text-neutral-900">{item.product_name || item.product?.title || 'Product'}</p>
                                                            <p className="text-xs text-neutral-500">Qty: {item.quantity}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}

                    {activeTab === 'addresses' && (
                        <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-6">
                            <AddressManager />
                        </div>
                    )}

                    {activeTab === 'profile' && (
                        <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-6">
                            <h2 className="text-xl font-bold text-neutral-900 mb-6">Profile Settings</h2>
                            <ProfileForm user={user} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

// ProfileForm Component
function ProfileForm({ user }) {
    const { updateProfile } = useAuthStore();
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || ''
    });
    
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            if (updateProfile) {
                const result = await updateProfile(formData);
                if (result?.success) {
                    setMessage('Profile updated successfully!');
                } else {
                    throw new Error(result?.error || 'Failed to update profile');
                }
            }
        } catch (error) {
            setMessage(error.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {message && (
                <div className={`p-4 rounded-xl ${message.includes('success') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                    {message}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">Full Name *</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 rounded-xl border border-neutral-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">Email *</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 rounded-xl border border-neutral-200 bg-neutral-50 cursor-not-allowed outline-none"
                        disabled
                    />
                    <p className="text-xs text-neutral-500 mt-1">Email cannot be changed</p>
                </div>
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-neutral-700 mb-1">Phone Number</label>
                    <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 rounded-xl border border-neutral-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none"
                        placeholder="Enter your phone number"
                    />
                </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-6 border-t border-neutral-200">
                <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                >
                    {loading && (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    )}
                    {loading ? 'Updating...' : 'Update Profile'}
                </button>
            </div>
        </form>
    );
}
