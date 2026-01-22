import { motion } from 'framer-motion';

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-neutral-50 py-12">
            <div className="container mx-auto px-4 max-w-4xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl shadow-lg p-8 md:p-12"
                >
                    <h1 className="text-3xl md:text-4xl font-bold text-neutral-800 mb-4">Terms of Service</h1>
                    <p className="text-neutral-600 mb-8">Last updated: January 22, 2026</p>

                    <div className="prose prose-neutral max-w-none space-y-6">
                        <section>
                            <h2 className="text-2xl font-semibold text-neutral-800 mb-3">Agreement to Terms</h2>
                            <p className="text-neutral-600 leading-relaxed">
                                By accessing and using the Peckup website and services, you agree to be bound by these Terms of Service. If you disagree with any part of these terms, you may not access our services.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-neutral-800 mb-3">Use of Services</h2>
                            <h3 className="text-lg font-semibold text-neutral-800 mb-2">Eligibility</h3>
                            <p className="text-neutral-600 leading-relaxed mb-3">
                                You must be at least 18 years old to use our services. By using our services, you represent that you meet this age requirement.
                            </p>
                            <h3 className="text-lg font-semibold text-neutral-800 mb-2">Account Responsibilities</h3>
                            <ul className="list-disc list-inside space-y-2 text-neutral-600 ml-4">
                                <li>You are responsible for maintaining the confidentiality of your account</li>
                                <li>You must provide accurate and complete information</li>
                                <li>You are responsible for all activities under your account</li>
                                <li>Notify us immediately of any unauthorized use</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-neutral-800 mb-3">Orders and Payments</h2>
                            <ul className="list-disc list-inside space-y-2 text-neutral-600 ml-4">
                                <li>All orders are subject to acceptance and availability</li>
                                <li>We reserve the right to refuse or cancel any order</li>
                                <li>Prices are subject to change without notice</li>
                                <li>Payment must be received before order processing</li>
                                <li>We accept various payment methods as displayed at checkout</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-neutral-800 mb-3">Product Information</h2>
                            <p className="text-neutral-600 leading-relaxed">
                                We strive to provide accurate product descriptions and images. However, we do not warrant that product descriptions, colors, or other content are accurate, complete, or error-free. If a product is not as described, your sole remedy is to return it in accordance with our return policy.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-neutral-800 mb-3">Shipping and Delivery</h2>
                            <ul className="list-disc list-inside space-y-2 text-neutral-600 ml-4">
                                <li>Delivery times are estimates and not guaranteed</li>
                                <li>Risk of loss passes to you upon delivery to the carrier</li>
                                <li>We are not responsible for delays caused by shipping carriers</li>
                                <li>Additional customs fees may apply for certain locations</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-neutral-800 mb-3">Returns and Refunds</h2>
                            <p className="text-neutral-600 leading-relaxed">
                                Please refer to our Refund Policy for detailed information about returns, exchanges, and refunds.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-neutral-800 mb-3">Prohibited Activities</h2>
                            <p className="text-neutral-600 leading-relaxed mb-3">
                                You may not:
                            </p>
                            <ul className="list-disc list-inside space-y-2 text-neutral-600 ml-4">
                                <li>Use our services for any illegal purpose</li>
                                <li>Attempt to gain unauthorized access to our systems</li>
                                <li>Interfere with the proper functioning of our services</li>
                                <li>Impersonate any person or entity</li>
                                <li>Collect or harvest information about other users</li>
                                <li>Transmit viruses or malicious code</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-neutral-800 mb-3">Intellectual Property</h2>
                            <p className="text-neutral-600 leading-relaxed">
                                All content on our website, including text, graphics, logos, images, and software, is the property of Peckup Private Limited and protected by intellectual property laws. You may not reproduce, distribute, or create derivative works without our express written permission.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-neutral-800 mb-3">Limitation of Liability</h2>
                            <p className="text-neutral-600 leading-relaxed">
                                To the maximum extent permitted by law, Peckup Private Limited shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of our services.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-neutral-800 mb-3">Governing Law</h2>
                            <p className="text-neutral-600 leading-relaxed">
                                These Terms shall be governed by and construed in accordance with the laws of India, without regard to its conflict of law provisions.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-neutral-800 mb-3">Changes to Terms</h2>
                            <p className="text-neutral-600 leading-relaxed">
                                We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting. Your continued use of our services constitutes acceptance of the modified terms.
                            </p>
                        </section>

                        <section className="bg-primary-50 rounded-xl p-6">
                            <h2 className="text-2xl font-semibold text-neutral-800 mb-3">Contact Information</h2>
                            <p className="text-neutral-600 leading-relaxed mb-3">
                                For questions about these Terms of Service, please contact:
                            </p>
                            <p className="text-neutral-700">
                                <strong>Peckup Private Limited</strong><br />
                                Email: <a href="mailto:support@peckup.in" className="text-primary-600 hover:text-primary-700">support@peckup.in</a>
                            </p>
                        </section>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
