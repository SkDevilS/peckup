import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { adminApi } from '../../utils/adminApi';
import BulkUploadModal from '../../components/admin/BulkUploadModal';
import ProductModal from '../../components/admin/ProductModal';

export default function ProductManagement() {
    const [products, setProducts] = useState({ items: [], total: 0, pages: 0, current_page: 1 });
    const [sections, setSections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [filters, setFilters] = useState({ page: 1, search: '', section_id: '', status: 'all' });
    const [showProductModal, setShowProductModal] = useState(false);
    const [showBulkUploadModal, setShowBulkUploadModal] = useState(false);
    const [viewMode, setViewMode] = useState('list'); // 'grid' or 'list'

    useEffect(() => {
        fetchData();
    }, [filters]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [productsResponse, sectionsResponse] = await Promise.all([
                adminApi.getProducts({
                    page: filters.page,
                    per_page: 20,
                    section_id: filters.section_id,
                    search: filters.search
                }),
                adminApi.getSections()
            ]);
            
            if (productsResponse.success && productsResponse.data) {
                setProducts({
                    items: productsResponse.data.products || [],
                    total: productsResponse.data.total || 0,
                    pages: productsResponse.data.pages || 0,
                    current_page: productsResponse.data.current_page || 1
                });
            }
            
            if (sectionsResponse.success && sectionsResponse.data) {
                setSections(sectionsResponse.data.sections || []);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (productId, productTitle) => {
        if (!confirm(`Are you sure you want to delete "${productTitle}"? This action cannot be undone.`)) return;
        
        try {
            const response = await adminApi.deleteProduct(productId);
            if (response.success) {
                fetchData();
                alert('Product deleted successfully!');
            } else {
                alert('Failed to delete product: ' + response.error);
            }
        } catch (error) {
            alert('Failed to delete product');
        }
    };

    const toggleProductStatus = async (productId) => {
        try {
            const response = await adminApi.toggleProductStatus(productId);
            if (response.success) {
                fetchData();
            }
        } catch (error) {
            alert('Failed to toggle product status');
        }
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(price);
    };

    const filteredProducts = products.items.filter(product => {
        if (filters.status === 'active') return product.is_active;
        if (filters.status === 'inactive') return !product.is_active;
        return true;
    });

    return (
        <div className="space-y-6">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Product Management</h1>
                    <p className="text-sm text-gray-600 mt-1">Manage your product catalog and inventory</p>
                </div>
                <div className="flex items-center gap-3">
                    <button onClick={() => setShowBulkUploadModal(true)} className="px-4 py-2 bg-white border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium inline-flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                        Bulk Upload
                    </button>
                    <button onClick={() => { setSelectedProduct(null); setShowProductModal(true); }} className="px-4 py-2 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors font-medium inline-flex items-center gap-2 shadow-lg hover:shadow-xl">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                        Add Product
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl border border-gray-200 p-4">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                        <input type="text" placeholder="Search products by SKU, title, or description..." value={filters.search} onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value, page: 1 }))} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none" />
                    </div>
                    <select value={filters.section_id} onChange={(e) => setFilters(prev => ({ ...prev, section_id: e.target.value, page: 1 }))} className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none">
                        <option value="">All Sections</option>
                        {sections.map(section => (<option key={section.id} value={section.id}>{section.name}</option>))}
                    </select>
                    <select value={filters.status} onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value, page: 1 }))} className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none">
                        <option value="all">All Status</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
                    <div className="flex items-center gap-2 border border-gray-300 rounded-lg p-1">
                        <button onClick={() => setViewMode('grid')} className={`p-2 rounded ${viewMode === 'grid' ? 'bg-orange-100 text-orange-600' : 'text-gray-600 hover:bg-gray-100'}`}>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
                        </button>
                        <button onClick={() => setViewMode('list')} className={`p-2 rounded ${viewMode === 'list' ? 'bg-orange-100 text-orange-600' : 'text-gray-600 hover:bg-gray-100'}`}>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl border border-gray-200 p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Total Products</p>
                            <p className="text-2xl font-bold text-gray-900 mt-1">{products.total}</p>
                        </div>
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Active Products</p>
                            <p className="text-2xl font-bold text-green-600 mt-1">{products.items.filter(p => p.is_active).length}</p>
                        </div>
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Low Stock</p>
                            <p className="text-2xl font-bold text-yellow-600 mt-1">{products.items.filter(p => p.stock > 0 && p.stock <= 10).length}</p>
                        </div>
                        <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                            <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Out of Stock</p>
                            <p className="text-2xl font-bold text-red-600 mt-1">{products.items.filter(p => p.stock === 0).length}</p>
                        </div>
                        <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </div>
                    </div>
                </div>
            </div>

            {/* Products Display */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mb-4"></div>
                    <p className="text-gray-600">Loading products...</p>
                </div>
            ) : filteredProducts.length === 0 ? (
                <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" /></svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No products found</h3>
                    <p className="text-gray-600 mb-6">Get started by adding your first product or try adjusting your filters.</p>
                    <button onClick={() => { setSelectedProduct(null); setShowProductModal(true); }} className="px-6 py-2 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors font-medium inline-flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                        Add Your First Product
                    </button>
                </div>
            ) : viewMode === 'grid' ? (
                <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredProducts.map((product) => (
                        <motion.div key={product.id} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all group">
                            <div className="relative aspect-square bg-gray-100">
                                {product.images && product.images.length > 0 ? (
                                    <img src={product.images[0]} alt={product.title} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <svg className="w-16 h-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                    </div>
                                )}
                                <div className="absolute top-2 right-2 flex gap-2">
                                    {product.is_on_sale && <span className="px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-full">SALE</span>}
                                    <span className={`px-2 py-1 text-xs font-bold rounded-full ${product.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>{product.is_active ? 'Active' : 'Inactive'}</span>
                                </div>
                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                                    <button onClick={() => { setSelectedProduct(product); setShowProductModal(true); }} className="p-2 bg-white rounded-lg hover:bg-gray-100 transition-colors" title="Edit">
                                        <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                    </button>
                                    <button onClick={() => toggleProductStatus(product.id)} className="p-2 bg-white rounded-lg hover:bg-gray-100 transition-colors" title={product.is_active ? 'Deactivate' : 'Activate'}>
                                        <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
                                    </button>
                                    <button onClick={() => handleDelete(product.id, product.title)} className="p-2 bg-white rounded-lg hover:bg-red-50 transition-colors" title="Delete">
                                        <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                    </button>
                                </div>
                            </div>
                            <div className="p-4">
                                <div className="flex items-start justify-between gap-2 mb-2">
                                    <h3 className="font-semibold text-gray-900 line-clamp-2 flex-1">{product.title}</h3>
                                </div>
                                <p className="text-xs text-gray-500 mb-3">SKU: {product.sku}</p>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-lg font-bold text-orange-600">{formatPrice(product.price)}</p>
                                        {product.original_price && product.is_on_sale && <p className="text-sm text-gray-400 line-through">{formatPrice(product.original_price)}</p>}
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-gray-500">Stock</p>
                                        <p className={`text-sm font-bold ${product.stock > 10 ? 'text-green-600' : product.stock > 0 ? 'text-yellow-600' : 'text-red-600'}`}>{product.stock}</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            ) : (
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredProducts.map((product) => (
                                <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-lg bg-gray-100 flex-shrink-0 overflow-hidden">
                                                {product.images && product.images.length > 0 ? (
                                                    <img src={product.images[0]} alt={product.title} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="max-w-xs">
                                                <p className="font-medium text-gray-900 truncate">{product.title}</p>
                                                <p className="text-sm text-gray-500 truncate">{product.description}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.sku}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{sections.find(s => s.id === product.section_id)?.name || 'N/A'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <p className="text-sm font-semibold text-gray-900">{formatPrice(product.price)}</p>
                                        {product.original_price && product.is_on_sale && <p className="text-xs text-gray-400 line-through">{formatPrice(product.original_price)}</p>}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${product.stock > 10 ? 'bg-green-100 text-green-800' : product.stock > 0 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>{product.stock}</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <button onClick={() => toggleProductStatus(product.id)} className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${product.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>{product.is_active ? 'Active' : 'Inactive'}</button>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex items-center gap-2">
                                            <button onClick={() => { setSelectedProduct(product); setShowProductModal(true); }} className="text-blue-600 hover:text-blue-900">Edit</button>
                                            <button onClick={() => handleDelete(product.id, product.title)} className="text-red-600 hover:text-red-900">Delete</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Pagination */}
            {products.pages > 1 && (
                <div className="flex items-center justify-between bg-white rounded-xl border border-gray-200 px-6 py-4">
                    <div className="text-sm text-gray-600">
                        Showing <span className="font-medium">{((products.current_page - 1) * 20) + 1}</span> to <span className="font-medium">{Math.min(products.current_page * 20, products.total)}</span> of <span className="font-medium">{products.total}</span> products
                    </div>
                    <div className="flex items-center gap-2">
                        <button onClick={() => setFilters(prev => ({ ...prev, page: prev.page - 1 }))} disabled={products.current_page === 1} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">Previous</button>
                        <div className="flex items-center gap-1">
                            {[...Array(Math.min(5, products.pages))].map((_, i) => {
                                const page = i + 1;
                                return (
                                    <button key={page} onClick={() => setFilters(prev => ({ ...prev, page }))} className={`w-10 h-10 rounded-lg font-medium transition-colors ${products.current_page === page ? 'bg-orange-500 text-white' : 'text-gray-700 hover:bg-gray-100'}`}>{page}</button>
                                );
                            })}
                            {products.pages > 5 && <span className="px-2 text-gray-500">...</span>}
                        </div>
                        <button onClick={() => setFilters(prev => ({ ...prev, page: prev.page + 1 }))} disabled={products.current_page === products.pages} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">Next</button>
                    </div>
                </div>
            )}

            {/* Modals */}
            <BulkUploadModal isOpen={showBulkUploadModal} onClose={() => setShowBulkUploadModal(false)} onSuccess={() => fetchData()} />
            
            {showProductModal && (
                <ProductModal product={selectedProduct} sections={sections} onClose={() => { setShowProductModal(false); setSelectedProduct(null); }} onSuccess={() => { fetchData(); setShowProductModal(false); setSelectedProduct(null); }} />
            )}
        </div>
    );
}
