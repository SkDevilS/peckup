import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import MiniCart from './components/MiniCart';
import ToastManager from './components/ToastManager';
import ErrorBoundary from './components/ErrorBoundary';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import CategoryPage from './pages/CategoryPage';
import ProductPage from './pages/ProductPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import WishlistPage from './pages/WishlistPage';
import AuthPage from './pages/AuthPage';
import AccountPage from './pages/AccountPage';
import ContactPage from './pages/ContactPage';
import FAQPage from './pages/FAQPage';
import ShippingInfoPage from './pages/ShippingInfoPage';
import TrackOrderPage from './pages/TrackOrderPage';
import AboutPage from './pages/AboutPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsPage from './pages/TermsPage';
import RefundPolicyPage from './pages/RefundPolicyPage';
import { useState, useEffect } from 'react';
import { useAnalyticsStore } from './stores/analyticsStore';

// Admin Imports
import AdminLayout from './components/admin/AdminLayout';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagement from './pages/admin/UserManagement';
import SectionManagement from './pages/admin/SectionManagement';
import ProductManagement from './pages/admin/ProductManagement';
import OrderManagement from './pages/admin/OrderManagement';
import AnalyticsManagement from './pages/admin/AnalyticsManagement';

// Customer Layout Component
const CustomerLayout = ({ isCartOpen, setIsCartOpen }) => {
    const { incrementView } = useAnalyticsStore();

    useEffect(() => {
        // Increment view count when customer layout mounts
        incrementView();
    }, [incrementView]);

    return (
        <ErrorBoundary>
        <div className="min-h-screen flex flex-col bg-neutral-50">
            <Header onCartClick={() => setIsCartOpen(true)} />
            <main className="flex-1">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/category/:slug" element={<CategoryPage />} />
                    <Route path="/product/:slug" element={<ProductPage />} />
                    <Route path="/cart" element={<CartPage />} />
                    <Route path="/checkout" element={<CheckoutPage />} />
                    <Route path="/wishlist" element={<WishlistPage />} />
                    <Route path="/login" element={<AuthPage />} />
                    <Route path="/account" element={<AccountPage />} />
                    <Route path="/contact" element={<ContactPage />} />
                    <Route path="/faqs" element={<FAQPage />} />
                    <Route path="/shipping" element={<ShippingInfoPage />} />
                    <Route path="/track-order" element={<TrackOrderPage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
                    <Route path="/terms" element={<TermsPage />} />
                    <Route path="/refund-policy" element={<RefundPolicyPage />} />
                </Routes>
            </main>
            <Footer />
            <MiniCart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
            <ToastManager />
        </div>
    </ErrorBoundary>
    );
};

function App() {
    const [isCartOpen, setIsCartOpen] = useState(false);

    return (
        <ErrorBoundary>
            <Router>
                <ScrollToTop />
                <Routes>
                    {/* Admin Routes */}
                    <Route path="/admin/login" element={<AdminLogin />} />
                    <Route path="/admin" element={<AdminLayout />}>
                        <Route index element={<Navigate to="/admin/dashboard" replace />} />
                        <Route path="dashboard" element={<AdminDashboard />} />
                        <Route path="users" element={<UserManagement />} />
                        <Route path="sections" element={<SectionManagement />} />
                        <Route path="products" element={<ProductManagement />} />
                        <Route path="orders" element={<OrderManagement />} />
                        <Route path="analytics" element={<AnalyticsManagement />} />
                    </Route>

                    {/* Customer Routes - Catch all other routes */}
                    <Route path="*" element={
                        <CustomerLayout isCartOpen={isCartOpen} setIsCartOpen={setIsCartOpen} />
                    } />
                </Routes>
            </Router>
        </ErrorBoundary>
    );
}

export default App;
