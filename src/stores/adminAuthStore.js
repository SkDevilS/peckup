import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { API_CONFIG, buildApiUrl, ENDPOINTS } from '../config/api.config';

export const useAdminAuthStore = create(
    persist(
        (set, get) => ({
            user: null,
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,

            login: async (email, password) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await fetch(buildApiUrl(ENDPOINTS.ADMIN.LOGIN), {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ email, password }),
                    });

                    const data = await response.json();

                    if (!response.ok) {
                        throw new Error(data.error || 'Login failed');
                    }

                    set({
                        user: data.user,
                        accessToken: data.access_token,
                        refreshToken: data.refresh_token,
                        isAuthenticated: true,
                        isLoading: false,
                        error: null,
                    });

                    return { success: true };
                } catch (error) {
                    set({
                        isLoading: false,
                        error: error.message,
                    });
                    return { success: false, error: error.message };
                }
            },

            logout: () => {
                set({
                    user: null,
                    accessToken: null,
                    refreshToken: null,
                    isAuthenticated: false,
                    error: null,
                });
            },

            refreshAccessToken: async () => {
                const { refreshToken } = get();
                if (!refreshToken) return false;

                try {
                    const response = await fetch(buildApiUrl(ENDPOINTS.AUTH.REFRESH), {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${refreshToken}`,
                        },
                    });

                    if (!response.ok) {
                        get().logout();
                        return false;
                    }

                    const data = await response.json();
                    set({ accessToken: data.access_token });
                    return true;
                } catch (error) {
                    get().logout();
                    return false;
                }
            },

            getAuthHeaders: () => {
                const { accessToken } = get();
                return accessToken ? { 'Authorization': `Bearer ${accessToken}` } : {};
            },

            clearError: () => set({ error: null }),
        }),
        {
            name: 'peckup-admin-auth',
            partialize: (state) => ({
                user: state.user,
                accessToken: state.accessToken,
                refreshToken: state.refreshToken,
                isAuthenticated: state.isAuthenticated,
            }),
        }
    )
);
