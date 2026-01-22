import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminApi } from '../../utils/adminApi';

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        total_users: 0,
        total_products: 0,
        total_sections: 0,
        total_orders: 0,
    });
    const [loading, setLoading] = useState(true);
    const [orderStats, setOrderStats] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [statsResult, orderStatsResult] = await Promise.all([
                adminApi.getStats(),
                adminApi.getOrderStats(),
            ]);
            
            if (statsResult.success) {
                setStats(statsResult.data);
            } else {
                console.error('Error fetching stats:', statsResult.error);
            }
            
            if (orderStatsResult.success) {
                setOrderStats(orderStatsResult.data);
            } else {
                console.error('Error fetching order stats:', orderStatsResult.error);
            }
        } catch (error) {
            console.error('Error fetching stats:', error);
        } finally {
            setLoading(false);
        }
    };

    const statCards = [
        {
            title: 'Total Users',
            value: stats.total_users,
            icon: (
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
            ),
            color: '#3b82f6',
            bgColor: '#eff6ff',
            link: '/admin/users',
        },
        {
            title: 'Total Products',
            value: stats.total_products,
            icon: (
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
            ),
            color: '#10b981',
            bgColor: '#ecfdf5',
            link: '/admin/products',
        },
        {
            title: 'Total Sections',
            value: stats.total_sections,
            icon: (
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
            ),
            color: '#8b5cf6',
            bgColor: '#f5f3ff',
            link: '/admin/sections',
        },
        {
            title: 'Total Orders',
            value: stats.total_orders,
            icon: (
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
            ),
            color: '#f97316',
            bgColor: '#fff7ed',
            link: '/admin/orders',
        },
    ];

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p>Loading dashboard...</p>
            </div>
        );
    }

    return (
        <div className="dashboard">
            <div className="dashboard-header">
                <h1>Dashboard</h1>
                <p>Welcome to your Peckup admin dashboard</p>
            </div>

            {/* Stats Grid */}
            <div className="stats-grid">
                {statCards.map((card, index) => (
                    <Link to={card.link} key={index} className="stat-card">
                        <div className="stat-icon" style={{ backgroundColor: card.bgColor, color: card.color }}>
                            {card.icon}
                        </div>
                        <div className="stat-content">
                            <p className="stat-title">{card.title}</p>
                            <p className="stat-value">{card.value}</p>
                        </div>
                        <div className="stat-arrow" style={{ color: card.color }}>
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Order Stats */}
            {orderStats && (
                <div className="order-stats-section">
                    <h2>Order Statistics</h2>
                    <div className="order-stats-grid">
                        <div className="order-stat">
                            <div className="order-stat-icon revenue">
                                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div className="order-stat-content">
                                <p className="order-stat-title">Total Revenue</p>
                                <p className="order-stat-value">₹{(orderStats.total_revenue || 0).toLocaleString()}</p>
                            </div>
                        </div>

                        <div className="order-stat">
                            <div className="order-stat-icon recent">
                                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div className="order-stat-content">
                                <p className="order-stat-title">Last 30 Days Orders</p>
                                <p className="order-stat-value">{orderStats.recent_orders || 0}</p>
                            </div>
                        </div>

                        {orderStats.status_counts && Object.entries(orderStats.status_counts).map(([status, count]) => (
                            <div className="order-stat" key={status}>
                                <div className={`order-stat-icon ${status}`}>
                                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                    </svg>
                                </div>
                                <div className="order-stat-content">
                                    <p className="order-stat-title">{status.charAt(0).toUpperCase() + status.slice(1)}</p>
                                    <p className="order-stat-value">{count}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Quick Actions */}
            <div className="quick-actions">
                <h2>Quick Actions</h2>
                <div className="actions-grid">
                    <Link to="/admin/products" className="action-card">
                        <div className="action-icon add-product">
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                        </div>
                        <span>Add Product</span>
                    </Link>
                    <Link to="/admin/sections" className="action-card">
                        <div className="action-icon add-section">
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                        </div>
                        <span>Manage Sections</span>
                    </Link>
                    <Link to="/admin/orders" className="action-card">
                        <div className="action-icon view-orders">
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                            </svg>
                        </div>
                        <span>View Orders</span>
                    </Link>
                    <Link to="/admin/users" className="action-card">
                        <div className="action-icon manage-users">
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                        </div>
                        <span>Manage Users</span>
                    </Link>
                </div>
            </div>

            <style>{`
        .dashboard {
          max-width: 1400px;
        }

        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 400px;
          gap: 16px;
          color: #64748b;
        }

        .spinner {
          width: 40px;
          height: 40px;
          border: 3px solid #e2e8f0;
          border-top-color: #f97316;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .dashboard-header {
          margin-bottom: 32px;
        }

        .dashboard-header h1 {
          font-size: 32px;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 8px;
        }

        .dashboard-header p {
          font-size: 16px;
          color: #64748b;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 20px;
          margin-bottom: 40px;
        }

        .stat-card {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 24px;
          background: white;
          border-radius: 16px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          text-decoration: none;
          transition: all 0.2s ease;
        }

        .stat-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        }

        .stat-icon {
          width: 56px;
          height: 56px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .stat-icon svg {
          width: 28px;
          height: 28px;
        }

        .stat-content {
          flex: 1;
        }

        .stat-title {
          font-size: 14px;
          color: #64748b;
          margin-bottom: 4px;
        }

        .stat-value {
          font-size: 28px;
          font-weight: 700;
          color: #1e293b;
        }

        .stat-arrow {
          width: 24px;
          height: 24px;
        }

        .stat-arrow svg {
          width: 24px;
          height: 24px;
        }

        .order-stats-section {
          margin-bottom: 40px;
        }

        .order-stats-section h2 {
          font-size: 20px;
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 20px;
        }

        .order-stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
        }

        .order-stat {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 20px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .order-stat-icon {
          width: 44px;
          height: 44px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .order-stat-icon svg {
          width: 22px;
          height: 22px;
        }

        .order-stat-icon.revenue {
          background: #dcfce7;
          color: #16a34a;
        }

        .order-stat-icon.recent {
          background: #dbeafe;
          color: #2563eb;
        }

        .order-stat-icon.pending {
          background: #fef3c7;
          color: #d97706;
        }

        .order-stat-icon.confirmed {
          background: #dbeafe;
          color: #2563eb;
        }

        .order-stat-icon.shipped {
          background: #e0e7ff;
          color: #4f46e5;
        }

        .order-stat-icon.delivered {
          background: #dcfce7;
          color: #16a34a;
        }

        .order-stat-icon.cancelled {
          background: #fee2e2;
          color: #dc2626;
        }

        .order-stat-title {
          font-size: 13px;
          color: #64748b;
          margin-bottom: 2px;
        }

        .order-stat-value {
          font-size: 22px;
          font-weight: 700;
          color: #1e293b;
        }

        .quick-actions h2 {
          font-size: 20px;
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 20px;
        }

        .actions-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 16px;
        }

        .action-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          padding: 24px 20px;
          background: white;
          border-radius: 16px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          text-decoration: none;
          color: #1e293b;
          font-weight: 500;
          transition: all 0.2s ease;
        }

        .action-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        }

        .action-icon {
          width: 56px;
          height: 56px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .action-icon svg {
          width: 28px;
          height: 28px;
        }

        .action-icon.add-product {
          background: linear-gradient(135deg, #f97316, #ea580c);
          color: white;
        }

        .action-icon.add-section {
          background: linear-gradient(135deg, #8b5cf6, #7c3aed);
          color: white;
        }

        .action-icon.view-orders {
          background: linear-gradient(135deg, #3b82f6, #2563eb);
          color: white;
        }

        .action-icon.manage-users {
          background: linear-gradient(135deg, #10b981, #059669);
          color: white;
        }
      `}</style>
        </div>
    );
}
