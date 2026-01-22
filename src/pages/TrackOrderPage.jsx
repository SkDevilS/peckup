import { useState } from 'react';
import { motion } from 'framer-motion';

export default function TrackOrderPage() {
    const [orderNumber, setOrderNumber] = useState('');
    const [email, setEmail] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // This would typically make an API call to track the order
        alert('Order tracking functionality will be implemented soon. Please check your email for tracking information or contact support@peckup.in');
    };

    return (
        <div className="min-h-screen bg-neutral-50 py-12">
            <div className="container mx-auto px-4 max-w-2xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl shadow-lg p-8 md:p-12"
                >
                    <div className="text-center mb-8">
                        <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-10 h-10 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                            </svg>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold text-neutral-800 mb-2">Track Your Order</h1>
                        <p className="text-neutral-600">Enter your order details to track your shipment</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-2">
                                Order Number
                            </label>
                            <input
                                type="text"
                                value={orderNumber}
                                onChange={(e) => setOrderNumber(e.target.value)}
                                placeholder="e.g., ORD-20240122-001"
                                className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                                required
                            />
                            <p className="text-sm text-neutral-500 mt-2">
                                You can find your order number in the confirmation email
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-2">
                                Email Address
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="your@email.com"
                                className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                                required
                            />
                            <p className="text-sm text-neutral-500 mt-2">
                                Enter the email address used for the order
                            </p>
                        </div>

                        <button type="submit" className="btn-primary w-full py-4 text-lg">
                            Track Order
                        </button>
                    </form>

                    <div className="mt-12 pt-8 border-t border-neutral-200">
                        <h3 className="text-lg font-semibold text-neutral-800 mb-4">Alternative Ways to Track</h3>
                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <svg className="w-6 h-6 text-primary-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                <div>
                                    <p className="font-medium text-neutral-800">Account Dashboard</p>
                                    <p className="text-sm text-neutral-600">Log in to your account to view all your orders and tracking information</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <svg className="w-6 h-6 text-primary-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                <div>
                                    <p className="font-medium text-neutral-800">Email Updates</p>
                                    <p className="text-sm text-neutral-600">Check your email for shipping confirmation and tracking links</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <svg className="w-6 h-6 text-primary-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                                <div>
                                    <p className="font-medium text-neutral-800">Customer Support</p>
                                    <p className="text-sm text-neutral-600">Contact us at <a href="mailto:support@peckup.in" className="text-primary-600 hover:text-primary-700">support@peckup.in</a> for assistance</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
