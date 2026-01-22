import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCartStore } from '../stores/cartStore';
import { useWishlistStore } from '../stores/wishlistStore';
import { useToast } from '../stores/toastStore';
import { formatPrice } from '../utils/priceFormatter';
import { motion } from 'framer-motion';

const ProductCard = ({ product }) => {
    const [imageLoaded, setImageLoaded] = useState(false);
    const addItem = useCartStore((state) => state.addItem);
    const addToWishlist = useWishlistStore((state) => state.addItem);
    const removeFromWishlist = useWishlistStore((state) => state.removeItem);
    const isInWishlist = useWishlistStore((state) => state.isInWishlist(product.id));
    const { showSuccess } = useToast();

    const handleAddToCart = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (product.stock > 0) {
            addItem(product, 1);
            showSuccess('Added to cart!');
        }
    };

    const handleWishlistToggle = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (isInWishlist) {
            removeFromWishlist(product.id);
        } else {
            addToWishlist(product);
            showSuccess('Added to wishlist!');
        }
    };

    const discountPercentage = product.original_price
        ? Math.round((1 - product.price / product.original_price) * 100)
        : 0;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="group h-full"
        >
            <Link to={`/product/${product.slug}`} className="block h-full">
                {/* Card Container - Fixed height structure */}
                <div className="relative bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-neutral-100 h-full flex flex-col">

                    {/* Image Section - Fixed aspect ratio */}
                    <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100 flex-shrink-0">
                        {/* Skeleton loader */}
                        {!imageLoaded && (
                            <div className="absolute inset-0 bg-gradient-to-r from-slate-100 via-slate-50 to-slate-100 animate-pulse" />
                        )}

                        {/* Product Image */}
                        <img
                            src={product.images?.[0] || 'https://images.unsplash.com/photo-1556912172-45b7abe8b7e4?w=500'}
                            alt={product.title}
                            className={`w-full h-full object-contain p-6 transition-all duration-700 group-hover:scale-110 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                            loading="lazy"
                            onLoad={() => setImageLoaded(true)}
                            onError={(e) => {
                                e.target.src = 'https://images.unsplash.com/photo-1556912172-45b7abe8b7e4?w=500';
                                setImageLoaded(true);
                            }}
                        />

                        {/* Top gradient overlay */}
                        <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                        {/* Badges Row */}
                        <div className="absolute top-4 left-4 right-4 flex items-start justify-between z-10">
                            <div className="flex flex-col gap-2">
                                {product.is_on_sale && discountPercentage > 0 && (
                                    <span className="inline-flex items-center gap-1 bg-gradient-to-r from-rose-500 to-pink-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg">
                                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M5 2a2 2 0 00-2 2v14l3.5-2 3.5 2 3.5-2 3.5 2V4a2 2 0 00-2-2H5zm2.5 3a1.5 1.5 0 100 3 1.5 1.5 0 000-3zm6.207.293a1 1 0 00-1.414 0l-6 6a1 1 0 101.414 1.414l6-6a1 1 0 000-1.414zM12.5 10a1.5 1.5 0 100 3 1.5 1.5 0 000-3z" clipRule="evenodd" />
                                        </svg>
                                        {discountPercentage}% OFF
                                    </span>
                                )}
                                {product.stock === 0 && (
                                    <span className="bg-neutral-900 text-white px-3 py-1.5 rounded-full text-xs font-bold">
                                        Sold Out
                                    </span>
                                )}
                            </div>

                            {/* Wishlist Heart */}
                            <button
                                onClick={handleWishlistToggle}
                                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 backdrop-blur-sm ${isInWishlist
                                    ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30'
                                    : 'bg-white/80 text-neutral-400 hover:text-rose-500 hover:bg-white shadow-lg'
                                    }`}
                            >
                                <svg
                                    className="w-5 h-5"
                                    fill={isInWishlist ? 'currentColor' : 'none'}
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                    />
                                </svg>
                            </button>
                        </div>

                        {/* Quick Add Floating Button - Glass Effect */}
                        <button
                            onClick={handleAddToCart}
                            disabled={product.stock === 0}
                            className={`absolute bottom-4 left-4 right-4 py-3 rounded-2xl font-semibold text-sm flex items-center justify-center gap-2 backdrop-blur-xl transition-all border ${product.stock === 0
                                ? 'bg-neutral-400/20 text-neutral-400 border-neutral-300/30 cursor-not-allowed'
                                : 'bg-white/40 text-neutral-700 border-white/50 hover:bg-white/60 hover:border-white/70 shadow-lg shadow-black/10 active:scale-95'
                                }`}
                        >
                            {product.stock === 0 ? (
                                'Out of Stock'
                            ) : (
                                <>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                    Add to Cart
                                </>
                            )}
                        </button>
                    </div>

                    {/* Content Section - Fixed height with flex-grow */}
                    <div className="p-5 flex flex-col flex-grow">
                        {/* Rating */}
                        <div className="flex items-center gap-1.5 mb-2">
                            <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                    <svg
                                        key={i}
                                        className={`w-3.5 h-3.5 ${i < 4 ? 'text-amber-400' : 'text-neutral-200'}`}
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                ))}
                            </div>
                            <span className="text-xs text-neutral-400">(128)</span>
                        </div>

                        {/* Title - Fixed height */}
                        <h3 className="font-semibold text-neutral-800 line-clamp-2 leading-snug mb-3 group-hover:text-blue-600 transition-colors min-h-[2.75rem]">
                            {product.title}
                        </h3>

                        {/* Price Section - Push to bottom */}
                        <div className="flex items-end justify-between mt-auto">
                            <div>
                                <span className="text-xl font-bold text-neutral-900">
                                    {formatPrice(product.price)}
                                </span>
                                {product.is_on_sale && product.original_price && (
                                    <span className="ml-2 text-sm text-neutral-400 line-through">
                                        {formatPrice(product.original_price)}
                                    </span>
                                )}
                            </div>

                            {/* Stock indicator */}
                            {product.stock > 0 && product.stock < 10 && (
                                <span className="text-xs text-orange-500 font-medium">
                                    Only {product.stock} left
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
};

export default ProductCard;
