import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { API_CONFIG, buildApiUrl, ENDPOINTS } from '../config/api.config';

export const useAuthStore = create(
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
                    const response = await fetch(buildApiUrl(ENDPOINTS.AUTH.LOGIN), {
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

                    // Sync cart and wishlist with backend after successful login
                    // Import dynamically to avoid circular dependencies
                    setTimeout(async () => {
                        try {
                            const { useCartStore } = await import('./cartStore');
                            const { useWishlistStore } = await import('./wishlistStore');
                            
                            await useCartStore.getState().syncWithBackend();
                            await useWishlistStore.getState().syncWithBackend();
                        } catch (error) {
                            console.error('Failed to sync cart/wishlist after login:', error);
                        }
                    }, 100);

                    return { success: true };
                } catch (error) {
                    set({
                        isLoading: false,
                        error: error.message,
                    });
                    return { success: false, error: error.message };
                }
            },

            register: async (userData) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await fetch(buildApiUrl(ENDPOINTS.AUTH.REGISTER), {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(userData),
                    });

                    const data = await response.json();

                    if (!response.ok) {
                        throw new Error(data.error || 'Registration failed');
                    }

                    // If backend returns tokens after registration, auto-login
                    if (data.access_token) {
                        set({
                            user: data.user,
                            accessToken: data.access_token,
                            refreshToken: data.refresh_token,
                            isAuthenticated: true,
                            isLoading: false,
                            error: null,
                        });
                        
                        // Sync cart and wishlist after registration
                        setTimeout(async () => {
                            try {
                                const { useCartStore } = await import('./cartStore');
                                const { useWishlistStore } = await import('./wishlistStore');
                                
                                await useCartStore.getState().syncWithBackend();
                                await useWishlistStore.getState().syncWithBackend();
                            } catch (error) {
                                console.error('Failed to sync cart/wishlist after registration:', error);
                            }
                        }, 100);
                        
                        return { success: true };
                    }

                    set({ isLoading: false });
                    return { success: true, message: data.message };

                } catch (error) {
                    set({
                        isLoading: false,
                        error: error.message,
                    });
                    return { success: false, error: error.message };
                }
            },

            logout: () => {
                // Clear cart and wishlist on logout
                setTimeout(async () => {
                    try {
                        const { useCartStore } = await import('./cartStore');
                        const { useWishlistStore } = await import('./wishlistStore');
                        
                        useCartStore.getState().clearCartOnLogout();
                        useWishlistStore.getState().clearWishlistOnLogout();
                    } catch (error) {
                        console.error('Failed to clear cart/wishlist on logout:', error);
                    }
                }, 0);
                
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

            updateProfile: async (profileData) => {
                set({ isLoading: true, error: null });
                const { accessToken } = get();
                try {
                    const response = await fetch(buildApiUrl(ENDPOINTS.AUTH.UPDATE_PROFILE), {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${accessToken}`,
                        },
                        body: JSON.stringify(profileData),
                    });

                    const data = await response.json();
                    if (!response.ok) {
                        // Check if token expired
                        if (response.status === 401) {
                            const refreshed = await get().refreshAccessToken();
                            if (refreshed) {
                                return get().updateProfile(profileData);
                            }
                        }
                        throw new Error(data.error || 'Update failed');
                    }

                    set((state) => ({
                        user: { ...state.user, ...data.user },
                        isLoading: false,
                    }));
                    return { success: true };
                } catch (error) {
                    set({ isLoading: false, error: error.message });
                    return { success: false, error: error.message };
                }
            },

            getAuthHeaders: () => {
                const { accessToken } = get();
                return accessToken ? { 'Authorization': `Bearer ${accessToken}` } : {};
            },

            clearError: () => set({ error: null }),
        }),
        {
            name: 'peckup-auth',
            partialize: (state) => ({
                user: state.user,
                accessToken: state.accessToken,
                refreshToken: state.refreshToken,
                isAuthenticated: state.isAuthenticated,
            }),
        }
    )
);
