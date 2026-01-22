import ProductCard from './ProductCard';

const ProductGrid = ({ products, loading }) => {
    if (loading) {
        return (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {[...Array(8)].map((_, i) => (
                    <div key={i} className="bg-white rounded-2xl shadow-md overflow-hidden animate-pulse">
                        <div className="aspect-square bg-neutral-100"></div>
                        <div className="p-4 space-y-3">
                            <div className="h-4 bg-neutral-100 rounded-full w-3/4"></div>
                            <div className="h-4 bg-neutral-100 rounded-full w-1/2"></div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (!products || products.length === 0) {
        return (
            <div className="text-center py-16">
                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-neutral-100 flex items-center justify-center">
                    <svg className="w-10 h-10 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                </div>
                <h3 className="text-xl font-semibold text-neutral-800 mb-2">No products found</h3>
                <p className="text-neutral-500">Try adjusting your filters or search terms.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products.map((product) => (
                <ProductCard key={product.id} product={product} />
            ))}
        </div>
    );
};

export default ProductGrid;
