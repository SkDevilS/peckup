import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { api } from '../utils/api';
import { useAuthStore } from './authStore';

export const useCartStore = create(
    persist(
        (set, get) => ({
            items: [],
            isLoading: false,

            // Sync cart with backend after login
            syncWithBackend: async () => {
                const { isAuthenticated } = useAuthStore.getState();
                if (!isAuthenticated) return;

                try {
                    set({ isLoading: true });
                    
                    // Get local items before fetching from backend
                    const localItems = get().items;
                    
                    // Fetch cart from backend
                    const data = await api.getCart();
                    
                    // Transform backend items to local structure
                    const backendItems = data.items.map(item => ({
                        ...item.product,
                        id: item.product.id,
                        cartItemId: item.id,
                        quantity: item.quantity,
                        selectedSize: item.size,
                        selectedColor: item.color
                    }));
                    
                    // Merge local items with backend items (if user had items before login)
                    const mergedItems = [...backendItems];
                    
                    // Add local items that don't exist in backend
                    for (const localItem of localItems) {
                        const existsInBackend = backendItems.some(
                            item => item.id === localItem.id &&
                                   item.selectedSize === localItem.selectedSize &&
                                   item.selectedColor === localItem.selectedColor
                        );
                        
                        if (!existsInBackend) {
                            // Add to backend
                            try {
                                await api.addToCart({
                                    product_id: localItem.id,
                                    quantity: localItem.quantity,
                                    size: localItem.selectedSize,
                                    color: localItem.selectedColor
                                });
                                mergedItems.push(localItem);
                            } catch (error) {
                                console.error('Failed to sync local item to backend:', error);
                            }
                        }
                    }
                    
                    set({ items: mergedItems, isLoading: false });
                } catch (error) {
                    console.error('Failed to sync cart with backend:', error);
                    set({ isLoading: false });
                }
            },

            // Clear cart (used on logout)
            clearCartOnLogout: () => {
                set({ items: [] });
            },

            addItem: async (product, quantity = 1, selectedSize = null, selectedColor = null) => {
                const { isAuthenticated } = useAuthStore.getState();

                // Optimistic update
                set((state) => {
                    const existingItem = state.items.find(
                        (item) =>
                            item.id === product.id &&
                            item.selectedSize === selectedSize &&
                            item.selectedColor === selectedColor
                    );

                    if (existingItem) {
                        return {
                            items: state.items.map((item) =>
                                item.id === product.id &&
                                    item.selectedSize === selectedSize &&
                                    item.selectedColor === selectedColor
                                    ? { ...item, quantity: item.quantity + quantity }
                                    : item
                            ),
                        };
                    }

                    return {
                        items: [...state.items, { ...product, quantity, selectedSize, selectedColor }],
                    };
                });

                // Sync with backend if logged in
                if (isAuthenticated) {
                    try {
                        await api.addToCart({
                            product_id: product.id,
                            quantity,
                            size: selectedSize,
                            color: selectedColor
                        });
                        // Refresh cart to get backend IDs
                        await get().syncWithBackend();
                    } catch (error) {
                        console.error('Failed to sync cart with backend:', error);
                    }
                }
            },

            removeItem: async (productId, selectedSize = null, selectedColor = null) => {
                const { isAuthenticated } = useAuthStore.getState();

                // Optimistic update
                set((state) => ({
                    items: state.items.filter(
                        (item) =>
                            !(item.id === productId &&
                                item.selectedSize === selectedSize &&
                                item.selectedColor === selectedColor)
                    ),
                }));

                if (isAuthenticated) {
                    try {
                        // Find the cart item ID from current state
                        const item = get().items.find(
                            i => i.id === productId &&
                                 i.selectedSize === selectedSize &&
                                 i.selectedColor === selectedColor
                        );
                        
                        if (item && item.cartItemId) {
                            await api.removeFromCart(item.cartItemId);
                        } else {
                            // Fallback: fetch cart and find item
                            const cart = await api.getCart();
                            const match = cart.items.find(i =>
                                i.product.id === productId &&
                                i.size === selectedSize &&
                                i.color === selectedColor
                            );
                            if (match) {
                                await api.removeFromCart(match.id);
                            }
                        }
                    } catch (error) {
                        console.error('Failed to sync remove:', error);
                    }
                }
            },

            updateQuantity: async (productId, quantity, selectedSize = null, selectedColor = null) => {
                const { isAuthenticated } = useAuthStore.getState();

                if (quantity <= 0) {
                    get().removeItem(productId, selectedSize, selectedColor);
                    return;
                }

                set((state) => ({
                    items: state.items.map((item) =>
                        item.id === productId &&
                            item.selectedSize === selectedSize &&
                            item.selectedColor === selectedColor
                            ? { ...item, quantity }
                            : item
                    ),
                }));

                if (isAuthenticated) {
                    try {
                        const item = get().items.find(
                            i => i.id === productId &&
                                 i.selectedSize === selectedSize &&
                                 i.selectedColor === selectedColor
                        );
                        
                        if (item && item.cartItemId) {
                            await api.updateCartItem(item.cartItemId, { 
                                quantity, 
                                size: selectedSize, 
                                color: selectedColor 
                            });
                        }
                    } catch (error) {
                        console.error('Failed to update quantity:', error);
                    }
                }
            },

            clearCart: async () => {
                const { isAuthenticated } = useAuthStore.getState();
                set({ items: [] });
                if (isAuthenticated) {
                    try {
                        await api.clearCart();
                    } catch (error) {
                        console.error('Failed to clear cart:', error);
                    }
                }
            },

            fetchCart: async () => {
                const { isAuthenticated } = useAuthStore.getState();
                if (!isAuthenticated) return;

                try {
                    const data = await api.getCart();
                    const localItems = data.items.map(item => ({
                        ...item.product,
                        id: item.product.id,
                        cartItemId: item.id,
                        quantity: item.quantity,
                        selectedSize: item.size,
                        selectedColor: item.color
                    }));

                    set({ items: localItems });
                } catch (error) {
                    console.error('Failed to fetch cart:', error);
                }
            },

            getItemCount: () => {
                return get().items.reduce((total, item) => total + item.quantity, 0);
            },

            getTotal: () => {
                return get().items.reduce(
                    (total, item) => total + (item.price || 0) * item.quantity,
                    0
                );
            },

            getSubtotal: () => {
                return get().items.reduce(
                    (total, item) => total + (item.price || 0) * item.quantity,
                    0
                );
            },
        }),
        {
            name: 'peckup-cart',
        }
    )
);
