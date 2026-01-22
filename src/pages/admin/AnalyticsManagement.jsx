import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAnalyticsStore } from '../../stores/analyticsStore';
import { useAdminAuthStore } from '../../stores/adminAuthStore';

export default function AnalyticsManagement() {
    const { views, clicks, fetchAnalytics, updateAnalytics, loading } = useAnalyticsStore();
    const { accessToken } = useAdminAuthStore();
    const [editViews, setEditViews] = useState(0);
    const [editClicks, setEditClicks] = useState(0);

    useEffect(() => {
        fetchAnalytics();
        const interval = setInterval(fetchAnalytics, 3000); // Poll every 3 seconds
        return () => clearInterval(interval);
    }, [fetchAnalytics]);

    useEffect(() => {
        setEditViews(views);
        setEditClicks(clicks);
    }, [views, clicks]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        const result = await updateAnalytics(editViews, editClicks, accessToken);
        if (result.success) {
            alert('Analytics updated successfully!');
        } else {
            alert('Failed to update analytics: ' + result.error);
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Analytics Management</h1>
                <p className="text-sm text-gray-600 mt-1">Monitor and customize website analytics</p>
            </div>

            {/* Real-time Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-xl border border-gray-200 p-6"
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                        </div>
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">Live</span>
                    </div>
                    <h3 className="text-sm font-medium text-gray-600 mb-2">Total Views</h3>
                    <p className="text-3xl font-bold text-gray-900">{views.toLocaleString()}</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white rounded-xl border border-gray-200 p-6"
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                            <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                            </svg>
                        </div>
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">Live</span>
                    </div>
                    <h3 className="text-sm font-medium text-gray-600 mb-2">Total Clicks</h3>
                    <p className="text-3xl font-bold text-gray-900">{clicks.toLocaleString()}</p>
                </motion.div>
            </div>

            {/* Edit Form */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-xl border border-gray-200 p-6"
            >
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Customize Analytics</h2>
                <p className="text-sm text-gray-600 mb-6">
                    Manually set the view and click counts. This will override the current values.
                </p>

                <form onSubmit={handleUpdate} className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Views Count
                            </label>
                            <input
                                type="number"
                                value={editViews}
                                onChange={(e) => setEditViews(parseInt(e.target.value) || 0)}
                                min="0"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Clicks Count
                            </label>
                            <input
                                type="number"
                                value={editClicks}
                                onChange={(e) => setEditClicks(parseInt(e.target.value) || 0)}
                                min="0"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                            />
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Updating...' : 'Update Analytics'}
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setEditViews(views);
                                setEditClicks(clicks);
                            }}
                            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
                        >
                            Reset
                        </button>
                    </div>
                </form>
            </motion.div>

            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    <div>
                        <h4 className="text-sm font-semibold text-blue-900 mb-1">How it works</h4>
                        <ul className="text-sm text-blue-800 space-y-1">
                            <li>• Views are automatically incremented when users visit the website</li>
                            <li>• Clicks are tracked when users click on footer links</li>
                            <li>• Analytics update in real-time (refreshes every 3 seconds)</li>
                            <li>• You can manually set any value using the form above</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
