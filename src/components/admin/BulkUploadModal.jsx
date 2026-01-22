import { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { adminApi } from '../../utils/adminApi';

export default function BulkUploadModal({ isOpen, onClose, onSuccess }) {
    const [step, setStep] = useState(1);
    const [uploadedImages, setUploadedImages] = useState([]);
    const [uploadResults, setUploadResults] = useState(null);
    const [uploading, setUploading] = useState(false);

    const downloadTemplate = () => {
        const headers = ['sku', 'title', 'slug', 'price', 'section_slug', 'description', 'original_price', 'is_on_sale', 'stock', 'sizes', 'colors', 'image_filenames', 'is_active'];
        const sampleData = [
            ['TSHIRT-001', 'Premium Cotton T-Shirt', 'premium-cotton-t-shirt', '29.99', 'clothing', 'Comfortable 100% cotton t-shirt', '39.99', 'TRUE', '50', 'S,M,L,XL', 'Black,White,Navy', 'tshirt-001.jpg', 'TRUE'],
            ['JEANS-002', 'Classic Blue Jeans', 'classic-blue-jeans', '79.99', 'clothing', 'Classic fit premium denim jeans', '99.99', 'TRUE', '30', '28,30,32,34,36', 'Blue,Black', 'jeans-002.jpg', 'TRUE']
        ];
        
        const csvContent = [headers.join(','), ...sampleData.map(row => row.map(cell => typeof cell === 'string' && cell.includes(',') ? `"${cell}"` : cell).join(','))].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'product_upload_template.csv';
        link.click();
        alert('Template downloaded! Fill it with your product data.');
    };

    const handleImageUpload = async (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        setUploading(true);
        try {
            const response = await adminApi.bulkUploadImages(files);
            if (response.success) {
                setUploadedImages(response.data.results.uploaded_files || []);
                setStep(3);
                alert(`Successfully uploaded ${response.data.results.success} images!`);
            } else {
                alert('Failed to upload images: ' + response.error);
            }
        } catch (error) {
            alert('Failed to upload images');
        } finally {
            setUploading(false);
        }
    };

    const handleExcelUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        try {
            const response = await adminApi.bulkUploadProducts(file);
            if (response.success) {
                setUploadResults(response.data.results);
                setStep(4);
                onSuccess();
            } else {
                alert('Failed to upload products: ' + response.error);
            }
        } catch (error) {
            alert('Failed to upload products');
        } finally {
            setUploading(false);
        }
    };

    const resetAndClose = () => {
        setStep(1);
        setUploadedImages([]);
        setUploadResults(null);
        onClose();
    };

    if (!isOpen) return null;

    return createPortal(
        <AnimatePresence>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4" style={{ zIndex: 99999 }} onClick={resetAndClose}>
                <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
                    {/* Header */}
                    <div className="p-6 border-b border-gray-200">
                        <div className="flex justify-between items-center">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">Bulk Product Upload</h2>
                                <p className="text-sm text-gray-600 mt-1">Follow the steps to upload multiple products at once</p>
                            </div>
                            <button onClick={resetAndClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                    </div>

                    {/* Steps Indicator */}
                    <div className="px-6 py-4 bg-gray-50">
                        <div className="flex items-center justify-between relative">
                            <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200 z-0"></div>
                            {[1, 2, 3, 4].map((s) => (
                                <div key={s} className="flex flex-col items-center relative z-10">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${step >= s ? 'bg-orange-500 text-white' : 'bg-white border-2 border-gray-300 text-gray-400'}`}>{s}</div>
                                    <span className={`text-xs mt-2 ${step >= s ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>{['Template', 'Images', 'Excel', 'Done'][s - 1]}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                        {step === 1 && (
                            <div className="text-center py-8">
                                <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <svg className="w-10 h-10 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">Download Template</h3>
                                <p className="text-gray-600 mb-6 max-w-md mx-auto">Download the CSV template, fill it with your product data, and upload it in the next steps.</p>
                                <button onClick={downloadTemplate} className="px-6 py-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors font-semibold shadow-lg hover:shadow-xl inline-flex items-center gap-2">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                    Download Template
                                </button>
                                <div className="mt-8 pt-6 border-t border-gray-200">
                                    <button onClick={() => setStep(2)} className="text-orange-500 hover:text-orange-600 font-medium">Already have the template? Continue →</button>
                                </div>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="py-8">
                                <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">Upload Product Images (Optional)</h3>
                                <p className="text-gray-600 mb-6 text-center max-w-md mx-auto">Upload images first, then reference them in your Excel file. You can skip this if you don't have images yet.</p>
                                <label className="block border-2 border-dashed border-gray-300 rounded-xl p-12 text-center cursor-pointer hover:border-orange-500 hover:bg-orange-50 transition-all">
                                    <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" disabled={uploading} />
                                    <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                                    <p className="text-lg font-medium text-gray-700 mb-2">{uploading ? 'Uploading...' : 'Click to upload images'}</p>
                                    <p className="text-sm text-gray-500">or drag and drop</p>
                                    <p className="text-xs text-gray-400 mt-2">PNG, JPG, GIF up to 10MB each</p>
                                </label>
                                <div className="mt-6 flex justify-center gap-3">
                                    <button onClick={() => setStep(1)} className="px-6 py-2 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium">Back</button>
                                    <button onClick={() => setStep(3)} className="px-6 py-2 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors font-medium">Skip Images</button>
                                </div>
                            </div>
                        )}

                        {step === 3 && (
                            <div className="py-8">
                                <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">Upload Excel File</h3>
                                <p className="text-gray-600 mb-6 text-center max-w-md mx-auto">Upload your filled template with product data.</p>
                                {uploadedImages.length > 0 && (
                                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl">
                                        <p className="text-sm text-green-800 font-medium">✓ {uploadedImages.length} images uploaded successfully</p>
                                        <p className="text-xs text-green-600 mt-1">Reference these filenames in your Excel: {uploadedImages.slice(0, 3).join(', ')}{uploadedImages.length > 3 && '...'}</p>
                                    </div>
                                )}
                                <label className="block border-2 border-dashed border-gray-300 rounded-xl p-12 text-center cursor-pointer hover:border-orange-500 hover:bg-orange-50 transition-all">
                                    <input type="file" accept=".xlsx,.xls,.csv" onChange={handleExcelUpload} className="hidden" disabled={uploading} />
                                    <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                    <p className="text-lg font-medium text-gray-700 mb-2">{uploading ? 'Uploading...' : 'Click to upload Excel file'}</p>
                                    <p className="text-sm text-gray-500">CSV, XLSX, or XLS format</p>
                                </label>
                                <div className="mt-6 flex justify-center">
                                    <button onClick={() => setStep(2)} className="px-6 py-2 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium">Back</button>
                                </div>
                            </div>
                        )}

                        {step === 4 && uploadResults && (
                            <div className="py-8 text-center">
                                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">Upload Complete!</h3>
                                <div className="bg-gray-50 rounded-xl p-6 max-w-md mx-auto mb-6">
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div className="text-left"><span className="text-gray-600">Products Created:</span></div>
                                        <div className="text-right"><span className="font-bold text-green-600">{uploadResults.success}</span></div>
                                        {uploadResults.errors && uploadResults.errors.length > 0 && (
                                            <><div className="text-left"><span className="text-gray-600">Errors:</span></div><div className="text-right"><span className="font-bold text-red-600">{uploadResults.errors.length}</span></div></>
                                        )}
                                    </div>
                                </div>
                                {uploadResults.errors && uploadResults.errors.length > 0 && (
                                    <div className="bg-red-50 border border-red-200 rounded-xl p-4 max-w-md mx-auto mb-6 max-h-40 overflow-y-auto">
                                        <p className="text-sm font-medium text-red-800 mb-2">Errors:</p>
                                        {uploadResults.errors.map((error, i) => (<p key={i} className="text-xs text-red-600">{error}</p>))}
                                    </div>
                                )}
                                <button onClick={resetAndClose} className="px-8 py-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors font-semibold shadow-lg">Done</button>
                            </div>
                        )}
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>,
        document.body
    );
}
