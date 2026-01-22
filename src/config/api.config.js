/**
 * API Configuration for Peckup Frontend
 * 
 * This file centralizes all API endpoint configurations.
 * Change the BASE_URL to point to your backend server.
 */

// Environment-based configuration
const getApiConfig = () => {
  // Check if we're in development, staging, or production
  const isDevelopment = import.meta.env.DEV;
  const isProduction = import.meta.env.PROD;
  
  // You can override these URLs based on your deployment
  const configs = {
    development: {
      BASE_URL: 'http://localhost:5000',
      API_PREFIX: '/api',
      TIMEOUT: 10000, // 10 seconds
      RETRY_ATTEMPTS: 3,
      RETRY_DELAY: 1000, // 1 second
    },
    production: {
      BASE_URL: 'https://api.peckup.in', // Production API URL
      API_PREFIX: '/api',
      TIMEOUT: 15000, // 15 seconds
      RETRY_ATTEMPTS: 2,
      RETRY_DELAY: 2000, // 2 seconds
    },
    staging: {
      BASE_URL: 'https://staging.your-domain.com', // Change this to your staging URL
      API_PREFIX: '/api',
      TIMEOUT: 12000, // 12 seconds
      RETRY_ATTEMPTS: 2,
      RETRY_DELAY: 1500, // 1.5 seconds
    }
  };

  // Override with environment variables if available
  const envBaseUrl = import.meta.env.VITE_API_BASE_URL;
  const envApiPrefix = import.meta.env.VITE_API_PREFIX;
  
  let config;
  if (isProduction) {
    config = configs.production;
  } else if (import.meta.env.VITE_APP_ENV === 'staging') {
    config = configs.staging;
  } else {
    config = configs.development;
  }

  // Override with environment variables if provided
  if (envBaseUrl) {
    config.BASE_URL = envBaseUrl;
  }
  if (envApiPrefix) {
    config.API_PREFIX = envApiPrefix;
  }

  return config;
};

// Get the current configuration
const config = getApiConfig();

// Export the main API configuration
export const API_CONFIG = {
  // Base URLs
  BASE_URL: config.BASE_URL,
  API_URL: `${config.BASE_URL}${config.API_PREFIX}`,
  
  // Timeouts and retries
  TIMEOUT: config.TIMEOUT,
  RETRY_ATTEMPTS: config.RETRY_ATTEMPTS,
  RETRY_DELAY: config.RETRY_DELAY,
  
  // Endpoints
  ENDPOINTS: {
    // Authentication
    AUTH: {
      LOGIN: '/auth/login',
      REGISTER: '/auth/register',
      LOGOUT: '/auth/logout',
      REFRESH: '/auth/refresh',
      PROFILE: '/auth/me',
      UPDATE_PROFILE: '/auth/profile',
      CHANGE_PASSWORD: '/auth/change-password',
      FORGOT_PASSWORD: '/auth/forgot-password',
      RESET_PASSWORD: '/auth/reset-password',
    },
    
    // User Management
    USERS: {
      BASE: '/users',
      BY_ID: (id) => `/users/${id}`,
      PROFILE: '/users/profile',
    },
    
    // Products
    PRODUCTS: {
      BASE: '/products',
      BY_ID: (id) => `/products/${id}`,
      BY_SLUG: (slug) => `/products/slug/${slug}`,
      BY_CATEGORY: (categorySlug) => `/products/category/${categorySlug}`,
      FEATURED: '/products/featured',
      NEW_ARRIVALS: '/products/new-arrivals',
      SEARCH: '/products/search',
    },
    
    // Categories/Sections
    SECTIONS: {
      BASE: '/sections',
      BY_ID: (id) => `/sections/${id}`,
      BY_SLUG: (slug) => `/sections/slug/${slug}`,
    },
    
    // Cart
    CART: {
      BASE: '/cart',
      BY_ID: (id) => `/cart/${id}`,
      CLEAR: '/cart/clear',
      COUNT: '/cart/count',
    },
    
    // Wishlist
    WISHLIST: {
      BASE: '/wishlist',
      BY_ID: (id) => `/wishlist/${id}`,
      BY_PRODUCT: (productId) => `/wishlist/product/${productId}`,
      CHECK: (productId) => `/wishlist/check/${productId}`,
    },
    
    // Orders
    ORDERS: {
      BASE: '/orders',
      BY_ID: (id) => `/orders/${id}`,
      CANCEL: (id) => `/orders/${id}/cancel`,
      RECEIPT: (id) => `/orders/${id}/receipt`,
      TRACK: (id) => `/orders/${id}/track`,
    },
    
    // Addresses
    ADDRESSES: {
      BASE: '/addresses',
      BY_ID: (id) => `/addresses/${id}`,
      SET_DEFAULT: (id) => `/addresses/${id}/set-default`,
    },
    
    // Admin
    ADMIN: {
      // Auth
      LOGIN: '/auth/admin/login',
      LOGOUT: '/admin/logout',
      PROFILE: '/admin/me',
      
      // Dashboard
      STATS: '/admin/stats',
      ORDER_STATS: '/admin/orders/stats',
      
      // Users
      USERS: '/admin/users',
      USER_BY_ID: (id) => `/admin/users/${id}`,
      TOGGLE_USER_STATUS: (id) => `/admin/users/${id}/toggle-status`,
      
      // Products
      PRODUCTS: '/admin/products',
      PRODUCT_BY_ID: (id) => `/admin/products/${id}`,
      TOGGLE_PRODUCT_STATUS: (id) => `/admin/products/${id}/toggle-status`,
      BULK_UPLOAD: '/admin/bulk-upload-products',
      
      // Sections
      SECTIONS: '/admin/sections',
      SECTION_BY_ID: (id) => `/admin/sections/${id}`,
      TOGGLE_SECTION_STATUS: (id) => `/admin/sections/${id}/toggle-status`,
      UPDATE_SECTION_ORDER: '/admin/sections/update-order',
      
      // Orders
      ORDERS: '/admin/orders',
      ORDER_BY_ID: (id) => `/admin/orders/${id}`,
      UPDATE_ORDER_STATUS: (id) => `/admin/orders/${id}/status`,
      
      // File Upload
      UPLOAD_IMAGE: '/admin/upload-image',
      UPLOAD_BULK_IMAGES: '/admin/bulk-upload-images',
      
      // Reports
      SALES_REPORT: '/admin/reports/sales',
      INVENTORY_REPORT: '/admin/reports/inventory',
    },
    
    // Utility
    HEALTH: '/health',
    VERSION: '/version',
  }
};

// Helper function to build full URL
export const buildApiUrl = (endpoint) => {
  return `${API_CONFIG.API_URL}${endpoint}`;
};

// Helper function to build full URL with query parameters
export const buildApiUrlWithParams = (endpoint, params = {}) => {
  const url = buildApiUrl(endpoint);
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      searchParams.append(key, value);
    }
  });
  
  const queryString = searchParams.toString();
  return queryString ? `${url}?${queryString}` : url;
};

// Export individual configurations for easy access
export const {
  BASE_URL,
  API_URL,
  TIMEOUT,
  RETRY_ATTEMPTS,
  RETRY_DELAY,
  ENDPOINTS
} = API_CONFIG;

// Development helpers
export const isDevelopment = import.meta.env.DEV;
export const isProduction = import.meta.env.PROD;

// Console log configuration in development
if (isDevelopment) {
  console.log('🔧 API Configuration:', {
    BASE_URL: API_CONFIG.BASE_URL,
    API_URL: API_CONFIG.API_URL,
    TIMEOUT: API_CONFIG.TIMEOUT,
    Environment: isProduction ? 'Production' : 'Development'
  });
}