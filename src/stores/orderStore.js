import { create } from 'zustand';
import { api } from '../utils/api';
import { useAuthStore } from './authStore';
import { API_CONFIG } from '../config/api.config';

export const useOrderStore = create((set, get) => ({
  orders: [],
  currentOrder: null,
  loading: false,
  error: null,
  
  // Fetch all orders
  fetchOrders: async (token = null) => {
    set({ loading: true, error: null });
    try {
      const response = await api.getOrders(token);
      set({ orders: response.orders || [], loading: false });
      return { success: true };
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      const errorMessage = error.message || 'Failed to fetch orders';
      set({ loading: false, error: errorMessage });
      return { success: false, error: errorMessage };
    }
  },
  
  // Fetch single order
  fetchOrder: async (orderId) => {
    set({ loading: true, error: null });
    try {
      const response = await api.getOrder(orderId);
      set({ currentOrder: response.order, loading: false });
      return { success: true, order: response.order };
    } catch (error) {
      console.error('Failed to fetch order:', error);
      const errorMessage = error.message || 'Failed to fetch order';
      set({ loading: false, error: errorMessage });
      return { success: false, error: errorMessage };
    }
  },
  
  // Create new order
  createOrder: async (orderData) => {
    set({ loading: true, error: null });
    try {
      const response = await api.createOrder(orderData);
      
      set((state) => ({
        orders: [response.order, ...state.orders],
        currentOrder: response.order,
        loading: false,
        error: null
      }));
      
      return { success: true, order: response.order };
    } catch (error) {
      console.error('Failed to create order:', error);
      const errorMessage = error.message || 'Failed to create order';
      set({ loading: false, error: errorMessage });
      return { success: false, error: errorMessage };
    }
  },
  
  // Cancel order
  cancelOrder: async (orderId) => {
    try {
      const response = await api.cancelOrder(orderId);
      
      set((state) => ({
        orders: state.orders.map((order) =>
          order.id === orderId ? { ...order, status: 'cancelled' } : order
        ),
        error: null
      }));
      
      return { success: true, order: response.order };
    } catch (error) {
      console.error('Failed to cancel order:', error);
      const errorMessage = error.message || 'Failed to cancel order';
      set({ error: errorMessage });
      return { success: false, error: errorMessage };
    }
  },
  
  // Update order status (admin function)
  updateOrderStatus: async (orderId, status, token) => {
    try {
      const response = await api.updateOrderStatus(orderId, status, token);
      
      set((state) => ({
        orders: state.orders.map((order) =>
          order.id === orderId ? { ...order, status: status } : order
        ),
        error: null
      }));
      
      return { success: true, order: response.order };
    } catch (error) {
      console.error('Failed to update order status:', error);
      const errorMessage = error.message || 'Failed to update order status';
      set({ error: errorMessage });
      return { success: false, error: errorMessage };
    }
  },
  
  // Download receipt
  downloadReceipt: async (orderId) => {
    try {
      const { accessToken } = useAuthStore.getState();
      
      if (!accessToken) {
        throw new Error('Not authenticated');
      }
      
      const response = await fetch(`${API_CONFIG.API_URL}/orders/${orderId}/receipt`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to download receipt');
      }
      
      // Get the blob from response
      const blob = await response.blob();
      
      // Create blob link to download
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `peckup_receipt_${orderId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      return { success: true };
    } catch (error) {
      console.error('Failed to download receipt:', error);
      const errorMessage = error.message || 'Failed to download receipt';
      return { success: false, error: errorMessage };
    }
  },
  
  // Clear error
  clearError: () => set({ error: null }),
  
  // Clear current order
  clearCurrentOrder: () => set({ currentOrder: null })
}));