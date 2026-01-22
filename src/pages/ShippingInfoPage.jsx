import { motion } from 'framer-motion';

export default function ShippingInfoPage() {
    return (
        <div className="min-h-screen bg-neutral-50 py-12">
            <div className="container mx-auto px-4 max-w-4xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl shadow-lg p-8 md:p-12"
                >
                    <h1 className="text-3xl md:text-4xl font-bold text-neutral-800 mb-6">Shipping Information</h1>

                    <div className="space-y-8">
                        <section>
                            <h2 className="text-2xl font-semibold text-neutral-800 mb-4">Shipping Methods</h2>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="bg-neutral-50 rounded-xl p-6">
                                    <h3 className="text-lg font-semibold text-neutral-800 mb-2">Standard Shipping</h3>
                                    <p className="text-neutral-600 mb-2">Delivery in 5-7 business days</p>
                                    <p className="text-primary-600 font-bold">Free on orders above Rs 999</p>
                                </div>
                                <div className="bg-neutral-50 rounded-xl p-6">
                                    <h3 className="text-lg font-semibold text-neutral-800 mb-2">Express Shipping</h3>
                                    <p className="text-neutral-600 mb-2">Delivery in 2-3 business days</p>
                                    <p className="text-primary-600 font-bold">Rs 99 flat rate</p>
                                </div>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-neutral-800 mb-4">Shipping Charges</h2>
                            <div className="bg-neutral-50 rounded-xl p-6">
                                <ul className="space-y-3 text-neutral-600">
                                    <li className="flex items-start gap-3">
                                        <svg className="w-5 h-5 text-primary-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        <span><strong>Free Shipping:</strong> On all orders above Rs 999</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <svg className="w-5 h-5 text-primary-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        <span><strong>Standard Shipping:</strong> Rs 49 for orders below Rs 999</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <svg className="w-5 h-5 text-primary-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        <span><strong>Express Shipping:</strong> Rs 99 flat rate (any order value)</span>
                                    </li>
                                </ul>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-neutral-800 mb-4">Delivery Areas</h2>
                            <p className="text-neutral-600 mb-4">
                                We currently deliver to all major cities and towns across India. Remote areas may experience slightly longer delivery times.
                            </p>
                            <div className="bg-primary-50 rounded-xl p-6">
                                <p className="text-neutral-700">
                                    <strong>Note:</strong> Delivery times are estimates and may vary based on location, weather conditions, and other factors beyond our control.
                                </p>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-neutral-800 mb-4">Order Processing</h2>
                            <div className="bg-neutral-50 rounded-xl p-6">
                                <ul className="space-y-3 text-neutral-600">
                                    <li className="flex items-start gap-3">
                                        <span className="w-6 h-6 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">1</span>
                                        <span>Orders are processed within 24 hours of placement</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="w-6 h-6 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">2</span>
                                        <span>You'll receive a confirmation email once your order is shipped</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="w-6 h-6 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">3</span>
                                        <span>Track your order using the tracking number provided</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="w-6 h-6 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">4</span>
                                        <span>Orders placed on weekends/holidays will be processed on the next business day</span>
                                    </li>
                                </ul>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-neutral-800 mb-4">Contact Us</h2>
                            <p className="text-neutral-600 mb-4">
                                For any shipping-related queries, please contact us at:
                            </p>
                            <a href="mailto:support@peckup.in" className="text-primary-600 hover:text-primary-700 font-semibold text-lg">
                                support@peckup.in
                            </a>
                        </section>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
