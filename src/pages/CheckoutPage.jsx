import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCartStore } from '../stores/cartStore';
import { useAuthStore } from '../stores/authStore';
import { useAddressStore } from '../stores/addressStore';
import { useOrderStore } from '../stores/orderStore';
import { useToast } from '../stores/toastStore';
import { formatPrice } from '../utils/priceFormatter';
import { motion, AnimatePresence } from 'framer-motion';
import AddressManager from '../components/AddressManager';
import Receipt from '../components/Receipt';

const CheckoutPage = () => {
    const navigate = useNavigate();
    const items = useCartStore((state) => state.items);
    const getTotal = useCartStore((state) => state.getTotal);
    const clearCart = useCartStore((state) => state.clearCart);
    const { isAuthenticated } = useAuthStore();
    const { addresses, fetchAddresses, getDefaultAddress } = useAddressStore();
    const { createOrder, downloadReceipt } = useOrderStore();
    const { showSuccess, showError } = useToast();

    const [selectedAddress, setSelectedAddress] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState('cod');
    const [paymentDetails, setPaymentDetails] = useState({
        // Card details
        card_number: '',
        card_holder_name: '',
        expiry_month: '',
        expiry_year: '',
        cvv: '',
        // UPI details
        upi_id: '',
        upi_name: ''
    });
    const [showAddressManager, setShowAddressManager] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [showReceiptModal, setShowReceiptModal] = useState(false);
    const [orderData, setOrderData] = useState(null);
    const [errors, setErrors] = useState({});

    // Debug log for modal state
    useEffect(() => {
        console.log('Modal state changed:', { showReceiptModal, orderData });
    }, [showReceiptModal, orderData]);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        fetchAddresses();
    }, [isAuthenticated]);

    useEffect(() => {
        // Set default address when addresses are loaded
        if (addresses.length > 0 && !selectedAddress) {
            const defaultAddr = getDefaultAddress();
            setSelectedAddress(defaultAddr);
        }
    }, [addresses, selectedAddress]);

    // Prevent modal from closing accidentally
    useEffect(() => {
        if (showReceiptModal) {
            document.body.style.overflow = 'hidden';
            
            const handleBeforeUnload = (e) => {
                e.preventDefault();
                e.returnValue = '';
            };
            
            window.addEventListener('beforeunload', handleBeforeUnload);
            
            return () => {
                document.body.style.overflow = 'unset';
                window.removeEventListener('beforeunload', handleBeforeUnload);
            };
        }
    }, [showReceiptModal]);

    const handleAddressSelect = (address) => {
        setSelectedAddress(address);
    };

    const handlePaymentChange = (e) => {
        const { name, value } = e.target;
        setPaymentDetails((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: '' }));
        }
    };

    const validatePaymentDetails = () => {
        const newErrors = {};
        
        if (paymentMethod === 'card') {
            if (!paymentDetails.card_number) newErrors.card_number = 'Card number is required';
            else if (paymentDetails.card_number.replace(/\s/g, '').length !== 16) newErrors.card_number = 'Card number must be 16 digits';
            
            if (!paymentDetails.card_holder_name) newErrors.card_holder_name = 'Cardholder name is required';
            if (!paymentDetails.expiry_month) newErrors.expiry_month = 'Expiry month is required';
            if (!paymentDetails.expiry_year) newErrors.expiry_year = 'Expiry year is required';
            if (!paymentDetails.cvv) newErrors.cvv = 'CVV is required';
            else if (paymentDetails.cvv.length !== 3) newErrors.cvv = 'CVV must be 3 digits';
        } else if (paymentMethod === 'upi') {
            if (!paymentDetails.upi_id) newErrors.upi_id = 'UPI ID is required';
            if (!paymentDetails.upi_name) newErrors.upi_name = 'Name is required';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!selectedAddress) {
            showError('Please select a delivery address');
            return;
        }
        
        if (!validatePaymentDetails()) {
            showError('Please fill in all required payment details');
            return;
        }
        
        if (items.length === 0) {
            showError('Your cart is empty');
            return;
        }
        
        setIsProcessing(true);
        
        try {
            // Prepare order items from cart
            const orderItems = items.map(item => ({
                product_id: item.id,
                quantity: item.quantity,
                size: item.selectedSize || null,
                color: item.selectedColor || null
            }));
            
            const orderPayload = {
                address_id: selectedAddress.id,
                payment_method: paymentMethod,
                items: orderItems,
                payment_details: paymentMethod !== 'cod' ? paymentDetails : null
            };
            
            console.log('Creating order with payload:', orderPayload);
            
            const result = await createOrder(orderPayload);
            
            console.log('Order creation result:', result);
            
            if (result.success && result.order) {
                console.log('Order created successfully:', result.order);
                
                // Set order data first
                setOrderData(result.order);
                
                // Use setTimeout to ensure state is updated before showing modal
                setTimeout(() => {
                    console.log('Setting showReceiptModal to true');
                    setShowReceiptModal(true);
                }, 100);
                
                // Clear cart after a delay
                setTimeout(() => {
                    clearCart();
                }, 200);
            } else {
                console.error('Order creation failed:', result.error);
                showError(result.error || 'Failed to place order');
            }
        } catch (error) {
            console.error('Order creation error:', error);
            showError('Failed to place order. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleDownloadReceipt = async () => {
        if (orderData) {
            const result = await downloadReceipt(orderData.id);
            if (!result.success) {
                showError('Failed to download receipt');
            }
        }
    };

    const handleCloseReceiptModal = () => {
        setShowReceiptModal(false);
        setOrderData(null);
        navigate('/account');
    };

    if (items.length === 0 && !showReceiptModal) {
        return (
            <div className="container mx-auto px-4 py-16 md:py-24 text-center">
                <div className="max-w-md mx-auto">
                    <h1 className="text-2xl font-bold text-neutral-800 mb-4">Your cart is empty</h1>
                    <p className="text-neutral-500 mb-8">Add some items to proceed with checkout.</p>
                    <Link to="/" className="btn-primary">Start Shopping</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-neutral-50 py-8 md:py-12">
            <div className="container mx-auto px-4">
                <h1 className="text-2xl md:text-3xl font-bold text-neutral-800 mb-8">Checkout</h1>

                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-6">
                            {/* Address Selection */}
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-6 rounded-2xl shadow-md border border-neutral-100">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-lg font-semibold text-neutral-800">Delivery Address</h2>
                                    <button
                                        type="button"
                                        onClick={() => setShowAddressManager(!showAddressManager)}
                                        className="text-orange-500 hover:text-orange-600 text-sm font-medium"
                                    >
                                        {showAddressManager ? 'Hide' : 'Manage Addresses'}
                                    </button>
                                </div>
                                
                                {showAddressManager ? (
                                    <AddressManager 
                                        showSelector={true}
                                        selectedAddressId={selectedAddress?.id}
                                        onAddressSelect={handleAddressSelect}
                                    />
                                ) : selectedAddress ? (
                                    <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h4 className="font-semibold text-gray-900">{selectedAddress.full_name}</h4>
                                                <p className="text-gray-600 text-sm">{selectedAddress.phone}</p>
                                                <p className="text-gray-700">
                                                    {selectedAddress.address_line1}
                                                    {selectedAddress.address_line2 && `, ${selectedAddress.address_line2}`}
                                                </p>
                                                <p className="text-gray-700">
                                                    {selectedAddress.city}, {selectedAddress.state} - {selectedAddress.pincode}
                                                </p>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => setShowAddressManager(true)}
                                                className="text-orange-500 hover:text-orange-600 text-sm"
                                            >
                                                Change
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-8 text-gray-500">
                                        <p className="mb-4">No address selected</p>
                                        <button
                                            type="button"
                                            onClick={() => setShowAddressManager(true)}
                                            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                                        >
                                            Add Address
                                        </button>
                                    </div>
                                )}
                            </motion.div>

                            {/* Payment Method */}
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white p-6 rounded-2xl shadow-md border border-neutral-100">
                                <h2 className="text-lg font-semibold text-neutral-800 mb-6">Payment Method</h2>
                                <div className="space-y-3 mb-6">
                                    {[
                                        { id: 'cod', label: 'Cash on Delivery', icon: '💵', desc: 'Pay when you receive your order' },
                                        { id: 'upi', label: 'UPI Payment', icon: '📱', desc: 'Pay using UPI apps like GPay, PhonePe' },
                                        { id: 'card', label: 'Credit/Debit Card', icon: '💳', desc: 'Secure card payment' },
                                    ].map((method) => (
                                        <label key={method.id} className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${paymentMethod === method.id ? 'bg-orange-50 border-orange-300' : 'border-neutral-200 hover:border-neutral-300'}`}>
                                            <input 
                                                type="radio" 
                                                name="paymentMethod" 
                                                value={method.id} 
                                                checked={paymentMethod === method.id} 
                                                onChange={(e) => setPaymentMethod(e.target.value)} 
                                                className="sr-only" 
                                            />
                                            <span className="text-2xl">{method.icon}</span>
                                            <div className="flex-1">
                                                <span className="text-neutral-800 font-medium block">{method.label}</span>
                                                <span className="text-neutral-500 text-sm">{method.desc}</span>
                                            </div>
                                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === method.id ? 'border-orange-500 bg-orange-500' : 'border-neutral-300'}`}>
                                                {paymentMethod === method.id && <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>}
                                            </div>
                                        </label>
                                    ))}
                                </div>

                                {/* Payment Details Forms */}
                                {paymentMethod === 'card' && (
                                    <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                                        <h3 className="font-medium text-gray-900">Card Details</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="md:col-span-2">
                                                <label className="block text-sm text-gray-600 mb-2">Card Number</label>
                                                <input 
                                                    type="text" 
                                                    name="card_number" 
                                                    value={paymentDetails.card_number} 
                                                    onChange={handlePaymentChange}
                                                    className={`w-full px-3 py-2 border rounded-lg ${errors.card_number ? 'border-red-500' : 'border-gray-300'}`}
                                                    placeholder="1234 5678 9012 3456" 
                                                    maxLength={19}
                                                />
                                                {errors.card_number && <p className="text-red-500 text-sm mt-1">{errors.card_number}</p>}
                                            </div>
                                            <div className="md:col-span-2">
                                                <label className="block text-sm text-gray-600 mb-2">Cardholder Name</label>
                                                <input 
                                                    type="text" 
                                                    name="card_holder_name" 
                                                    value={paymentDetails.card_holder_name} 
                                                    onChange={handlePaymentChange}
                                                    className={`w-full px-3 py-2 border rounded-lg ${errors.card_holder_name ? 'border-red-500' : 'border-gray-300'}`}
                                                    placeholder="John Doe" 
                                                />
                                                {errors.card_holder_name && <p className="text-red-500 text-sm mt-1">{errors.card_holder_name}</p>}
                                            </div>
                                            <div>
                                                <label className="block text-sm text-gray-600 mb-2">Expiry Month</label>
                                                <select 
                                                    name="expiry_month" 
                                                    value={paymentDetails.expiry_month} 
                                                    onChange={handlePaymentChange}
                                                    className={`w-full px-3 py-2 border rounded-lg ${errors.expiry_month ? 'border-red-500' : 'border-gray-300'}`}
                                                >
                                                    <option value="">Month</option>
                                                    {Array.from({length: 12}, (_, i) => (
                                                        <option key={i+1} value={String(i+1).padStart(2, '0')}>
                                                            {String(i+1).padStart(2, '0')}
                                                        </option>
                                                    ))}
                                                </select>
                                                {errors.expiry_month && <p className="text-red-500 text-sm mt-1">{errors.expiry_month}</p>}
                                            </div>
                                            <div>
                                                <label className="block text-sm text-gray-600 mb-2">Expiry Year</label>
                                                <select 
                                                    name="expiry_year" 
                                                    value={paymentDetails.expiry_year} 
                                                    onChange={handlePaymentChange}
                                                    className={`w-full px-3 py-2 border rounded-lg ${errors.expiry_year ? 'border-red-500' : 'border-gray-300'}`}
                                                >
                                                    <option value="">Year</option>
                                                    {Array.from({length: 10}, (_, i) => {
                                                        const year = new Date().getFullYear() + i;
                                                        return <option key={year} value={year}>{year}</option>
                                                    })}
                                                </select>
                                                {errors.expiry_year && <p className="text-red-500 text-sm mt-1">{errors.expiry_year}</p>}
                                            </div>
                                            <div>
                                                <label className="block text-sm text-gray-600 mb-2">CVV</label>
                                                <input 
                                                    type="text" 
                                                    name="cvv" 
                                                    value={paymentDetails.cvv} 
                                                    onChange={handlePaymentChange}
                                                    className={`w-full px-3 py-2 border rounded-lg ${errors.cvv ? 'border-red-500' : 'border-gray-300'}`}
                                                    placeholder="123" 
                                                    maxLength={3}
                                                />
                                                {errors.cvv && <p className="text-red-500 text-sm mt-1">{errors.cvv}</p>}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {paymentMethod === 'upi' && (
                                    <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                                        <h3 className="font-medium text-gray-900">UPI Details</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm text-gray-600 mb-2">UPI ID</label>
                                                <input 
                                                    type="text" 
                                                    name="upi_id" 
                                                    value={paymentDetails.upi_id} 
                                                    onChange={handlePaymentChange}
                                                    className={`w-full px-3 py-2 border rounded-lg ${errors.upi_id ? 'border-red-500' : 'border-gray-300'}`}
                                                    placeholder="yourname@paytm" 
                                                />
                                                {errors.upi_id && <p className="text-red-500 text-sm mt-1">{errors.upi_id}</p>}
                                            </div>
                                            <div>
                                                <label className="block text-sm text-gray-600 mb-2">Name</label>
                                                <input 
                                                    type="text" 
                                                    name="upi_name" 
                                                    value={paymentDetails.upi_name} 
                                                    onChange={handlePaymentChange}
                                                    className={`w-full px-3 py-2 border rounded-lg ${errors.upi_name ? 'border-red-500' : 'border-gray-300'}`}
                                                    placeholder="Your Name" 
                                                />
                                                {errors.upi_name && <p className="text-red-500 text-sm mt-1">{errors.upi_name}</p>}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        </div>

                        <div className="lg:col-span-1">
                            <div className="bg-white p-6 rounded-2xl shadow-md border border-neutral-100 sticky top-24">
                                <h2 className="text-lg font-semibold text-neutral-800 mb-6">Order Summary</h2>
                                <div className="space-y-4 mb-6 max-h-60 overflow-y-auto">
                                    {items.map((item) => (
                                        <div key={`${item.id}-${item.selectedSize}`} className="flex gap-3">
                                            <img src={item.images?.[0] || 'https://images.unsplash.com/photo-1556912172-45b7abe8b7e4?w=100'} alt={item.title} className="w-16 h-16 object-cover rounded-lg bg-neutral-100" />
                                            <div className="flex-1 min-w-0">
                                                <h4 className="text-sm text-neutral-700 line-clamp-2">{item.title}</h4>
                                                <p className="text-sm text-neutral-500">Qty: {item.quantity}</p>
                                            </div>
                                            <p className="text-sm font-medium text-neutral-800">{formatPrice(item.price * item.quantity)}</p>
                                        </div>
                                    ))}
                                </div>
                                <div className="h-px bg-neutral-200 mb-6"></div>
                                <div className="space-y-3 mb-6">
                                    <div className="flex justify-between text-neutral-600"><span>Subtotal</span><span>{formatPrice(getTotal())}</span></div>
                                    <div className="flex justify-between text-neutral-600"><span>Shipping</span><span className="text-secondary-600 font-medium">Free</span></div>
                                    <div className="h-px bg-neutral-200"></div>
                                    <div className="flex justify-between"><span className="text-neutral-800 font-medium">Total</span><span className="text-xl font-bold text-primary-600">{formatPrice(getTotal())}</span></div>
                                </div>
                                <button type="submit" disabled={isProcessing || !selectedAddress} className="btn-primary w-full disabled:opacity-50">
                                    {isProcessing ? <span className="flex items-center justify-center gap-2"><svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>Processing...</span> : `Place Order - ${formatPrice(getTotal())}`}
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>

            {/* Receipt Modal */}
            <AnimatePresence>
                {showReceiptModal && orderData && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-[9999]"
                        onClick={(e) => {
                            // Prevent closing when clicking inside the modal
                            if (e.target === e.currentTarget) {
                                // Don't close on backdrop click to ensure user sees the confirmation
                            }
                        }}
                    >
                        {console.log('Rendering receipt modal with orderData:', orderData)}
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            transition={{ type: "spring", duration: 0.5 }}
                            className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl relative"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="text-center">
                                {/* Success Icon */}
                                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                
                                {/* Title */}
                                <h3 className="text-2xl font-bold text-gray-900 mb-3">Order Placed Successfully!</h3>
                                <p className="text-gray-600 mb-6">
                                    Your order has been confirmed and will be processed soon.
                                </p>
                                
                                {/* Order Details */}
                                <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 mb-6 border border-orange-200">
                                    <div className="space-y-3 text-left">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm font-medium text-gray-700">Order Number:</span>
                                            <span className="text-sm font-bold text-gray-900">{orderData.order_number}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm font-medium text-gray-700">Receipt Number:</span>
                                            <span className="text-sm font-bold text-gray-900">{orderData.receipt_number}</span>
                                        </div>
                                        <div className="flex justify-between items-center pt-3 border-t border-orange-200">
                                            <span className="text-sm font-medium text-gray-700">Total Amount:</span>
                                            <span className="text-lg font-bold text-orange-600">{formatPrice(orderData.total_amount)}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm font-medium text-gray-700">Payment Method:</span>
                                            <span className="text-sm font-semibold text-gray-900">{orderData.payment_method.toUpperCase()}</span>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Action Buttons */}
                                <div className="space-y-3">
                                    <button
                                        onClick={handleDownloadReceipt}
                                        className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors font-semibold shadow-lg hover:shadow-xl"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        Download Receipt (PDF)
                                    </button>
                                    <button
                                        onClick={handleCloseReceiptModal}
                                        className="w-full px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-semibold"
                                    >
                                        View My Orders
                                    </button>
                                </div>
                                
                                {/* Info Text */}
                                <p className="text-xs text-gray-500 mt-6">
                                    You can download your receipt anytime from your account page
                                </p>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default CheckoutPage;
