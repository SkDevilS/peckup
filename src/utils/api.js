import { useAuthStore } from '../stores/authStore';
import { API_CONFIG, buildApiUrl, buildApiUrlWithParams, ENDPOINTS } from '../config/api.config';

class Api {
    constructor() {
        this.baseURL = API_CONFIG.API_URL;
        this.timeout = API_CONFIG.TIMEOUT;
        this.retryAttempts = API_CONFIG.RETRY_ATTEMPTS;
        this.retryDelay = API_CONFIG.RETRY_DELAY;
    }

    async request(endpoint, options = {}) {
        const { accessToken, logout, refreshAccessToken } = useAuthStore.getState();

        const headers = {
            'Content-Type': 'application/json',
            ...options.headers,
        };

        if (accessToken) {
            headers['Authorization'] = `Bearer ${accessToken}`;
        }

        // Remove Content-Type for FormData
        if (options.body instanceof FormData) {
            delete headers['Content-Type'];
        }

        const url = endpoint.startsWith('http') ? endpoint : buildApiUrl(endpoint);
        
        // Add timeout to options
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.timeout);

        try {
            const response = await fetch(url, {
                ...options,
                headers,
                signal: controller.signal,
            });

            clearTimeout(timeoutId);

            // If 401, try to refresh token
            if (response.status === 401) {
                const refreshed = await refreshAccessToken();
                if (refreshed) {
                    // Retry the request
                    const newToken = useAuthStore.getState().accessToken;
                    headers['Authorization'] = `Bearer ${newToken}`;
                    return fetch(url, { ...options, headers });
                } else {
                    // Only logout if it wasn't a login attempt
                    if (accessToken) {
                        logout();
                        throw new Error('Session expired. Please login again.');
                    }
                }
            }

            return response;
        } catch (error) {
            clearTimeout(timeoutId);
            
            if (error.name === 'AbortError') {
                throw new Error(`Request timeout after ${this.timeout}ms`);
            }
            
            console.error('API Request Error:', error);
            throw error;
        }
    }

    async get(endpoint, params = {}, options = {}) {
        const url = Object.keys(params).length > 0 
            ? buildApiUrlWithParams(endpoint, params)
            : endpoint;
        
        const response = await this.request(url, { method: 'GET', ...options });
        return response.json();
    }

    async post(endpoint, data, options = {}) {
        const response = await this.request(endpoint, {
            method: 'POST',
            body: data instanceof FormData ? data : JSON.stringify(data),
            ...options
        });
        return response.json();
    }

    async put(endpoint, data, options = {}) {
        const response = await this.request(endpoint, {
            method: 'PUT',
            body: JSON.stringify(data),
            ...options
        });
        return response.json();
    }

    async delete(endpoint, options = {}) {
        const response = await this.request(endpoint, { method: 'DELETE', ...options });
        return response.json();
    }

    // Authentication methods
    async login(email, password) {
        return this.post(ENDPOINTS.AUTH.LOGIN, { email, password });
    }

    async register(userData) {
        return this.post(ENDPOINTS.AUTH.REGISTER, userData);
    }

    async logout() {
        return this.post(ENDPOINTS.AUTH.LOGOUT);
    }

    async getProfile() {
        return this.get(ENDPOINTS.AUTH.PROFILE);
    }

    async updateProfile(data) {
        return this.put(ENDPOINTS.AUTH.UPDATE_PROFILE, data);
    }

    async changePassword(data) {
        return this.post(ENDPOINTS.AUTH.CHANGE_PASSWORD, data);
    }

    // Address methods
    async getAddresses() {
        return this.get(ENDPOINTS.ADDRESSES.BASE);
    }

    async createAddress(data) {
        return this.post(ENDPOINTS.ADDRESSES.BASE, data);
    }

    async updateAddress(id, data) {
        return this.put(ENDPOINTS.ADDRESSES.BY_ID(id), data);
    }

    async deleteAddress(id) {
        return this.delete(ENDPOINTS.ADDRESSES.BY_ID(id));
    }

    async setDefaultAddress(id) {
        return this.post(ENDPOINTS.ADDRESSES.SET_DEFAULT(id));
    }

    // Order methods
    async getOrders() {
        return this.get(ENDPOINTS.ORDERS.BASE);
    }

    async getOrder(id) {
        return this.get(ENDPOINTS.ORDERS.BY_ID(id));
    }

    async createOrder(data) {
        return this.post(ENDPOINTS.ORDERS.BASE, data);
    }

    async cancelOrder(id) {
        return this.post(ENDPOINTS.ORDERS.CANCEL(id));
    }

    async downloadReceipt(id) {
        const response = await this.request(ENDPOINTS.ORDERS.RECEIPT(id), {
            method: 'GET',
        });
        return response.blob();
    }

    // Cart methods
    async getCart() {
        return this.get(ENDPOINTS.CART.BASE);
    }

    async addToCart(data) {
        return this.post(ENDPOINTS.CART.BASE, data);
    }

    async updateCartItem(id, data) {
        return this.put(ENDPOINTS.CART.BY_ID(id), data);
    }

    async removeFromCart(id) {
        return this.delete(ENDPOINTS.CART.BY_ID(id));
    }

    async clearCart() {
        return this.delete(ENDPOINTS.CART.CLEAR);
    }

    // Wishlist methods
    async getWishlist() {
        return this.get(ENDPOINTS.WISHLIST.BASE);
    }

    async addToWishlist(data) {
        return this.post(ENDPOINTS.WISHLIST.BASE, data);
    }

    async removeFromWishlist(id) {
        return this.delete(ENDPOINTS.WISHLIST.BY_ID(id));
    }

    async removeFromWishlistByProduct(productId) {
        return this.delete(ENDPOINTS.WISHLIST.BY_PRODUCT(productId));
    }

    async checkInWishlist(productId) {
        return this.get(ENDPOINTS.WISHLIST.CHECK(productId));
    }

    // Product methods
    async getSections() {
        return this.get(ENDPOINTS.SECTIONS.BASE);
    }

    async getProducts(params = {}) {
        return this.get(ENDPOINTS.PRODUCTS.BASE, params);
    }

    async getProduct(id) {
        return this.get(ENDPOINTS.PRODUCTS.BY_ID(id));
    }

    async getProductBySlug(slug) {
        return this.get(ENDPOINTS.PRODUCTS.BY_SLUG(slug));
    }

    async getProductsByCategory(categorySlug, params = {}) {
        return this.get(ENDPOINTS.PRODUCTS.BY_CATEGORY(categorySlug), params);
    }

    async getFeaturedProducts(limit = 8) {
        return this.get(ENDPOINTS.PRODUCTS.FEATURED, { limit });
    }

    async getNewArrivals(limit = 8) {
        return this.get(ENDPOINTS.PRODUCTS.NEW_ARRIVALS, { limit });
    }

    // Health check
    async healthCheck() {
        return this.get(ENDPOINTS.HEALTH);
    }
}

export const api = new Api();