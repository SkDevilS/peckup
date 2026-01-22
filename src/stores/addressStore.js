import { create } from 'zustand';
import { api } from '../utils/api';

export const useAddressStore = create((set, get) => ({
  addresses: [],
  loading: false,
  error: null,
  
  // Fetch all addresses
  fetchAddresses: async () => {
    set({ loading: true, error: null });
    try {
      const response = await api.getAddresses();
      set({ addresses: response.addresses || [], loading: false });
      return { success: true };
    } catch (error) {
      console.error('Failed to fetch addresses:', error);
      const errorMessage = error.message || 'Failed to fetch addresses';
      set({ loading: false, error: errorMessage });
      return { success: false, error: errorMessage };
    }
  },
  
  // Add new address
  addAddress: async (addressData) => {
    try {
      const response = await api.createAddress(addressData);
      
      set((state) => ({
        addresses: [...state.addresses, response.address],
        error: null
      }));
      
      return { success: true, address: response.address };
    } catch (error) {
      console.error('Failed to add address:', error);
      const errorMessage = error.message || 'Failed to add address';
      set({ error: errorMessage });
      return { success: false, error: errorMessage };
    }
  },
  
  // Update address
  updateAddress: async (addressId, addressData) => {
    try {
      const response = await api.updateAddress(addressId, addressData);
      
      set((state) => ({
        addresses: state.addresses.map((addr) =>
          addr.id === addressId ? response.address : addr
        ),
        error: null
      }));
      
      return { success: true, address: response.address };
    } catch (error) {
      console.error('Failed to update address:', error);
      const errorMessage = error.message || 'Failed to update address';
      set({ error: errorMessage });
      return { success: false, error: errorMessage };
    }
  },
  
  // Delete address
  deleteAddress: async (addressId) => {
    try {
      await api.deleteAddress(addressId);
      
      set((state) => ({
        addresses: state.addresses.filter((addr) => addr.id !== addressId),
        error: null
      }));
      
      return { success: true };
    } catch (error) {
      console.error('Failed to delete address:', error);
      const errorMessage = error.message || 'Failed to delete address';
      set({ error: errorMessage });
      return { success: false, error: errorMessage };
    }
  },
  
  // Set default address
  setDefaultAddress: async (addressId) => {
    try {
      const response = await api.setDefaultAddress(addressId);
      
      set((state) => ({
        addresses: state.addresses.map((addr) => ({
          ...addr,
          is_default: addr.id === addressId
        })),
        error: null
      }));
      
      return { success: true, address: response.address };
    } catch (error) {
      console.error('Failed to set default address:', error);
      const errorMessage = error.message || 'Failed to set default address';
      set({ error: errorMessage });
      return { success: false, error: errorMessage };
    }
  },
  
  // Get default address
  getDefaultAddress: () => {
    const { addresses } = get();
    return addresses.find(addr => addr.is_default) || addresses[0] || null;
  },
  
  // Clear error
  clearError: () => set({ error: null })
}));