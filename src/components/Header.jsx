import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCartStore } from '../stores/cartStore';
import { useWishlistStore } from '../stores/wishlistStore';
import { useAuthStore } from '../stores/authStore';
import { motion, AnimatePresence } from 'framer-motion';
import SearchModal from './SearchModal';

const Header = ({ onCartClick }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const cartItemCount = useCartStore((state) => state.getItemCount());
    const { isAuthenticated } = useAuthStore();
    const wishlistCount = useWishlistStore((state) => state.items.length);

    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchSections = async () => {
            try {
                // Assuming api is imported from '../utils/api'
                // But wait, I need to import it first. 
                // Wait, use 'api' from '../utils/api'.
                const sections = await import('../utils/api').then(module => module.api.getSections());
                setCategories(sections);
            } catch (error) {
                console.error('Failed to fetch sections:', error);
            }
        };
        fetchSections();
    }, []);

    return (
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-neutral-100 shadow-sm">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16 md:h-20">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-3 group">
                        <img src="/logo.png" alt="Peckup" className="h-12 w-auto object-contain" />
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-8">
                        <Link to="/" className="nav-link">Home</Link>
                        {categories.map((cat) => (
                            <Link key={cat.slug} to={`/category/${cat.slug}`} className="nav-link">
                                {cat.name}
                            </Link>
                        ))}
                    </nav>

                    {/* Actions */}
                    <div className="flex items-center gap-3">
                        {/* Search */}
                        <button 
                            onClick={() => setIsSearchOpen(true)}
                            className="hidden md:flex w-10 h-10 rounded-full bg-neutral-100 items-center justify-center text-neutral-500 hover:bg-neutral-200 hover:text-neutral-700 transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </button>

                        {/* Account */}
                        <Link
                            to={isAuthenticated ? "/account" : "/login"}
                            className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-500 hover:bg-neutral-200 hover:text-neutral-700 transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </Link>

                        {/* Wishlist */}
                        <Link
                            to="/wishlist"
                            className="relative w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-500 hover:bg-neutral-200 hover:text-neutral-700 transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                            {wishlistCount > 0 && (
                                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs font-bold flex items-center justify-center text-white">
                                    {wishlistCount}
                                </span>
                            )}
                        </Link>

                        {/* Cart */}
                        <button
                            onClick={onCartClick}
                            className="relative w-10 h-10 rounded-full bg-primary-500 flex items-center justify-center text-white hover:bg-primary-600 transition-colors shadow-lg shadow-primary-500/30"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                            {cartItemCount > 0 && (
                                <motion.span
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="absolute -top-1 -right-1 w-5 h-5 bg-secondary-500 rounded-full text-xs font-bold flex items-center justify-center text-white"
                                >
                                    {cartItemCount}
                                </motion.span>
                            )}
                        </button>

                        {/* Mobile Menu Toggle */}
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="md:hidden w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-600"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                {isMenuOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {isMenuOpen && (
                        <motion.nav
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="md:hidden border-t border-neutral-100 py-4"
                        >
                            <div className="flex flex-col gap-2">
                                <Link
                                    to="/"
                                    className="px-4 py-3 rounded-xl text-neutral-700 hover:bg-neutral-100 font-medium transition-colors"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Home
                                </Link>
                                {categories.map((cat) => (
                                    <Link
                                        key={cat.slug}
                                        to={`/category/${cat.slug}`}
                                        className="px-4 py-3 rounded-xl text-neutral-700 hover:bg-neutral-100 font-medium transition-colors"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        {cat.name}
                                    </Link>
                                ))}
                            </div>
                        </motion.nav>
                    )}
                </AnimatePresence>
            </div>

            {/* Search Modal */}
            <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
        </header>
    );
};

export default Header;
