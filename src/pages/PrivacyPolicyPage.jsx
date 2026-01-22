import { motion } from 'framer-motion';

export default function PrivacyPolicyPage() {
    return (
        <div className="min-h-screen bg-neutral-50 py-12">
            <div className="container mx-auto px-4 max-w-4xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl shadow-lg p-8 md:p-12"
                >
                    <h1 className="text-3xl md:text-4xl font-bold text-neutral-800 mb-4">Privacy Policy</h1>
                    <p className="text-neutral-600 mb-8">Last updated: January 22, 2026</p>

                    <div className="prose prose-neutral max-w-none space-y-6">
                        <section>
                            <h2 className="text-2xl font-semibold text-neutral-800 mb-3">Introduction</h2>
                            <p className="text-neutral-600 leading-relaxed">
                                Peckup Private Limited ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-neutral-800 mb-3">Information We Collect</h2>
                            <h3 className="text-lg font-semibold text-neutral-800 mb-2">Personal Information</h3>
                            <p className="text-neutral-600 leading-relaxed mb-3">
                                We collect information that you provide directly to us, including:
                            </p>
                            <ul className="list-disc list-inside space-y-2 text-neutral-600 ml-4">
                                <li>Name, email address, and phone number</li>
                                <li>Shipping and billing addresses</li>
                                <li>Payment information (processed securely through payment gateways)</li>
                                <li>Order history and preferences</li>
                                <li>Communication preferences</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-neutral-800 mb-3">How We Use Your Information</h2>
                            <p className="text-neutral-600 leading-relaxed mb-3">
                                We use the information we collect to:
                            </p>
                            <ul className="list-disc list-inside space-y-2 text-neutral-600 ml-4">
                                <li>Process and fulfill your orders</li>
                                <li>Communicate with you about your orders and account</li>
                                <li>Send you promotional offers and updates (with your consent)</li>
                                <li>Improve our website and services</li>
                                <li>Prevent fraud and enhance security</li>
                                <li>Comply with legal obligations</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-neutral-800 mb-3">Information Sharing</h2>
                            <p className="text-neutral-600 leading-relaxed mb-3">
                                We do not sell your personal information. We may share your information with:
                            </p>
                            <ul className="list-disc list-inside space-y-2 text-neutral-600 ml-4">
                                <li>Service providers who assist in our operations (shipping, payment processing)</li>
                                <li>Law enforcement when required by law</li>
                                <li>Business partners with your explicit consent</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-neutral-800 mb-3">Data Security</h2>
                            <p className="text-neutral-600 leading-relaxed">
                                We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet is 100% secure.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-neutral-800 mb-3">Your Rights</h2>
                            <p className="text-neutral-600 leading-relaxed mb-3">
                                You have the right to:
                            </p>
                            <ul className="list-disc list-inside space-y-2 text-neutral-600 ml-4">
                                <li>Access and update your personal information</li>
                                <li>Request deletion of your data</li>
                                <li>Opt-out of marketing communications</li>
                                <li>Object to processing of your data</li>
                                <li>Request data portability</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-neutral-800 mb-3">Cookies</h2>
                            <p className="text-neutral-600 leading-relaxed">
                                We use cookies and similar tracking technologies to enhance your browsing experience, analyze site traffic, and personalize content. You can control cookie preferences through your browser settings.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-neutral-800 mb-3">Changes to This Policy</h2>
                            <p className="text-neutral-600 leading-relaxed">
                                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last updated" date.
                            </p>
                        </section>

                        <section className="bg-primary-50 rounded-xl p-6">
                            <h2 className="text-2xl font-semibold text-neutral-800 mb-3">Contact Us</h2>
                            <p className="text-neutral-600 leading-relaxed mb-3">
                                If you have any questions about this Privacy Policy, please contact us:
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
