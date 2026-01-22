import { Link } from 'react-router-dom';
import { useCartStore } from '../stores/cartStore';
import { formatPrice } from '../utils/priceFormatter';
import { motion, AnimatePresence } from 'framer-motion';

const MiniCart = ({ isOpen, onClose }) => {
    const items = useCartStore((state) => state.items);
    const removeItem = useCartStore((state) => state.removeItem);
    const updateQuantity = useCartStore((state) => state.updateQuantity);
    const getTotal = useCartStore((state) => state.getTotal);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
                        onClick={onClose}
                    />

                    {/* Cart Panel */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-neutral-100">
                            <h2 className="text-xl font-semibold text-neutral-800">Shopping Cart</h2>
                            <button
                                onClick={onClose}
                                className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-500 hover:bg-neutral-200 transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Cart Items */}
                        <div className="flex-1 overflow-y-auto p-6">
                            {items.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-center">
                                    <div className="w-20 h-20 mb-4 rounded-2xl bg-neutral-100 flex items-center justify-center">
                                        <svg className="w-10 h-10 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-lg font-medium text-neutral-800 mb-2">Your cart is empty</h3>
                                    <p className="text-neutral-500 text-sm mb-6">Add some items to get started!</p>
                                    <button
                                        onClick={onClose}
                                        className="btn-primary text-sm"
                                    >
                                        Continue Shopping
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {items.map((item) => (
                                        <motion.div
                                            key={`${item.id}-${item.selectedSize}-${item.selectedColor}`}
                                            layout
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, x: -100 }}
                                            className="flex gap-4 p-4 rounded-xl bg-neutral-50 border border-neutral-100"
                                        >
                                            <img
                                                src={item.images?.[0] || 'https://images.unsplash.com/photo-1556912172-45b7abe8b7e4?w=100'}
                                                alt={item.title}
                                                className="w-20 h-20 object-cover rounded-lg bg-white"
                                            />
                                            <div className="flex-1 min-w-0">
                                                <h4 className="text-sm font-medium text-neutral-800 line-clamp-2 mb-1">
                                                    {item.title}
                                                </h4>
                                                <p className="text-sm font-semibold text-primary-600 mb-2">
                                                    {formatPrice(item.price)}
                                                </p>
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity - 1, item.selectedSize, item.selectedColor)}
                                                        className="w-7 h-7 rounded-lg bg-white border border-neutral-200 text-neutral-500 hover:border-neutral-300 transition-colors flex items-center justify-center"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                                                        </svg>
                                                    </button>
                                                    <span className="text-sm font-medium text-neutral-800 w-8 text-center">
                                                        {item.quantity}
                                                    </span>
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity + 1, item.selectedSize, item.selectedColor)}
                                                        className="w-7 h-7 rounded-lg bg-white border border-neutral-200 text-neutral-500 hover:border-neutral-300 transition-colors flex items-center justify-center"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => removeItem(item.id, item.selectedSize, item.selectedColor)}
                                                className="p-1.5 text-neutral-400 hover:text-red-500 transition-colors"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        {items.length > 0 && (
                            <div className="border-t border-neutral-100 p-6 space-y-4 bg-neutral-50">
                                <div className="flex items-center justify-between">
                                    <span className="text-neutral-600">Subtotal</span>
                                    <span className="text-xl font-bold text-primary-600">{formatPrice(getTotal())}</span>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <Link
                                        to="/cart"
                                        onClick={onClose}
                                        className="btn-secondary text-center text-sm"
                                    >
                                        View Cart
                                    </Link>
                                    <Link
                                        to="/checkout"
                                        onClick={onClose}
                                        className="btn-primary text-center text-sm"
                                    >
                                        Checkout
                                    </Link>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default MiniCart;
