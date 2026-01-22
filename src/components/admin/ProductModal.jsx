import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { adminApi } from '../../utils/adminApi';

export default function ProductModal({ product, sections, onClose, onSuccess }) {
    const [formData, setFormData] = useState({
        sku: '', title: '', slug: '', description: '', price: '', original_price: '',
        is_on_sale: false, stock: '', section_id: '', images: [], sizes: [], colors: [], is_active: true
    });
    const [loading, setLoading] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [activeTab, setActiveTab] = useState('basic');
    const [sizeInput, setSizeInput] = useState('');
    const [colorInput, setColorInput] = useState('');

    useEffect(() => {
        if (product) {
            setFormData({
                sku: product.sku || '',
                title: product.title || '',
                slug: product.slug || '',
                description: product.description || '',
                price: product.price || '',
                original_price: product.original_price || '',
                is_on_sale: product.is_on_sale || false,
                stock: product.stock || '',
                section_id: product.section_id || '',
                images: product.images || [],
                sizes: product.sizes || [],
                colors: product.colors || [],
                is_active: product.is_active !== undefined ? product.is_active : true
            });
        }
    }, [product]);

    const generateSlug = (title) => {
        return title.toLowerCase().replace(/[^a-z0-9 -]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim();
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploadingImage(true);
        try {
            const response = await adminApi.uploadImage(file);
            if (response.success && response.data.image_url) {
                setFormData(prev => ({ ...prev, images: [...prev.images, response.data.image_url] }));
            } else {
                alert('Failed to upload image');
            }
        } catch (error) {
            alert('Failed to upload image');
        } finally {
            setUploadingImage(false);
        }
    };

    const removeImage = (index) => {
        setFormData(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
    };

    const addSize = () => {
        if (sizeInput.trim() && !formData.sizes.includes(sizeInput.trim())) {
            setFormData(prev => ({ ...prev, sizes: [...prev.sizes, sizeInput.trim()] }));
            setSizeInput('');
        }
    };

    const removeSize = (size) => {
        setFormData(prev => ({ ...prev, sizes: prev.sizes.filter(s => s !== size) }));
    };

    const addColor = () => {
        if (colorInput.trim() && !formData.colors.includes(colorInput.trim())) {
            setFormData(prev => ({ ...prev, colors: [...prev.colors, colorInput.trim()] }));
            setColorInput('');
        }
    };

    const removeColor = (color) => {
        setFormData(prev => ({ ...prev, colors: prev.colors.filter(c => c !== color) }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = product 
                ? await adminApi.updateProduct(product.id, formData)
                : await adminApi.createProduct(formData);
            
            if (response.success) {
                alert(product ? 'Product updated successfully!' : 'Product created successfully!');
                onSuccess();
            } else {
                alert('Error: ' + response.error);
            }
        } catch (error) {
            alert('Failed to save product');
        } finally {
            setLoading(false);
        }
    };

    return createPortal(
        <AnimatePresence>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4" style={{ zIndex: 99999 }} onClick={onClose}>
                <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl" onClick={(e) => e.stopPropagation()}>
                    {/* Header */}
                    <div className="p-6 border-b border-gray-200">
                        <div className="flex justify-between items-center">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">{product ? 'Edit Product' : 'Add New Product'}</h2>
                                <p className="text-sm text-gray-600 mt-1">{product ? `Editing: ${product.title}` : 'Create a new product in your catalog'}</p>
                            </div>
                            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="border-b border-gray-200 px-6">
                        <div className="flex gap-6">
                            {['basic', 'pricing', 'inventory', 'media'].map((tab) => (
                                <button key={tab} onClick={() => setActiveTab(tab)} className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === tab ? 'border-orange-500 text-orange-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
                                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="p-6 overflow-y-auto max-h-[calc(90vh-240px)]">
                            {activeTab === 'basic' && (
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">SKU *</label>
                                            <input type="text" value={formData.sku} onChange={(e) => setFormData(prev => ({ ...prev, sku: e.target.value }))} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Section *</label>
                                            <select value={formData.section_id} onChange={(e) => setFormData(prev => ({ ...prev, section_id: e.target.value }))} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none">
                                                <option value="">Select Section</option>
                                                {sections.map(section => (<option key={section.id} value={section.id}>{section.name}</option>))}
                                            </select>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                                        <input type="text" value={formData.title} onChange={(e) => { const title = e.target.value; setFormData(prev => ({ ...prev, title, slug: generateSlug(title) })); }} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Slug *</label>
                                        <input type="text" value={formData.slug} onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                        <textarea value={formData.description} onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))} rows={4} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"></textarea>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'pricing' && (
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Price *</label>
                                            <input type="number" step="0.01" value={formData.price} onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Original Price</label>
                                            <input type="number" step="0.01" value={formData.original_price} onChange={(e) => setFormData(prev => ({ ...prev, original_price: e.target.value }))} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none" />
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <input type="checkbox" id="is_on_sale" checked={formData.is_on_sale} onChange={(e) => setFormData(prev => ({ ...prev, is_on_sale: e.target.checked }))} className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500" />
                                        <label htmlFor="is_on_sale" className="text-sm font-medium text-gray-700">Product is on sale</label>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'inventory' && (
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity *</label>
                                        <input type="number" value={formData.stock} onChange={(e) => setFormData(prev => ({ ...prev, stock: e.target.value }))} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Sizes</label>
                                        <div className="flex gap-2 mb-2">
                                            <input type="text" value={sizeInput} onChange={(e) => setSizeInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSize())} placeholder="Add size (e.g., S, M, L)" className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none" />
                                            <button type="button" onClick={addSize} className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors">Add</button>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {formData.sizes.map((size, i) => (
                                                <span key={i} className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                                                    {size}
                                                    <button type="button" onClick={() => removeSize(size)} className="text-gray-500 hover:text-red-600">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                                    </button>
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Colors</label>
                                        <div className="flex gap-2 mb-2">
                                            <input type="text" value={colorInput} onChange={(e) => setColorInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addColor())} placeholder="Add color (e.g., Red, Blue)" className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none" />
                                            <button type="button" onClick={addColor} className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors">Add</button>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {formData.colors.map((color, i) => (
                                                <span key={i} className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                                                    {color}
                                                    <button type="button" onClick={() => removeColor(color)} className="text-gray-500 hover:text-red-600">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                                    </button>
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <input type="checkbox" id="is_active" checked={formData.is_active} onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))} className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500" />
                                        <label htmlFor="is_active" className="text-sm font-medium text-gray-700">Product is active</label>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'media' && (
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Product Images</label>
                                        <label className="block border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-orange-500 hover:bg-orange-50 transition-all">
                                            <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={uploadingImage} />
                                            <svg className="w-12 h-12 mx-auto mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                                            <p className="text-sm font-medium text-gray-700">{uploadingImage ? 'Uploading...' : 'Click to upload image'}</p>
                                            <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 10MB</p>
                                        </label>
                                    </div>
                                    {formData.images.length > 0 && (
                                        <div className="grid grid-cols-4 gap-4">
                                            {formData.images.map((image, i) => (
                                                <div key={i} className="relative group aspect-square rounded-lg overflow-hidden border border-gray-200">
                                                    <img src={image} alt={`Product ${i + 1}`} className="w-full h-full object-cover" />
                                                    <button type="button" onClick={() => removeImage(i)} className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
                            <button type="button" onClick={onClose} className="px-6 py-2 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium">Cancel</button>
                            <button type="submit" disabled={loading} className="px-6 py-2 bg-orange-500 text-white rounded-xl hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium inline-flex items-center gap-2">
                                {loading && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>}
                                {loading ? 'Saving...' : (product ? 'Update Product' : 'Create Product')}
                            </button>
                        </div>
                    </form>
                </motion.div>
            </motion.div>
        </AnimatePresence>,
        document.body
    );
}
