import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { api } from '../utils/api';
import { useAuthStore } from './authStore';

export const useWishlistStore = create(
    persist(
        (set, get) => ({
            items: [],
            isLoading: false,

            // Sync wishlist with backend after login
            syncWithBackend: async () => {
                const { isAuthenticated } = useAuthStore.getState();
                if (!isAuthenticated) return;

                try {
                    set({ isLoading: true });
                    
                    // Get local items before fetching from backend
                    const localItems = get().items;
                    
                    // Fetch wishlist from backend
                    const data = await api.getWishlist();
                    
                    // Transform backend items to local structure
                    const backendItems = data.items.map(item => ({
                        ...item.product,
                        wishlistItemId: item.id
                    }));
                    
                    // Merge local items with backend items
                    const mergedItems = [...backendItems];
                    
                    // Add local items that don't exist in backend
                    for (const localItem of localItems) {
                        const existsInBackend = backendItems.some(
                            item => item.id === localItem.id
                        );
                        
                        if (!existsInBackend) {
                            // Add to backend
                            try {
                                await api.addToWishlist({ product_id: localItem.id });
                                mergedItems.push(localItem);
                            } catch (error) {
                                console.error('Failed to sync local wishlist item to backend:', error);
                            }
                        }
                    }
                    
                    set({ items: mergedItems, isLoading: false });
                } catch (error) {
                    console.error('Failed to sync wishlist with backend:', error);
                    set({ isLoading: false });
                }
            },

            // Clear wishlist (used on logout)
            clearWishlistOnLogout: () => {
                set({ items: [] });
            },

            addItem: async (product) => {
                const { isAuthenticated } = useAuthStore.getState();
                
                // Check if already exists
                const exists = get().items.some((item) => item.id === product.id);
                if (exists) return;

                // Optimistic update
                set((state) => ({
                    items: [...state.items, product]
                }));

                // Sync with backend if logged in
                if (isAuthenticated) {
                    try {
                        await api.addToWishlist({ product_id: product.id });
                        // Refresh to get backend ID
                        await get().syncWithBackend();
                    } catch (error) {
                        console.error('Failed to sync wishlist with backend:', error);
                        // Revert on error
                        set((state) => ({
                            items: state.items.filter(item => item.id !== product.id)
                        }));
                    }
                }
            },

            removeItem: async (productId) => {
                const { isAuthenticated } = useAuthStore.getState();

                // Optimistic update
                set((state) => ({
                    items: state.items.filter((item) => item.id !== productId),
                }));

                // Sync with backend if logged in
                if (isAuthenticated) {
                    try {
                        // Try to use wishlistItemId if available
                        const item = get().items.find(i => i.id === productId);
                        
                        if (item && item.wishlistItemId) {
                            await api.removeFromWishlist(item.wishlistItemId);
                        } else {
                            // Fallback: use product ID endpoint
                            await api.removeFromWishlistByProduct(productId);
                        }
                    } catch (error) {
                        console.error('Failed to sync wishlist removal:', error);
                    }
                }
            },

            isInWishlist: (productId) => {
                return get().items.some((item) => item.id === productId);
            },

            clearWishlist: async () => {
                const { isAuthenticated } = useAuthStore.getState();
                set({ items: [] });
                
                // Note: Backend doesn't have a clear all endpoint, 
                // so we'd need to remove items individually if needed
                if (isAuthenticated) {
                    try {
                        const items = get().items;
                        for (const item of items) {
                            if (item.wishlistItemId) {
                                await api.removeFromWishlist(item.wishlistItemId);
                            }
                        }
                    } catch (error) {
                        console.error('Failed to clear wishlist:', error);
                    }
                }
            },

            fetchWishlist: async () => {
                const { isAuthenticated } = useAuthStore.getState();
                if (!isAuthenticated) return;

                try {
                    const data = await api.getWishlist();
                    const localItems = data.items.map(item => ({
                        ...item.product,
                        wishlistItemId: item.id
                    }));

                    set({ items: localItems });
                } catch (error) {
                    console.error('Failed to fetch wishlist:', error);
                }
            },
        }),
        {
            name: 'peckup-wishlist',
        }
    )
);
