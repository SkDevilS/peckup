import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function FAQPage() {
    const [openIndex, setOpenIndex] = useState(null);

    const faqs = [
        {
            question: "How do I place an order?",
            answer: "Browse our products, add items to your cart, and proceed to checkout. You'll need to create an account or log in to complete your purchase."
        },
        {
            question: "What payment methods do you accept?",
            answer: "We accept all major credit/debit cards, UPI, net banking, and cash on delivery (COD) for eligible orders."
        },
        {
            question: "How long does shipping take?",
            answer: "Standard shipping typically takes 5-7 business days. Express shipping options are available at checkout for faster delivery."
        },
        {
            question: "Can I track my order?",
            answer: "Yes! Once your order ships, you'll receive a tracking number via email. You can also track your order from your account dashboard."
        },
        {
            question: "What is your return policy?",
            answer: "We offer a 30-day return policy for most items. Products must be unused and in original packaging. See our Refund Policy page for complete details."
        },
        {
            question: "Do you ship internationally?",
            answer: "Currently, we only ship within India. International shipping may be available in the future."
        },
        {
            question: "How do I cancel my order?",
            answer: "You can cancel your order within 24 hours of placement from your account dashboard. After that, please contact our support team."
        },
        {
            question: "Are the products genuine?",
            answer: "Yes, all products sold on Peckup are 100% genuine and sourced directly from authorized distributors and brands."
        },
        {
            question: "How do I contact customer support?",
            answer: "You can reach us at support@peckup.in or visit our Contact Us page. We respond to all inquiries within 24 hours."
        },
        {
            question: "Can I change my shipping address?",
            answer: "Yes, you can change your shipping address before the order is shipped. Contact us immediately at support@peckup.in with your order number."
        }
    ];

    return (
        <div className="min-h-screen bg-neutral-50 py-12">
            <div className="container mx-auto px-4 max-w-4xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl shadow-lg p-8 md:p-12"
                >
                    <h1 className="text-3xl md:text-4xl font-bold text-neutral-800 mb-4">Frequently Asked Questions</h1>
                    <p className="text-neutral-600 mb-8">Find answers to common questions about shopping with Peckup</p>

                    <div className="space-y-4">
                        {faqs.map((faq, index) => (
                            <div key={index} className="border border-neutral-200 rounded-xl overflow-hidden">
                                <button
                                    onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                    className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-neutral-50 transition-colors"
                                >
                                    <span className="font-semibold text-neutral-800 pr-4">{faq.question}</span>
                                    <svg
                                        className={`w-5 h-5 text-neutral-600 flex-shrink-0 transition-transform ${openIndex === index ? 'rotate-180' : ''}`}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>
                                <AnimatePresence>
                                    {openIndex === index && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.2 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="px-6 pb-4 text-neutral-600">
                                                {faq.answer}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ))}
                    </div>

                    <div className="mt-12 bg-primary-50 rounded-xl p-6 text-center">
                        <h3 className="text-lg font-semibold text-neutral-800 mb-2">Still have questions?</h3>
                        <p className="text-neutral-600 mb-4">Our support team is here to help!</p>
                        <a href="mailto:support@peckup.in" className="btn-primary inline-block">Contact Support</a>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
