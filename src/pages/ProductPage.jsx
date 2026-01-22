import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useCartStore } from '../stores/cartStore';
import { useWishlistStore } from '../stores/wishlistStore';
import { useToast } from '../stores/toastStore';
import { formatPrice } from '../utils/priceFormatter';
import ProductGrid from '../components/ProductGrid';
import { motion } from 'framer-motion';
import { api } from '../utils/api';

const ProductPage = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [selectedSize, setSelectedSize] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const addItem = useCartStore((state) => state.addItem);
    const addToWishlist = useWishlistStore((state) => state.addItem);
    const isInWishlist = useWishlistStore((state) =>
        product ? state.isInWishlist(product.id) : false
    );
    const { showSuccess } = useToast();

    useEffect(() => {
        const fetchProductData = async () => {
            setLoading(true);
            try {
                const response = await api.getProductBySlug(slug);
                if (response.product) {
                    const productData = response.product;
                    // Parse JSON fields if they are strings (images, sizes, colors)
                    // The backend might send them as strings if they are stored as JSON strings in DB and to_dict() doesn't parse them?
                    // Let's check backend `product.to_dict()`
                    // Product models usually do `json.loads` if configured, or we should handle it.
                    // Assuming to_dict returns appropriate arrays or strings.

                    // Backend `to_dict`:
                    /*
                    def to_dict(self):
                        return {
                            ...
                            'images': json.loads(self.images) if self.images else [],
                            'sizes': json.loads(self.sizes) if self.sizes else [],
                            'colors': json.loads(self.colors) if self.colors else [],
                            ...
                        }
                    */
                    // So they are arrays.

                    setProduct(productData);
                    setSelectedSize(productData.sizes?.[0] || null);

                    // Fetch relatedproducts
                    if (productData.category || productData.section_id) {
                        // We can fetch by category. `productData.section` might be available if I join?
                        // The API `getProductBySlug` just calls `product.to_dict()`.
                        // Product model has `stock`, `price`, etc.
                        // But `category` field in legacy frontend code was a slug.
                        // In backend, `section` relationship exists. `to_dict` might include `section_slug`?
                        // Let's assume we can fetch related by category slug if we have it.
                        // Or just fetch some products.
                        try {
                            // Assuming productData has section info or I can fetch generic products
                            const relatedRes = await api.getProducts({ limit: 4 });
                            // Ideally we filter by category, but for now just show some.
                            setRelatedProducts(relatedRes.products.filter(p => p.id !== productData.id).slice(0, 4));
                        } catch (err) {
                            console.warn("Failed to fetch related products", err);
                        }
                    }
                }
            } catch (error) {
                console.error('Failed to fetch product:', error);
                setProduct(null);
            } finally {
                setLoading(false);
                window.scrollTo(0, 0);
            }
        };

        if (slug) {
            fetchProductData();
        }
    }, [slug]);

    const handleAddToCart = () => {
        if (product && product.stock > 0) {
            addItem(product, quantity, selectedSize);
            showSuccess('Added to cart!');
        }
    };

    const handleAddToWishlist = () => {
        if (product) {
            addToWishlist(product);
            showSuccess('Added to wishlist!');
        }
    };

    const handleBuyNow = () => {
        if (product && product.stock > 0) {
            addItem(product, quantity, selectedSize);
            navigate('/checkout');
        }
    };

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-16 bg-neutral-50">
                <div className="animate-pulse grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <div className="aspect-square rounded-2xl bg-neutral-200"></div>
                    <div className="space-y-4">
                        <div className="h-8 bg-neutral-200 rounded w-3/4"></div>
                        <div className="h-6 bg-neutral-200 rounded w-1/2"></div>
                        <div className="h-32 bg-neutral-200 rounded"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="container mx-auto px-4 py-16 text-center bg-neutral-50">
                <h1 className="text-2xl font-bold text-neutral-800 mb-4">Product Not Found</h1>
                <Link to="/" className="btn-primary">Go Home</Link>
            </div>
        );
    }

    const discountPercentage = product.original_price
        ? Math.round((1 - product.price / product.original_price) * 100)
        : 0;

    return (
        <div className="min-h-screen bg-neutral-50">
            <div className="container mx-auto px-4 py-8 md:py-12">
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-sm text-neutral-500 mb-8">
                    <Link to="/" className="hover:text-primary-600 transition-colors">Home</Link>
                    <span>/</span>
                    <Link to={`/category/${product.category}`} className="hover:text-primary-600 transition-colors capitalize">
                        {product.category.replace('-', ' ')}
                    </Link>
                    <span>/</span>
                    <span className="text-neutral-800 truncate max-w-[200px]">{product.title}</span>
                </div>

                {/* Product Details */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-16">
                    {/* Images */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="relative aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-neutral-100 to-white shadow-md border border-neutral-100 mb-4">
                            <img
                                src={product.images?.[selectedImage] || 'https://images.unsplash.com/photo-1556912172-45b7abe8b7e4?w=800'}
                                alt={product.title}
                                className="w-full h-full object-contain p-4"
                                onError={(e) => {
                                    e.target.src = 'https://images.unsplash.com/photo-1556912172-45b7abe8b7e4?w=800';
                                }}
                            />
                            {product.is_on_sale && discountPercentage > 0 && (
                                <span className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-lg text-sm font-bold">-{discountPercentage}%</span>
                            )}
                        </div>
                        {product.images && product.images.length > 1 && (
                            <div className="flex gap-3">
                                {product.images.map((img, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedImage(index)}
                                        className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all bg-white ${selectedImage === index
                                            ? 'border-primary-500 shadow-md'
                                            : 'border-neutral-200 hover:border-neutral-300'
                                            }`}
                                    >
                                        <img src={img} alt={`${product.title} ${index + 1}`} className="w-full h-full object-contain p-1" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </motion.div>

                    {/* Info */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        className="bg-white rounded-2xl p-6 md:p-8 shadow-md border border-neutral-100"
                    >
                        {/* Category Tag */}
                        <span className="inline-block text-xs text-primary-600 font-semibold uppercase tracking-wide mb-2">
                            {product.category?.replace('-', ' ')}
                        </span>

                        <h1 className="text-2xl md:text-3xl font-bold text-neutral-800 mb-4">{product.title}</h1>

                        <div className="flex items-center gap-4 mb-6">
                            <span className="text-3xl font-bold text-primary-600">{formatPrice(product.price)}</span>
                            {product.is_on_sale && product.original_price && (
                                <span className="text-xl text-neutral-400 line-through">{formatPrice(product.original_price)}</span>
                            )}
                        </div>

                        <p className="text-neutral-600 mb-8 leading-relaxed">{product.description}</p>

                        {product.sizes && product.sizes.length > 0 && (
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-neutral-700 mb-3">Size</label>
                                <div className="flex flex-wrap gap-3">
                                    {product.sizes.map((size) => (
                                        <button
                                            key={size}
                                            onClick={() => setSelectedSize(size)}
                                            className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${selectedSize === size
                                                ? 'bg-primary-50 border-primary-500 text-primary-700'
                                                : 'border-neutral-200 text-neutral-600 hover:border-neutral-300'
                                                }`}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="mb-8">
                            <label className="block text-sm font-medium text-neutral-700 mb-3">Quantity</label>
                            <div className="flex items-center bg-neutral-100 rounded-xl w-fit">
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="px-4 py-3 text-neutral-600 hover:text-neutral-800 transition-colors"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                                    </svg>
                                </button>
                                <span className="w-12 text-center font-semibold text-neutral-800">{quantity}</span>
                                <button
                                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                                    className="px-4 py-3 text-neutral-600 hover:text-neutral-800 transition-colors"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        <div className="flex flex-col gap-4">
                            <div className="flex gap-3">
                                <button
                                    onClick={handleAddToCart}
                                    disabled={product.stock === 0}
                                    className={`flex-1 py-4 rounded-xl font-semibold text-lg transition-all flex items-center justify-center gap-2 ${product.stock === 0 ? 'bg-neutral-200 text-neutral-500 cursor-not-allowed' : 'bg-white border-2 border-primary-500 text-primary-600 hover:bg-primary-50'
                                        }`}
                                >
                                    {product.stock === 0 ? 'Out of Stock' : (
                                        <>
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                            </svg>
                                            <span className="hidden sm:inline">Add to Cart</span>
                                            <span className="sm:hidden">Add</span>
                                        </>
                                    )}
                                </button>
                                <button
                                    onClick={handleAddToWishlist}
                                    className={`w-14 h-14 sm:w-auto sm:px-6 sm:py-4 rounded-xl border-2 transition-all flex items-center justify-center ${isInWishlist
                                        ? 'bg-red-50 border-red-200 text-red-500'
                                        : 'border-neutral-200 text-neutral-600 hover:border-neutral-300'
                                        }`}
                                >                                >
                                    <svg
                                        className={`w-6 h-6 ${isInWishlist ? 'fill-current' : ''}`}
                                        fill={isInWishlist ? 'currentColor' : 'none'}
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                    </svg>
                                </button>
                            </div>
                            <button
                                onClick={handleBuyNow}
                                disabled={product.stock === 0}
                                className={`w-full py-4 rounded-xl font-semibold text-lg transition-all flex items-center justify-center gap-2 ${product.stock === 0 ? 'bg-neutral-200 text-neutral-500 cursor-not-allowed' : 'btn-primary shadow-lg hover:shadow-xl'
                                    }`}
                            >
                                {product.stock === 0 ? 'Out of Stock' : (
                                    <>
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                        </svg>
                                        Buy Now
                                    </>
                                )}
                            </button>
                        </div>
                    </motion.div>
                </div>

                {relatedProducts.length > 0 && (
                    <section className="bg-white rounded-2xl p-6 md:p-8 shadow-md border border-neutral-100">
                        <h2 className="text-2xl font-bold text-neutral-800 mb-8">You May Also Like</h2>
                        <ProductGrid products={relatedProducts} loading={false} />
                    </section>
                )}
            </div>
        </div>
    );
};

export default ProductPage;
