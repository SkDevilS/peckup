import { motion } from 'framer-motion';

export default function RefundPolicyPage() {
    return (
        <div className="min-h-screen bg-neutral-50 py-12">
            <div className="container mx-auto px-4 max-w-4xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl shadow-lg p-8 md:p-12"
                >
                    <h1 className="text-3xl md:text-4xl font-bold text-neutral-800 mb-4">Refund Policy</h1>
                    <p className="text-neutral-600 mb-8">Last updated: January 22, 2026</p>

                    <div className="prose prose-neutral max-w-none space-y-6">
                        <section>
                            <h2 className="text-2xl font-semibold text-neutral-800 mb-3">30-Day Return Policy</h2>
                            <p className="text-neutral-600 leading-relaxed">
                                At Peckup Private Limited, we want you to be completely satisfied with your purchase. If you're not happy with your order, you can return it within 30 days of delivery for a full refund or exchange.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-neutral-800 mb-3">Eligibility for Returns</h2>
                            <p className="text-neutral-600 leading-relaxed mb-3">
                                To be eligible for a return, your item must meet the following conditions:
                            </p>
                            <ul className="list-disc list-inside space-y-2 text-neutral-600 ml-4">
                                <li>Item must be unused and in the same condition as received</li>
                                <li>Item must be in original packaging with all tags attached</li>
                                <li>Return request must be initiated within 30 days of delivery</li>
                                <li>Proof of purchase (order number or receipt) must be provided</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-neutral-800 mb-3">Non-Returnable Items</h2>
                            <p className="text-neutral-600 leading-relaxed mb-3">
                                The following items cannot be returned:
                            </p>
                            <ul className="list-disc list-inside space-y-2 text-neutral-600 ml-4">
                                <li>Personal care items and cosmetics (for hygiene reasons)</li>
                                <li>Intimate or sanitary goods</li>
                                <li>Items marked as "Final Sale" or "Non-Returnable"</li>
                                <li>Gift cards</li>
                                <li>Downloadable software or digital products</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-neutral-800 mb-3">How to Return an Item</h2>
                            <div className="bg-neutral-50 rounded-xl p-6">
                                <ol className="space-y-3 text-neutral-600">
                                    <li className="flex items-start gap-3">
                                        <span className="w-6 h-6 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">1</span>
                                        <span>Contact our support team at <a href="mailto:support@peckup.in" className="text-primary-600 hover:text-primary-700">support@peckup.in</a> with your order number</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="w-6 h-6 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">2</span>
                                        <span>Receive return authorization and shipping instructions</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="w-6 h-6 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">3</span>
                                        <span>Pack the item securely in its original packaging</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="w-6 h-6 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">4</span>
                                        <span>Ship the item to the provided return address</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="w-6 h-6 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">5</span>
                                        <span>Receive confirmation once your return is processed</span>
                                    </li>
                                </ol>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-neutral-800 mb-3">Return Shipping Costs</h2>
                            <ul className="list-disc list-inside space-y-2 text-neutral-600 ml-4">
                                <li><strong>Defective or Wrong Items:</strong> We cover return shipping costs</li>
                                <li><strong>Change of Mind:</strong> Customer is responsible for return shipping costs</li>
                                <li><strong>Exchanges:</strong> Free shipping on exchange orders</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-neutral-800 mb-3">Refund Processing</h2>
                            <p className="text-neutral-600 leading-relaxed mb-3">
                                Once we receive and inspect your return:
                            </p>
                            <ul className="list-disc list-inside space-y-2 text-neutral-600 ml-4">
                                <li>You'll receive an email confirmation of receipt</li>
                                <li>Refunds are processed within 5-7 business days</li>
                                <li>Refund will be credited to your original payment method</li>
                                <li>Bank processing may take an additional 5-10 business days</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-neutral-800 mb-3">Exchanges</h2>
                            <p className="text-neutral-600 leading-relaxed">
                                If you need to exchange an item for a different size or color, contact us at support@peckup.in. We'll arrange for a replacement to be sent once we receive your return. Exchanges are subject to product availability.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-neutral-800 mb-3">Damaged or Defective Items</h2>
                            <p className="text-neutral-600 leading-relaxed mb-3">
                                If you receive a damaged or defective item:
                            </p>
                            <ul className="list-disc list-inside space-y-2 text-neutral-600 ml-4">
                                <li>Contact us within 48 hours of delivery</li>
                                <li>Provide photos of the damaged/defective item</li>
                                <li>We'll arrange for a replacement or full refund</li>
                                <li>No return shipping costs for damaged/defective items</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-neutral-800 mb-3">Cancellations</h2>
                            <p className="text-neutral-600 leading-relaxed">
                                You can cancel your order within 24 hours of placement for a full refund. After 24 hours, if the order has been shipped, standard return procedures apply.
                            </p>
                        </section>

                        <section className="bg-primary-50 rounded-xl p-6">
                            <h2 className="text-2xl font-semibold text-neutral-800 mb-3">Questions?</h2>
                            <p className="text-neutral-600 leading-relaxed mb-3">
                                If you have any questions about our refund policy, please don't hesitate to contact us:
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
