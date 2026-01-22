import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ProductGrid from '../components/ProductGrid';
import { motion } from 'framer-motion';
import { api } from '../utils/api';

const CategoryPage = () => {
    const { slug } = useParams();
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sortBy, setSortBy] = useState('default');
    const [priceRange, setPriceRange] = useState('all');

    const [category, setCategory] = useState({
        name: 'Products',
        description: 'Browse our products',
        bgColor: 'bg-gradient-to-r from-primary-100 to-primary-50',
    });

    useEffect(() => {
        const fetchCategoryProducts = async () => {
            setLoading(true);
            try {
                // Prepare filters
                // Backend supports: page, per_page.
                // For sorting and price filtering, we might need to do client-side OR update backend.
                // Current backend only supports 'section' filter on get_products, OR get_products_by_category.
                // get_products_by_category returns products and section info.

                const response = await api.getProductsByCategory(slug, {
                    // We can pass page/per_page here if we want pagination
                });

                let fetchedProducts = response.products || [];
                const sectionData = response.section;

                if (sectionData) {
                    setCategory({
                        name: sectionData.name,
                        description: sectionData.description || 'Browse our products',
                        bgColor: 'bg-gradient-to-r from-primary-100 to-primary-50', // We can map slugs to colors if needed, or keep generic
                    });
                } else {
                    setCategory({
                        name: 'Products',
                        description: 'Browse our products',
                        bgColor: 'bg-gradient-to-r from-primary-100 to-primary-50',
                    });
                }

                // Client-side filtering/sorting for now since backend relies on basics
                if (priceRange !== 'all') {
                    const [min, max] = priceRange.split('-').map(Number);
                    fetchedProducts = fetchedProducts.filter(p => {
                        const price = p.price || 0;
                        if (max) return price >= min && price <= max;
                        return price >= min;
                    });
                }

                switch (sortBy) {
                    case 'price-low':
                        fetchedProducts.sort((a, b) => a.price - b.price);
                        break;
                    case 'price-high':
                        fetchedProducts.sort((a, b) => b.price - a.price);
                        break;
                    case 'name':
                        fetchedProducts.sort((a, b) => a.title.localeCompare(b.title));
                        break;
                    default:
                        break;
                }

                setFilteredProducts(fetchedProducts);

            } catch (error) {
                console.error('Failed to fetch category products:', error);
                setFilteredProducts([]);
            } finally {
                setLoading(false);
            }
        };

        fetchCategoryProducts();
    }, [slug, sortBy, priceRange]);

    return (
        <div className="min-h-screen bg-neutral-50">
            {/* Hero Banner - Light Mode */}
            <div className={`${category.bgColor} py-12 md:py-16`}>
                <div className="container mx-auto px-4">
                    <div className="flex items-center gap-2 text-neutral-500 text-sm mb-4">
                        <Link to="/" className="hover:text-primary-600 transition-colors">Home</Link>
                        <span>/</span>
                        <span className="text-neutral-800 font-medium">{category.name}</span>
                    </div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-3xl md:text-4xl font-bold text-neutral-900"
                    >
                        {category.name}
                    </motion.h1>
                    <p className="text-neutral-600 mt-2">{category.description}</p>
                </div>
            </div>

            {/* Filters & Products */}
            <div className="container mx-auto px-4 py-8 md:py-12">
                {/* Filter Bar */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 p-4 bg-white rounded-xl shadow-md border border-neutral-100">
                    <p className="text-neutral-600">
                        <span className="font-semibold text-neutral-800">{filteredProducts.length}</span> products found
                    </p>

                    <div className="flex flex-wrap items-center gap-4">
                        <select
                            value={priceRange}
                            onChange={(e) => setPriceRange(e.target.value)}
                            className="bg-neutral-50 border border-neutral-200 rounded-lg px-4 py-2 text-neutral-700 text-sm focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
                        >
                            <option value="all">All Prices</option>
                            <option value="0-500">Under ₹500</option>
                            <option value="500-1000">₹500 - ₹1000</option>
                            <option value="1000-5000">₹1000 - ₹5000</option>
                            <option value="5000-">Above ₹5000</option>
                        </select>

                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="bg-neutral-50 border border-neutral-200 rounded-lg px-4 py-2 text-neutral-700 text-sm focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
                        >
                            <option value="default">Sort by: Default</option>
                            <option value="price-low">Price: Low to High</option>
                            <option value="price-high">Price: High to Low</option>
                            <option value="name">Name: A-Z</option>
                        </select>
                    </div>
                </div>

                <ProductGrid products={filteredProducts} loading={loading} />
            </div>
        </div>
    );
};

export default CategoryPage;
