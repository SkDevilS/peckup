import { API_CONFIG, buildApiUrl, buildApiUrlWithParams, ENDPOINTS } from '../config/api.config';

class AdminAPI {
    constructor() {
        this.baseURL = API_CONFIG.API_URL;
        this.timeout = API_CONFIG.TIMEOUT;
    }

    getAdminToken() {
        // Try to get token from admin auth store first
        try {
            const adminAuth = JSON.parse(localStorage.getItem('peckup-admin-auth') || '{}');
            return adminAuth.state?.accessToken || adminAuth.accessToken;
        } catch (error) {
            console.warn('Failed to parse admin auth from localStorage:', error);
            return null;
        }
    }

    async request(endpoint, options = {}) {
        const adminToken = this.getAdminToken();

        const headers = {
            'Content-Type': 'application/json',
            ...options.headers,
        };

        if (adminToken) {
            headers['Authorization'] = `Bearer ${adminToken}`;
        }

        // Remove Content-Type for FormData
        if (options.body instanceof FormData) {
            delete headers['Content-Type'];
        }

        const url = endpoint.startsWith('http') ? endpoint : buildApiUrl(endpoint);
        
        // Add timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.timeout);

        try {
            const response = await fetch(url, {
                ...options,
                headers,
                signal: controller.signal,
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            return { success: true, data };
        } catch (error) {
            clearTimeout(timeoutId);
            
            if (error.name === 'AbortError') {
                throw new Error(`Request timeout after ${this.timeout}ms`);
            }
            
            console.error('Admin API Request Error:', {
                url,
                error: error.message,
                endpoint,
                options
            });
            return { success: false, error: error.message };
        }
    }

    async get(endpoint, params = {}) {
        const url = Object.keys(params).length > 0 
            ? buildApiUrlWithParams(endpoint, params)
            : endpoint;
        
        return this.request(url, { method: 'GET' });
    }

    async post(endpoint, data) {
        return this.request(endpoint, {
            method: 'POST',
            body: data instanceof FormData ? data : JSON.stringify(data),
        });
    }

    async put(endpoint, data) {
        return this.request(endpoint, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }

    async delete(endpoint) {
        return this.request(endpoint, { method: 'DELETE' });
    }

    // Authentication
    async login(email, password) {
        const result = await this.post(ENDPOINTS.ADMIN.LOGIN, { email, password });
        
        // Store admin token in localStorage for adminApi to use
        if (result.success && result.data.access_token) {
            // The admin auth store will handle this, but we can also store it directly
            localStorage.setItem('admin_token', result.data.access_token);
        }
        
        return result;
    }

    async logout() {
        const result = await this.post(ENDPOINTS.ADMIN.LOGOUT);
        localStorage.removeItem('admin_token');
        return result;
    }

    async getProfile() {
        return this.get(ENDPOINTS.ADMIN.PROFILE);
    }

    // Dashboard Stats
    async getStats() {
        return this.get(ENDPOINTS.ADMIN.STATS);
    }

    async getOrderStats() {
        return this.get('/admin/orders/stats');
    }

    // Users Management
    async getUsers(params = {}) {
        return this.get(ENDPOINTS.ADMIN.USERS, params);
    }

    async createUser(userData) {
        return this.post(ENDPOINTS.ADMIN.USERS, userData);
    }

    async updateUser(userId, userData) {
        return this.put(ENDPOINTS.ADMIN.USER_BY_ID(userId), userData);
    }

    async deleteUser(userId) {
        return this.delete(ENDPOINTS.ADMIN.USER_BY_ID(userId));
    }

    async toggleUserStatus(userId) {
        return this.post(ENDPOINTS.ADMIN.TOGGLE_USER_STATUS(userId));
    }

    // Products Management
    async getProducts(params = {}) {
        return this.get(ENDPOINTS.ADMIN.PRODUCTS, params);
    }

    async createProduct(productData) {
        return this.post(ENDPOINTS.ADMIN.PRODUCTS, productData);
    }

    async updateProduct(productId, productData) {
        return this.put(ENDPOINTS.ADMIN.PRODUCT_BY_ID(productId), productData);
    }

    async deleteProduct(productId) {
        return this.delete(ENDPOINTS.ADMIN.PRODUCT_BY_ID(productId));
    }

    async toggleProductStatus(productId) {
        return this.post(ENDPOINTS.ADMIN.TOGGLE_PRODUCT_STATUS(productId));
    }

    async bulkUploadProducts(file) {
        const formData = new FormData();
        formData.append('excel_file', file);
        
        return this.post(ENDPOINTS.ADMIN.BULK_UPLOAD, formData);
    }

    // Sections Management
    async getSections() {
        return this.get(ENDPOINTS.ADMIN.SECTIONS);
    }

    async createSection(sectionData) {
        return this.post(ENDPOINTS.ADMIN.SECTIONS, sectionData);
    }

    async updateSection(sectionId, sectionData) {
        return this.put(ENDPOINTS.ADMIN.SECTION_BY_ID(sectionId), sectionData);
    }

    async deleteSection(sectionId) {
        return this.delete(ENDPOINTS.ADMIN.SECTION_BY_ID(sectionId));
    }

    async toggleSectionStatus(sectionId) {
        return this.post(ENDPOINTS.ADMIN.TOGGLE_SECTION_STATUS(sectionId));
    }

    async updateSectionOrder(sections) {
        return this.post(ENDPOINTS.ADMIN.UPDATE_SECTION_ORDER, { sections });
    }

    // Orders Management
    async getOrders(params = {}) {
        return this.get(ENDPOINTS.ADMIN.ORDERS, params);
    }

    async getOrder(orderId) {
        return this.get(ENDPOINTS.ADMIN.ORDER_BY_ID(orderId));
    }

    async updateOrderStatus(orderId, status) {
        return this.put(ENDPOINTS.ADMIN.UPDATE_ORDER_STATUS(orderId), { status });
    }

    async deleteOrder(orderId) {
        return this.delete(ENDPOINTS.ADMIN.ORDER_BY_ID(orderId));
    }

    // File Upload
    async uploadImage(file) {
        const formData = new FormData();
        formData.append('image', file);
        
        return this.post(ENDPOINTS.ADMIN.UPLOAD_IMAGE, formData);
    }

    async bulkUploadImages(files) {
        const formData = new FormData();
        files.forEach((file) => {
            formData.append('images', file);
        });
        
        return this.post(ENDPOINTS.ADMIN.UPLOAD_BULK_IMAGES, formData);
    }

    // Reports
    async getSalesReport(startDate, endDate) {
        return this.get(ENDPOINTS.ADMIN.SALES_REPORT, { 
            start_date: startDate, 
            end_date: endDate 
        });
    }

    async getInventoryReport() {
        return this.get(ENDPOINTS.ADMIN.INVENTORY_REPORT);
    }

    // Health check
    async healthCheck() {
        return this.get(ENDPOINTS.HEALTH);
    }
}

export const adminApi = new AdminAPI();