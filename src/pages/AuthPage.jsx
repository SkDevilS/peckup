import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { motion, AnimatePresence } from 'framer-motion';

export default function AuthPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });

    const { login, register, isLoading, error, clearError, isAuthenticated } = useAuthStore();
    const navigate = useNavigate();
    const location = useLocation();

    // If already authenticated, redirect to account or intended page
    useEffect(() => {
        if (isAuthenticated) {
            const from = location.state?.from?.pathname || '/account';
            navigate(from, { replace: true });
        }
    }, [isAuthenticated, navigate, location]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (error) clearError();
    };

    const toggleMode = () => {
        setIsLogin(!isLogin);
        clearError();
        setFormData({ name: '', email: '', password: '' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        let result;
        if (isLogin) {
            result = await login(formData.email, formData.password);
        } else {
            result = await register(formData);
        }

        if (result.success) {
            // Navigation handled by useEffect
        }
    };

    return (
        <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden border border-neutral-100"
            >
                {/* Header */}
                <div className="p-8 pb-6 text-center bg-gradient-to-b from-primary-50 to-white">
                    <h1 className="text-3xl font-bold text-neutral-900 mb-2">
                        {isLogin ? 'Welcome Back!' : 'Join Peckup'}
                    </h1>
                    <p className="text-neutral-500">
                        {isLogin
                            ? 'Sign in to access your orders and wishlist'
                            : 'Create an account to start shopping'}
                    </p>
                </div>

                {/* Form */}
                <div className="p-8 pt-2">
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-sm flex items-start gap-3"
                        >
                            <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {error}
                        </motion.div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <AnimatePresence mode="popLayout">
                            {!isLogin && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="overflow-hidden"
                                >
                                    <label className="block text-sm font-medium text-neutral-700 mb-2">Full Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all outline-none"
                                        placeholder="John Doe"
                                        required={!isLogin}
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-2">Email Address</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all outline-none"
                                placeholder="you@example.com"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-2">Password</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all outline-none"
                                placeholder="••••••••"
                                required
                            />
                            {!isLogin && (
                                <p className="text-xs text-neutral-400 mt-2">
                                    Must be at least 8 characters with 1 uppercase, 1 lowercase, and 1 number.
                                </p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-semibold shadow-lg shadow-primary-600/30 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    <span>Processing...</span>
                                </>
                            ) : (
                                <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-neutral-100 text-center">
                        <p className="text-neutral-500 text-sm">
                            {isLogin ? "Don't have an account?" : "Already have an account?"}
                            <button
                                onClick={toggleMode}
                                className="ml-2 px-3 py-1.5 bg-neutral-50 hover:bg-neutral-100 text-neutral-800 font-medium rounded-lg transition-colors text-sm"
                            >
                                {isLogin ? 'Sign up' : 'Sign in'}
                            </button>
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
