import { create } from 'zustand';
import { API_CONFIG } from '../config/api.config';

export const useAnalyticsStore = create((set, get) => ({
    views: 0,
    clicks: 0,
    loading: false,

    // Fetch current analytics
    fetchAnalytics: async () => {
        try {
            const response = await fetch(`${API_CONFIG.API_URL}/analytics`);
            const data = await response.json();
            set({ views: data.views || 0, clicks: data.clicks || 0 });
        } catch (error) {
            console.error('Failed to fetch analytics:', error);
        }
    },

    // Increment view count
    incrementView: async () => {
        try {
            const response = await fetch(`${API_CONFIG.API_URL}/analytics/view`, {
                method: 'POST',
            });
            const data = await response.json();
            set({ views: data.views || get().views + 1 });
        } catch (error) {
            console.error('Failed to increment view:', error);
        }
    },

    // Increment click count
    incrementClick: async () => {
        try {
            const response = await fetch(`${API_CONFIG.API_URL}/analytics/click`, {
                method: 'POST',
            });
            const data = await response.json();
            set({ clicks: data.clicks || get().clicks + 1 });
        } catch (error) {
            console.error('Failed to increment click:', error);
        }
    },

    // Update analytics (admin only)
    updateAnalytics: async (views, clicks, token) => {
        set({ loading: true });
        try {
            const response = await fetch(`${API_CONFIG.API_URL}/admin/analytics`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ views, clicks }),
            });
            const data = await response.json();
            if (data.success) {
                set({ views: data.views, clicks: data.clicks });
                return { success: true };
            }
            return { success: false, error: data.error };
        } catch (error) {
            console.error('Failed to update analytics:', error);
            return { success: false, error: error.message };
        } finally {
            set({ loading: false });
        }
    },
}));
