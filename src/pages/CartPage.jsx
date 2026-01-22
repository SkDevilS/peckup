import { Link } from 'react-router-dom';
import { useCartStore } from '../stores/cartStore';
import { formatPrice } from '../utils/priceFormatter';
import { motion } from 'framer-motion';

const CartPage = () => {
    const items = useCartStore((state) => state.items);
    const removeItem = useCartStore((state) => state.removeItem);
    const updateQuantity = useCartStore((state) => state.updateQuantity);
    const getTotal = useCartStore((state) => state.getTotal);
    const clearCart = useCartStore((state) => state.clearCart);

    if (items.length === 0) {
        return (
            <div className="container mx-auto px-4 py-16 md:py-24 text-center">
                <div className="max-w-md mx-auto">
                    <div className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-neutral-100 flex items-center justify-center">
                        <svg className="w-12 h-12 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold text-neutral-800 mb-4">Your cart is empty</h1>
                    <p className="text-neutral-500 mb-8">Looks like you haven't added anything yet.</p>
                    <Link to="/" className="btn-primary inline-flex items-center gap-2">
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
        <div className="min-h-screen bg-neutral-50 py-8 md:py-12">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-neutral-800 mb-2">Shopping Cart</h1>
                        <p className="text-neutral-500">{items.length} item{items.length !== 1 ? 's' : ''} in your cart</p>
                    </div>
                    <button onClick={clearCart} className="text-neutral-500 hover:text-red-500 text-sm font-medium transition-colors">
                        Clear Cart
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-4">
                        {items.map((item, index) => (
                            <motion.div
                                key={`${item.id}-${item.selectedSize}`}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white p-4 md:p-6 rounded-2xl shadow-md border border-neutral-100"
                            >
                                <div className="flex gap-4 md:gap-6">
                                    <Link to={`/product/${item.slug}`} className="shrink-0">
                                        <img
                                            src={item.images?.[0] || 'https://images.unsplash.com/photo-1556912172-45b7abe8b7e4?w=200'}
                                            alt={item.title}
                                            className="w-24 h-24 md:w-32 md:h-32 object-cover rounded-xl bg-neutral-100"
                                        />
                                    </Link>
                                    <div className="flex-1 min-w-0">
                                        <Link to={`/product/${item.slug}`}>
                                            <h3 className="font-medium text-neutral-800 hover:text-primary-600 transition-colors line-clamp-2 mb-2">
                                                {item.title}
                                            </h3>
                                        </Link>
                                        {item.selectedSize && <p className="text-sm text-neutral-500 mb-2">Size: {item.selectedSize}</p>}
                                        <p className="text-lg font-semibold text-primary-600 mb-4">{formatPrice(item.price)}</p>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center bg-neutral-100 rounded-lg">
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity - 1, item.selectedSize)}
                                                    className="px-3 py-2 text-neutral-600 hover:text-neutral-800 transition-colors"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                                                    </svg>
                                                </button>
                                                <span className="w-10 text-center font-medium text-neutral-800">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1, item.selectedSize)}
                                                    className="px-3 py-2 text-neutral-600 hover:text-neutral-800 transition-colors"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                                    </svg>
                                                </button>
                                            </div>
                                            <button onClick={() => removeItem(item.id, item.selectedSize)} className="p-2 text-neutral-400 hover:text-red-500 transition-colors">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                    <div className="hidden md:block text-right">
                                        <p className="text-lg font-bold text-neutral-800">{formatPrice(item.price * item.quantity)}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <div className="lg:col-span-1">
                        <div className="bg-white p-6 rounded-2xl shadow-md border border-neutral-100 sticky top-24">
                            <h2 className="text-lg font-semibold text-neutral-800 mb-6">Order Summary</h2>
                            <div className="space-y-4 mb-6">
                                <div className="flex justify-between text-neutral-600">
                                    <span>Subtotal</span>
                                    <span>{formatPrice(getTotal())}</span>
                                </div>
                                <div className="flex justify-between text-neutral-600">
                                    <span>Shipping</span>
                                    <span className="text-secondary-600 font-medium">Free</span>
                                </div>
                                <div className="h-px bg-neutral-200"></div>
                                <div className="flex justify-between">
                                    <span className="text-neutral-800 font-medium">Total</span>
                                    <span className="text-xl font-bold text-primary-600">{formatPrice(getTotal())}</span>
                                </div>
                            </div>
                            <Link to="/checkout" className="btn-primary w-full text-center block mb-4">Proceed to Checkout</Link>
                            <Link to="/" className="btn-secondary w-full text-center block">Continue Shopping</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartPage;
