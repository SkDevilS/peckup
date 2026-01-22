import { motion } from 'framer-motion';

export default function ContactPage() {
    return (
        <div className="min-h-screen bg-neutral-50 py-12">
            <div className="container mx-auto px-4 max-w-4xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl shadow-lg p-8 md:p-12"
                >
                    <h1 className="text-3xl md:text-4xl font-bold text-neutral-800 mb-6">Contact Us</h1>
                    
                    <div className="space-y-8">
                        <div>
                            <h2 className="text-xl font-semibold text-neutral-800 mb-4">Get in Touch</h2>
                            <p className="text-neutral-600 mb-6">
                                We're here to help! If you have any questions, concerns, or feedback, please don't hesitate to reach out to us.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="bg-neutral-50 rounded-xl p-6">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                                        <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-lg font-semibold text-neutral-800">Email</h3>
                                </div>
                                <a href="mailto:support@peckup.in" className="text-primary-600 hover:text-primary-700 font-medium">
                                    support@peckup.in
                                </a>
                            </div>

                            <div className="bg-neutral-50 rounded-xl p-6">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                                        <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                        </svg>
                                    </div>
                                    <h3 className="text-lg font-semibold text-neutral-800">Company</h3>
                                </div>
                                <p className="text-neutral-600 font-medium">Peckup Private Limited</p>
                            </div>
                        </div>

                        <div>
                            <h2 className="text-xl font-semibold text-neutral-800 mb-4">Business Hours</h2>
                            <div className="bg-neutral-50 rounded-xl p-6">
                                <div className="space-y-2 text-neutral-600">
                                    <p><span className="font-medium">Monday - Friday:</span> 9:00 AM - 6:00 PM</p>
                                    <p><span className="font-medium">Saturday:</span> 10:00 AM - 4:00 PM</p>
                                    <p><span className="font-medium">Sunday:</span> Closed</p>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h2 className="text-xl font-semibold text-neutral-800 mb-4">Send us a Message</h2>
                            <form className="space-y-4">
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-neutral-700 mb-2">Name</label>
                                        <input type="text" className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none" placeholder="Your name" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-neutral-700 mb-2">Email</label>
                                        <input type="email" className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none" placeholder="your@email.com" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-neutral-700 mb-2">Subject</label>
                                    <input type="text" className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none" placeholder="How can we help?" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-neutral-700 mb-2">Message</label>
                                    <textarea rows="5" className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none" placeholder="Your message..."></textarea>
                                </div>
                                <button type="submit" className="btn-primary w-full md:w-auto px-8">Send Message</button>
                            </form>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
