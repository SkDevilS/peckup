import { useState, useEffect } from 'react';
import { useAdminAuthStore } from '../../stores/adminAuthStore';
import { adminApi } from '../../utils/adminApi';

const OrderManagement = () => {
    const { accessToken, isAuthenticated } = useAdminAuthStore();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredOrders, setFilteredOrders] = useState([]);

    useEffect(() => {
        const loadOrders = async () => {
            if (accessToken && isAuthenticated) {
                setLoading(true);
                try {
                    const result = await adminApi.getOrders();
                    console.log('Orders fetched:', result);
                    if (result.success && result.data) {
                        setOrders(result.data.orders || []);
                        setFilteredOrders(result.data.orders || []);
                    } else {
                        console.error('Failed to fetch orders:', result.error);
                        setOrders([]);
                        setFilteredOrders([]);
                    }
                } catch (error) {
                    console.error('Failed to fetch orders:', error);
                    setOrders([]);
                    setFilteredOrders([]);
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false);
                setOrders([]);
                setFilteredOrders([]);
            }
        };
        loadOrders();
    }, [accessToken, isAuthenticated]);

    // Filter orders based on status and search query
    useEffect(() => {
        let filtered = orders;
        
        // Filter by status
        if (selectedStatus !== 'all') {
            filtered = filtered.filter(order => order.status === selectedStatus);
        }
        
        // Filter by search query
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(order => 
                order.order_number?.toLowerCase().includes(query) ||
                order.receipt_number?.toLowerCase().includes(query) ||
                order.user?.email?.toLowerCase().includes(query) ||
                order.customer?.email?.toLowerCase().includes(query) ||
                order.user?.name?.toLowerCase().includes(query) ||
                order.customer?.name?.toLowerCase().includes(query)
            );
        }
        
        setFilteredOrders(filtered);
    }, [orders, selectedStatus, searchQuery]);

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            const result = await adminApi.updateOrderStatus(orderId, newStatus);
            if (result.success) {
                // Update local state
                setOrders(prevOrders => 
                    prevOrders.map(order => 
                        order.id === orderId ? { ...order, status: newStatus } : order
                    )
                );
            } else {
                console.error('Failed to update order status:', result.error);
                alert('Failed to update order status');
            }
        } catch (error) {
            console.error('Failed to update order status:', error);
            alert('Failed to update order status');
        }
    };

    const handleDeleteOrder = async (orderId, orderNumber) => {
        if (!confirm(`Are you sure you want to delete order ${orderNumber}? This action cannot be undone.`)) {
            return;
        }

        try {
            const result = await adminApi.deleteOrder(orderId);
            if (result.success) {
                // Remove from local state
                setOrders(prevOrders => prevOrders.filter(order => order.id !== orderId));
                alert('Order deleted successfully');
            } else {
                console.error('Failed to delete order:', result.error);
                alert(`Failed to delete order: ${result.error || 'Unknown error'}`);
            }
        } catch (error) {
            console.error('Failed to delete order:', error);
            alert('Failed to delete order');
        }
    };

    const handleDownloadReceipt = async (order) => {
        try {
            // Direct fetch to get the PDF blob
            const token = adminApi.getAdminToken();
            const response = await fetch(`${adminApi.baseURL}/admin/orders/${order.id}/receipt`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', `peckup_receipt_${order.receipt_number}.pdf`);
                document.body.appendChild(link);
                link.click();
                link.remove();
                window.URL.revokeObjectURL(url);
            } else {
                const errorData = await response.json().catch(() => ({}));
                console.error('Failed to download receipt:', errorData);
                alert(`Failed to download receipt: ${errorData.error || 'Unknown error'}`);
            }
        } catch (error) {
            console.error('Failed to download receipt:', error);
            alert('Failed to download receipt. Please try again.');
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'confirmed': return 'bg-blue-100 text-blue-800';
            case 'shipped': return 'bg-purple-100 text-purple-800';
            case 'delivered': return 'bg-green-100 text-green-800';
            case 'cancelled': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">Order Management</h1>
                <div className="flex items-center space-x-4">
                    <input
                        type="text"
                        placeholder="Search by order #, receipt #, or customer..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="border border-gray-300 rounded-md px-4 py-2 w-80 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <select
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="all">All Orders</option>
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                </div>
            </div>

            <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                    {filteredOrders.length === 0 ? (
                        <li className="px-6 py-8 text-center text-gray-500">
                            No orders found
                        </li>
                    ) : (
                        filteredOrders.map((order) => (
                            <li key={order.id} className="px-6 py-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between">
                                            <p className="text-sm font-medium text-gray-900">
                                                Order #{order.order_number}
                                            </p>
                                            <div className="ml-2 flex-shrink-0 flex">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>
                                                    {order.status}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="mt-2 sm:flex sm:justify-between">
                                            <div className="sm:flex">
                                                <p className="flex items-center text-sm text-gray-500">
                                                    Customer: {order.user?.email || order.customer?.email || 'N/A'}
                                                </p>
                                                <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                                                    Total: ₹{order.total_amount?.toFixed(2) || '0.00'}
                                                </p>
                                            </div>
                                            <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                                                <p>
                                                    {new Date(order.created_at).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                        {order.order_items && order.order_items.length > 0 && (
                                            <div className="mt-2">
                                                <p className="text-sm text-gray-600">
                                                    Items: {order.order_items.map(item => `${item.product_name || item.product?.title || 'Product'} (${item.quantity})`).join(', ')}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                    <div className="ml-4 flex items-center gap-2">
                                        <select
                                            value={order.status}
                                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                            className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="confirmed">Confirmed</option>
                                            <option value="shipped">Shipped</option>
                                            <option value="delivered">Delivered</option>
                                            <option value="cancelled">Cancelled</option>
                                        </select>
                                        {order.receipt_number && (
                                            <button
                                                onClick={() => handleDownloadReceipt(order)}
                                                className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-colors"
                                                title="Download Receipt"
                                            >
                                                Download Receipt
                                            </button>
                                        )}
                                        <button
                                            onClick={() => handleDeleteOrder(order.id, order.order_number)}
                                            className="px-3 py-1 text-xs bg-red-100 text-red-700 rounded-full hover:bg-red-200 transition-colors"
                                            title="Delete Order"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </li>
                        ))
                    )}
                </ul>
            </div>
        </div>
    );
};

export default OrderManagement;