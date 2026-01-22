import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductGrid from '../components/ProductGrid';
import HeroCarousel from '../components/HeroCarousel';
import { motion } from 'framer-motion';
import { api } from '../utils/api';

const Home = () => {
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchHomeData = async () => {
            setLoading(true);
            try {
                const [productsData, sectionsData] = await Promise.all([
                    api.getFeaturedProducts(8),
                    api.getSections()
                ]);

                setFeaturedProducts(productsData.products);

                // Transform sections to match category format for grid
                // Assuming we want to show dynamic sections or map them
                // For now, let's map the sections directly, maybe adding placeholder images if missing
                const mappedCategories = sectionsData.map(section => ({
                    name: section.name,
                    slug: section.slug,
                    image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&q=80', // Default or fetch from section if available
                    count: 0 // Backend doesn't return count yet, maybe ignore or 0
                }));
                setCategories(mappedCategories);

            } catch (error) {
                console.error('Failed to fetch home data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchHomeData();
    }, []);

    const features = [
        {
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
            ),
            title: 'Free Shipping',
            desc: 'Orders over ₹999',
            color: 'bg-blue-50 text-blue-600',
        },
        {
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
            ),
            title: 'Secure Payment',
            desc: '100% Protected',
            color: 'bg-green-50 text-green-600',
        },
        {
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
            ),
            title: 'Easy Returns',
            desc: '7 Days Return',
            color: 'bg-orange-50 text-orange-600',
        },
        {
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
            ),
            title: '24/7 Support',
            desc: "We're here to help",
            color: 'bg-purple-50 text-purple-600',
        },
    ];



    return (
        <div className="min-h-screen bg-neutral-50">
            {/* Hero Carousel */}
            <section className="container mx-auto px-4 py-6 md:py-8">
                <HeroCarousel />
            </section>

            {/* Features Bar with SVG Icons */}
            <section className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {features.map((feature) => (
                        <div
                            key={feature.title}
                            className="flex items-center gap-4 bg-white rounded-2xl p-4 border border-neutral-100 hover:shadow-md transition-shadow"
                        >
                            <div className={`w-12 h-12 rounded-xl ${feature.color} flex items-center justify-center`}>
                                {feature.icon}
                            </div>
                            <div>
                                <h4 className="font-semibold text-neutral-800 text-sm">{feature.title}</h4>
                                <p className="text-neutral-500 text-xs">{feature.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Categories - New Grid Style */}
            <section className="container mx-auto px-4 py-12 md:py-16">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-2xl md:text-3xl font-bold text-neutral-900">Shop by Category</h2>
                        <p className="text-neutral-500 mt-1">Browse our wide selection of products</p>
                    </div>
                    <Link to="/category/personal-care" className="hidden md:flex items-center gap-2 text-blue-600 font-medium hover:text-blue-700">
                        View All
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {categories.map((category, index) => (
                        <motion.div
                            key={category.slug}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                            <Link
                                to={`/category/${category.slug}`}
                                className="group relative block h-52 rounded-2xl overflow-hidden bg-neutral-100"
                            >
                                {/* Image */}
                                <img
                                    src={category.image}
                                    alt={category.name}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />

                                {/* Gradient overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/80 via-neutral-900/20 to-transparent"></div>

                                {/* Content */}
                                <div className="absolute bottom-0 left-0 right-0 p-5">
                                    <div className="flex items-end justify-between">
                                        <div>
                                            <h3 className="text-xl font-bold text-white mb-1">{category.name}</h3>
                                            <p className="text-white/70 text-sm">{category.count} Products</p>
                                        </div>
                                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-neutral-800 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Featured Products */}
            <section className="bg-white py-12 md:py-16 border-y border-neutral-100">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-10">
                        <div>
                            <h2 className="text-2xl md:text-3xl font-bold text-neutral-900">🔥 Hot Deals</h2>
                            <p className="text-neutral-500 mt-1">Limited time offers you don't want to miss</p>
                        </div>
                        <Link to="/category/personal-care" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors">
                            View All
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </Link>
                    </div>
                    <ProductGrid products={featuredProducts} loading={loading} />
                </div>
            </section>

            {/* Promo Banner */}
            <section className="container mx-auto px-4 py-12 md:py-16">
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-600 p-8 md:p-16">
                    <div className="absolute top-0 right-0 w-1/2 h-full opacity-10">
                        <svg viewBox="0 0 200 200" className="w-full h-full">
                            <circle cx="100" cy="100" r="80" fill="white" />
                            <circle cx="160" cy="40" r="40" fill="white" />
                        </svg>
                    </div>
                    <div className="relative max-w-xl">
                        <span className="inline-block px-4 py-1 bg-white/20 rounded-full text-white text-sm font-medium mb-4">
                            Limited Time Offer
                        </span>
                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
                            Get 20% Off Your First Order!
                        </h2>
                        <p className="text-white/90 text-lg mb-8">
                            Sign up today and enjoy exclusive discounts on premium products.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="flex-1 px-6 py-4 rounded-xl bg-white text-neutral-800 placeholder-neutral-400 focus:outline-none focus:ring-4 focus:ring-white/30"
                            />
                            <button className="px-8 py-4 bg-neutral-900 text-white font-semibold rounded-xl hover:bg-neutral-800 transition-colors shadow-lg">
                                Subscribe
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="container mx-auto px-4 py-12 md:py-16">
                <div className="text-center mb-10">
                    <h2 className="text-2xl md:text-3xl font-bold text-neutral-900">What Our Customers Say</h2>
                    <p className="text-neutral-500 mt-1">Trusted by thousands of happy shoppers</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        { name: 'Priya S.', avatar: 'PS', text: 'Amazing quality products and super fast delivery. Will definitely order again!', rating: 5 },
                        { name: 'Rahul M.', avatar: 'RM', text: 'Great prices and excellent customer service. Highly recommend Peckup!', rating: 5 },
                        { name: 'Sneha K.', avatar: 'SK', text: 'Love the variety of products. My go-to store for all household needs.', rating: 5 },
                    ].map((testimonial, index) => (
                        <motion.div
                            key={testimonial.name}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white rounded-2xl p-6 shadow-md border border-neutral-100"
                        >
                            <div className="flex items-center gap-1 mb-4">
                                {[...Array(testimonial.rating)].map((_, i) => (
                                    <svg key={i} className="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                ))}
                            </div>
                            <p className="text-neutral-600 mb-4">"{testimonial.text}"</p>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-white text-sm font-semibold">
                                    {testimonial.avatar}
                                </div>
                                <span className="font-medium text-neutral-800">{testimonial.name}</span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default Home;
