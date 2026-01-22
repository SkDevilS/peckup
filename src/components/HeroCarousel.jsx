import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import products from '../data/products.json';

const HeroCarousel = () => {
    const [currentSlide, setCurrentSlide] = useState(0);

    // Get some product images for display
    const productImages = products.slice(0, 6).map(p => p.images?.[0] || 'https://images.unsplash.com/photo-1556912172-45b7abe8b7e4?w=200');

    const slides = [
        {
            id: 1,
            badge: 'New Collection',
            title: 'Premium Personal Care',
            description: 'Discover our curated selection of luxury skincare and beauty essentials',
            cta: 'Shop Now',
            link: '/category/personal-care',
        },
        {
            id: 2,
            badge: 'Best Sellers',
            title: 'Home Essentials',
            description: 'Everything you need to keep your home fresh and clean',
            cta: 'Explore',
            link: '/category/household-cleaning',
        },
        {
            id: 3,
            badge: 'Limited Offer',
            title: 'Up to 40% Off',
            description: 'Grab exclusive deals on your favorite products before they are gone',
            cta: 'View Deals',
            link: '/category/personal-care',
        },
    ];

    const nextSlide = useCallback(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, [slides.length]);

    useEffect(() => {
        const interval = setInterval(nextSlide, 4000);
        return () => clearInterval(interval);
    }, [nextSlide]);

    return (
        <div className="relative">
            {/* Main carousel container with blue gradient */}
            <div className="relative h-[320px] md:h-[380px] overflow-hidden rounded-3xl bg-gradient-to-br from-blue-50 via-indigo-50 to-violet-100 border border-blue-100 shadow-lg">
                {/* Subtle decorative gradient orbs */}
                <div className="absolute top-0 left-0 w-64 h-64 bg-gradient-to-br from-blue-200/30 to-indigo-200/30 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute bottom-0 right-0 w-72 h-72 bg-gradient-to-tl from-violet-200/40 to-blue-200/40 rounded-full blur-3xl translate-x-1/4 translate-y-1/4"></div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentSlide}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.4 }}
                        className="absolute inset-0 flex items-center"
                    >
                        <div className="flex w-full h-full">
                            {/* Left side - Content */}
                            <div className="flex-1 p-8 md:p-12 flex flex-col justify-center relative z-10">
                                <motion.span
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.1 }}
                                    className="inline-flex items-center gap-2 w-fit px-4 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 text-white mb-4 shadow-lg shadow-blue-500/30"
                                >
                                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                                    {slides[currentSlide].badge}
                                </motion.span>

                                <motion.h2
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="text-2xl md:text-4xl font-bold text-neutral-900 mb-3 leading-tight"
                                >
                                    {slides[currentSlide].title}
                                </motion.h2>

                                <motion.p
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className="text-neutral-600 text-sm md:text-base mb-6 max-w-md"
                                >
                                    {slides[currentSlide].description}
                                </motion.p>

                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.4 }}
                                >
                                    <Link
                                        to={slides[currentSlide].link}
                                        className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold px-6 py-3 rounded-xl transition-all hover:shadow-lg hover:shadow-blue-500/30 hover:-translate-y-0.5"
                                    >
                                        {slides[currentSlide].cta}
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                        </svg>
                                    </Link>
                                </motion.div>
                            </div>

                            {/* Right side - Product images in round structure */}
                            <div className="hidden md:flex flex-1 items-center justify-center relative">
                                {/* Center large circle */}
                                <motion.div
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ delay: 0.2 }}
                                    className="relative w-40 h-40 rounded-full bg-white shadow-xl border-4 border-blue-100 overflow-hidden z-10"
                                >
                                    <img
                                        src={productImages[currentSlide]}
                                        alt="Featured Product"
                                        className="w-full h-full object-contain p-3"
                                        onError={(e) => e.target.src = 'https://images.unsplash.com/photo-1556912172-45b7abe8b7e4?w=200'}
                                    />
                                </motion.div>

                                {/* Orbiting product circles */}
                                {[0, 1, 2, 3].map((i) => {
                                    const angle = (i * 90 + currentSlide * 30) * (Math.PI / 180);
                                    const radius = 110;
                                    const x = Math.cos(angle) * radius;
                                    const y = Math.sin(angle) * radius;

                                    return (
                                        <motion.div
                                            key={i}
                                            initial={{ scale: 0, opacity: 0 }}
                                            animate={{
                                                scale: 1,
                                                opacity: 1,
                                                x: x,
                                                y: y,
                                            }}
                                            transition={{ delay: 0.3 + i * 0.1, duration: 0.5 }}
                                            className="absolute w-16 h-16 rounded-full bg-white shadow-lg border-2 border-blue-50 overflow-hidden"
                                        >
                                            <img
                                                src={productImages[(currentSlide + i + 1) % productImages.length]}
                                                alt={`Product ${i + 1}`}
                                                className="w-full h-full object-contain p-1.5"
                                                onError={(e) => e.target.src = 'https://images.unsplash.com/photo-1556912172-45b7abe8b7e4?w=100'}
                                            />
                                        </motion.div>
                                    );
                                })}

                                {/* Decorative ring */}
                                <div className="absolute w-72 h-72 rounded-full border-2 border-dashed border-blue-200/50 animate-spin" style={{ animationDuration: '30s' }}></div>
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>

                {/* Navigation arrows */}
                <button
                    onClick={() => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)}
                    className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/90 shadow-lg text-neutral-600 flex items-center justify-center hover:bg-white hover:scale-105 transition-all z-20"
                >
                    <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <button
                    onClick={nextSlide}
                    className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/90 shadow-lg text-neutral-600 flex items-center justify-center hover:bg-white hover:scale-105 transition-all z-20"
                >
                    <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>

            {/* Slide indicators */}
            <div className="flex justify-center items-center gap-3 mt-6">
                {slides.map((slide, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className="relative group"
                    >
                        <div
                            className={`h-2 rounded-full transition-all duration-300 ${currentSlide === index
                                ? 'w-10 bg-gradient-to-r from-blue-600 to-indigo-600'
                                : 'w-2 bg-neutral-300 hover:bg-neutral-400'
                                }`}
                        />
                    </button>
                ))}
            </div>
        </div>
    );
};

export default HeroCarousel;
