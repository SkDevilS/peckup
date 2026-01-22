import { Link } from 'react-router-dom';
import { useWishlistStore } from '../stores/wishlistStore';
import { useCartStore } from '../stores/cartStore';
import { useToast } from '../stores/toastStore';
import { formatPrice } from '../utils/priceFormatter';
import { motion } from 'framer-motion';

const WishlistPage = () => {
    const items = useWishlistStore((state) => state.items);
    const removeItem = useWishlistStore((state) => state.removeItem);
    const clearWishlist = useWishlistStore((state) => state.clearWishlist);
    const addToCart = useCartStore((state) => state.addItem);
    const { showSuccess } = useToast();

    const handleAddToCart = (product) => {
        if (product.stock > 0) {
            addToCart(product, 1);
            showSuccess('Added to cart!');
        }
    };

    const handleRemove = (id) => {
        removeItem(id);
        showSuccess('Removed from wishlist');
    };

    if (items.length === 0) {
        return (
            <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-4">
                <div className="text-center max-w-md">
                    <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-rose-50 flex items-center justify-center">
                        <svg className="w-12 h-12 text-rose-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold text-neutral-800 mb-3">Your wishlist is empty</h1>
                    <p className="text-neutral-500 mb-8">Save items you love to your wishlist and find them here anytime.</p>
                    <Link to="/" className="inline-flex items-center gap-2 bg-blue-600 text-white font-semibold px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors">
                        Start Shopping
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-neutral-50 py-6 md:py-12">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-neutral-800 mb-1">My Wishlist</h1>
                        <p className="text-neutral-500">{items.length} item{items.length !== 1 ? 's' : ''} saved</p>
                    </div>
                    <button
                        onClick={clearWishlist}
                        className="text-neutral-500 hover:text-red-500 text-sm font-medium transition-colors flex items-center gap-2"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Clear All
                    </button>
                </div>

                {/* Wishlist Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                    {items.map((item, index) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="bg-white rounded-2xl overflow-hidden border border-neutral-100 shadow-sm hover:shadow-lg transition-all"
                        >
                            {/* Image */}
                            <Link to={`/product/${item.slug}`} className="block relative aspect-square bg-neutral-50">
                                <img
                                    src={item.images?.[0] || 'https://images.unsplash.com/photo-1556912172-45b7abe8b7e4?w=400'}
                                    alt={item.title}
                                    className="w-full h-full object-contain p-4"
                                />
                                {/* Remove button */}
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleRemove(item.id);
                                    }}
                                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center text-neutral-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                                {/* Stock badge */}
                                {item.stock === 0 && (
                                    <span className="absolute top-3 left-3 bg-neutral-800 text-white text-xs font-bold px-2 py-1 rounded">
                                        Out of Stock
                                    </span>
                                )}
                            </Link>

                            {/* Content */}
                            <div className="p-4">
                                <Link to={`/product/${item.slug}`}>
                                    <h3 className="font-medium text-neutral-800 line-clamp-2 mb-2 hover:text-blue-600 transition-colors">
                                        {item.title}
                                    </h3>
                                </Link>
                                <div className="flex items-center gap-2 mb-4">
                                    <span className="text-lg font-bold text-neutral-900">{formatPrice(item.price)}</span>
                                    {item.original_price && (
                                        <span className="text-sm text-neutral-400 line-through">{formatPrice(item.original_price)}</span>
                                    )}
                                </div>
                                <button
                                    onClick={() => handleAddToCart(item)}
                                    disabled={item.stock === 0}
                                    className={`w-full py-2.5 rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-all ${item.stock === 0
                                            ? 'bg-neutral-100 text-neutral-400 cursor-not-allowed'
                                            : 'bg-blue-600 text-white hover:bg-blue-700 active:scale-95'
                                        }`}
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                    </svg>
                                    {item.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Continue Shopping */}
                <div className="text-center mt-12">
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 text-blue-600 font-medium hover:text-blue-700 transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                        </svg>
                        Continue Shopping
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default WishlistPage;
