import { motion } from 'framer-motion';

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-neutral-50 py-12">
            <div className="container mx-auto px-4 max-w-4xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl shadow-lg p-8 md:p-12"
                >
                    <h1 className="text-3xl md:text-4xl font-bold text-neutral-800 mb-6">About Peckup</h1>

                    <div className="space-y-8">
                        <section>
                            <h2 className="text-2xl font-semibold text-neutral-800 mb-4">Who We Are</h2>
                            <p className="text-neutral-600 leading-relaxed mb-4">
                                Peckup Private Limited is your trusted destination for premium quality products at the best prices. 
                                Founded with a vision to make online shopping convenient, reliable, and enjoyable, we've grown to become 
                                a preferred choice for thousands of customers across India.
                            </p>
                            <p className="text-neutral-600 leading-relaxed">
                                We believe in delivering not just products, but experiences that exceed expectations. Every item in our 
                                catalog is carefully selected to ensure quality, authenticity, and value for money.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-neutral-800 mb-4">Our Mission</h2>
                            <div className="bg-primary-50 rounded-xl p-6">
                                <p className="text-neutral-700 leading-relaxed italic">
                                    "To provide our customers with a seamless shopping experience, offering genuine products, 
                                    competitive prices, and exceptional customer service that builds lasting relationships."
                                </p>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-neutral-800 mb-4">Why Choose Us</h2>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="bg-neutral-50 rounded-xl p-6">
                                    <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                                        <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-lg font-semibold text-neutral-800 mb-2">100% Genuine Products</h3>
                                    <p className="text-neutral-600">All products are sourced directly from authorized distributors and brands.</p>
                                </div>
                                <div className="bg-neutral-50 rounded-xl p-6">
                                    <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                                        <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-lg font-semibold text-neutral-800 mb-2">Best Prices</h3>
                                    <p className="text-neutral-600">Competitive pricing with regular discounts and offers to give you the best value.</p>
                                </div>
                                <div className="bg-neutral-50 rounded-xl p-6">
                                    <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                                        <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-lg font-semibold text-neutral-800 mb-2">Fast Delivery</h3>
                                    <p className="text-neutral-600">Quick and reliable shipping to ensure your products reach you on time.</p>
                                </div>
                                <div className="bg-neutral-50 rounded-xl p-6">
                                    <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                                        <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-lg font-semibold text-neutral-800 mb-2">24/7 Support</h3>
                                    <p className="text-neutral-600">Our dedicated support team is always ready to assist you with any queries.</p>
                                </div>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-neutral-800 mb-4">Our Values</h2>
                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <svg className="w-6 h-6 text-primary-600 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    <div>
                                        <h3 className="font-semibold text-neutral-800 mb-1">Customer First</h3>
                                        <p className="text-neutral-600">Every decision we make is centered around providing the best experience for our customers.</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <svg className="w-6 h-6 text-primary-600 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    <div>
                                        <h3 className="font-semibold text-neutral-800 mb-1">Integrity</h3>
                                        <p className="text-neutral-600">We maintain transparency and honesty in all our business practices.</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <svg className="w-6 h-6 text-primary-600 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    <div>
                                        <h3 className="font-semibold text-neutral-800 mb-1">Quality</h3>
                                        <p className="text-neutral-600">We never compromise on the quality of products and services we offer.</p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section className="bg-neutral-50 rounded-xl p-6">
                            <h2 className="text-2xl font-semibold text-neutral-800 mb-4">Get in Touch</h2>
                            <p className="text-neutral-600 mb-4">
                                Have questions or feedback? We'd love to hear from you!
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <a href="mailto:support@peckup.in" className="btn-primary text-center">Contact Us</a>
                                <a href="/faqs" className="px-6 py-3 bg-white border-2 border-neutral-300 text-neutral-700 rounded-xl hover:bg-neutral-50 transition-colors font-semibold text-center">View FAQs</a>
                            </div>
                        </section>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
