import { Navigate, Outlet, Link, useLocation } from 'react-router-dom';
import { useAdminAuthStore } from '../../stores/adminAuthStore';
import { useEffect } from 'react';

export default function AdminLayout() {
    const { isAuthenticated, user, logout } = useAdminAuthStore();
    const location = useLocation();

    useEffect(() => {
        // Change page title for admin pages
        document.title = 'Peckup - Admin Dashboard';
        
        // Cleanup: restore original title when leaving admin
        return () => {
            document.title = 'Peckup - Premium Shopping Destination';
        };
    }, []);

    if (!isAuthenticated) {
        return <Navigate to="/admin/login" replace />;
    }

    const navItems = [
        {
            path: '/admin/dashboard',
            label: 'Dashboard',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
            )
        },
        {
            path: '/admin/orders',
            label: 'Orders',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
            )
        },
        {
            path: '/admin/users',
            label: 'Users',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
            )
        },
        {
            path: '/admin/sections',
            label: 'Sections',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
            )
        },
        {
            path: '/admin/products',
            label: 'Products',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
            )
        },
        {
            path: '/admin/analytics',
            label: 'Analytics',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
            )
        },
    ];

    return (
        <div className="admin-layout">
            {/* Sidebar */}
            <div className="admin-sidebar">
                {/* Logo */}
                <div className="sidebar-header">
                    <div className="logo-container">
                        <img src="/logo.png" alt="Peckup" style={{ width: '140px', height: 'auto', margin: '0 auto', display: 'block' }} />
                    </div>
                    <p className="admin-label">Admin Panel</p>
                </div>

                {/* Navigation */}
                <nav className="sidebar-nav">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`nav-item ${isActive ? 'active' : ''}`}
                            >
                                <span className="nav-icon">{item.icon}</span>
                                <span className="nav-label">{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* User Info & Logout */}
                <div className="sidebar-footer">
                    <div className="user-info">
                        <div className="user-avatar">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </div>
                        <div className="user-details">
                            <p className="user-label">Logged in as</p>
                            <p className="user-email">{user?.email}</p>
                        </div>
                    </div>
                    <button onClick={logout} className="logout-btn">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        <span>Logout</span>
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="admin-main">
                <div className="admin-content">
                    <Outlet />
                </div>
            </div>

            <style>{`
        .admin-layout {
          display: flex;
          min-height: 100vh;
          background: #f8fafc;
        }

        .admin-sidebar {
          width: 260px;
          background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
          display: flex;
          flex-direction: column;
          box-shadow: 4px 0 20px rgba(0, 0, 0, 0.08);
          border-right: 1px solid #e5e7eb;
        }

        .sidebar-header {
          padding: 24px 20px;
          border-bottom: 1px solid #e5e7eb;
          text-align: center;
        }

        .logo-container {
          position: relative;
          margin-bottom: 12px;
        }

        .admin-label {
          font-size: 11px;
          font-weight: 600;
          color: #6b7280;
          text-transform: uppercase;
          letter-spacing: 1.5px;
        }

        .sidebar-nav {
          flex: 1;
          padding: 16px 12px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          border-radius: 10px;
          color: #4b5563;
          text-decoration: none;
          transition: all 0.2s ease;
          font-weight: 500;
        }

        .nav-item:hover {
          background: #f3f4f6;
          color: #1f2937;
        }

        .nav-item.active {
          background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
          color: white;
          box-shadow: 0 4px 15px rgba(249, 115, 22, 0.3);
        }

        .nav-icon {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .nav-label {
          font-size: 14px;
        }

        .sidebar-footer {
          padding: 16px 12px;
          border-top: 1px solid #e5e7eb;
        }

        .user-info {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          background: #f9fafb;
          border-radius: 10px;
          margin-bottom: 12px;
          border: 1px solid #e5e7eb;
        }

        .user-avatar {
          width: 36px;
          height: 36px;
          background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .user-details {
          flex: 1;
          min-width: 0;
        }

        .user-label {
          font-size: 10px;
          color: #9ca3af;
          text-transform: uppercase;
        }

        .user-email {
          font-size: 13px;
          color: #1f2937;
          font-weight: 500;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .logout-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 12px;
          background: #fef2f2;
          border: 1px solid #fecaca;
          border-radius: 10px;
          color: #dc2626;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .logout-btn:hover {
          background: #fee2e2;
          border-color: #fca5a5;
        }

        .admin-main {
          flex: 1;
          overflow-y: auto;
        }

        .admin-content {
          padding: 32px;
          max-width: 1600px;
          margin: 0 auto;
        }

        @media (max-width: 768px) {
          .admin-sidebar {
            width: 80px;
          }

          .sidebar-header {
            padding: 16px;
          }

          .logo-text {
            font-size: 20px;
          }

          .admin-label {
            display: none;
          }

          .nav-label {
            display: none;
          }

          .nav-item {
            justify-content: center;
            padding: 12px;
          }

          .user-details {
            display: none;
          }

          .logout-btn span {
            display: none;
          }

          .admin-content {
            padding: 16px;
          }
        }
      `}</style>
        </div>
    );
}
