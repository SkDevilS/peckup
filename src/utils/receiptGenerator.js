/**
 * Receipt Generator Utility
 * Handles receipt number generation and receipt data formatting
 */

/**
 * Generate a unique receipt number
 * Format: RCP-YYYYMMDD-HHMMSS-XXX
 * Where XXX is a random 3-digit number
 */
export const generateReceiptNumber = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const random = String(Math.floor(Math.random() * 1000)).padStart(3, '0');
    
    return `RCP-${year}${month}${day}-${hours}${minutes}${seconds}-${random}`;
};

/**
 * Generate order number if not provided
 * Format: ORD-YYYYMMDD-XXXXX
 * Where XXXXX is a random 5-digit number
 */
export const generateOrderNumber = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const random = String(Math.floor(Math.random() * 100000)).padStart(5, '0');
    
    return `ORD-${year}${month}${day}-${random}`;
};

/**
 * Format order data for receipt display
 * Ensures all required fields are present with proper formatting
 */
export const formatOrderForReceipt = (orderData) => {
    const now = new Date();
    
    return {
        // Basic order info
        id: orderData.id,
        order_number: orderData.order_number || generateOrderNumber(),
        receipt_number: orderData.receipt_number || generateReceiptNumber(),
        created_at: orderData.created_at || now.toISOString(),
        
        // Financial info
        total_amount: parseFloat(orderData.total_amount || 0),
        subtotal: parseFloat(orderData.subtotal || orderData.total_amount || 0),
        shipping_cost: parseFloat(orderData.shipping_cost || 0),
        tax_amount: parseFloat(orderData.tax_amount || 0),
        discount_amount: parseFloat(orderData.discount_amount || 0),
        
        // Payment info
        payment_method: orderData.payment_method || 'cod',
        payment_status: orderData.payment_status || (orderData.payment_method === 'cod' ? 'pending' : 'completed'),
        
        // Order items
        order_items: (orderData.order_items || orderData.items || []).map(item => ({
            product_name: item.product_name || item.title || item.name,
            quantity: parseInt(item.quantity || 1),
            price: parseFloat(item.price || 0),
            size: item.size || item.selectedSize,
            color: item.color || item.selectedColor,
            sku: item.sku || item.product_sku
        })),
        
        // Shipping address
        shipping_address: orderData.shipping_address || orderData.address || null,
        
        // Status
        status: orderData.status || 'pending',
        
        // Customer info
        customer: orderData.customer || orderData.user || null
    };
};

/**
 * Calculate order totals from items
 */
export const calculateOrderTotals = (items, shippingCost = 0, taxRate = 0) => {
    const subtotal = items.reduce((sum, item) => {
        return sum + (parseFloat(item.price || 0) * parseInt(item.quantity || 1));
    }, 0);
    
    const taxAmount = subtotal * (taxRate / 100);
    const totalAmount = subtotal + shippingCost + taxAmount;
    
    return {
        subtotal: parseFloat(subtotal.toFixed(2)),
        shipping_cost: parseFloat(shippingCost.toFixed(2)),
        tax_amount: parseFloat(taxAmount.toFixed(2)),
        total_amount: parseFloat(totalAmount.toFixed(2))
    };
};

/**
 * Validate receipt data before generation
 */
export const validateReceiptData = (orderData) => {
    const errors = [];
    
    if (!orderData) {
        errors.push('Order data is required');
        return { isValid: false, errors };
    }
    
    if (!orderData.order_number && !orderData.id) {
        errors.push('Order number or ID is required');
    }
    
    if (!orderData.total_amount && orderData.total_amount !== 0) {
        errors.push('Total amount is required');
    }
    
    if (!orderData.order_items || !Array.isArray(orderData.order_items) || orderData.order_items.length === 0) {
        errors.push('Order items are required');
    }
    
    // Validate each order item
    if (orderData.order_items) {
        orderData.order_items.forEach((item, index) => {
            if (!item.product_name && !item.title && !item.name) {
                errors.push(`Item ${index + 1}: Product name is required`);
            }
            if (!item.quantity || item.quantity <= 0) {
                errors.push(`Item ${index + 1}: Valid quantity is required`);
            }
            if (item.price === undefined || item.price === null || item.price < 0) {
                errors.push(`Item ${index + 1}: Valid price is required`);
            }
        });
    }
    
    return {
        isValid: errors.length === 0,
        errors
    };
};

/**
 * Generate receipt metadata
 */
export const generateReceiptMetadata = (orderData) => {
    const now = new Date();
    
    return {
        generated_at: now.toISOString(),
        generated_by: 'Peckup E-commerce System',
        receipt_version: '1.0',
        company_info: {
            name: 'PECKUP PRIVATE LIMITED',
            email: 'support@peckup.in',
            website: 'www.peckup.in'
        }
    };
};

/**
 * Format currency for display
 */
export const formatCurrency = (amount, currency = 'INR') => {
    const numAmount = parseFloat(amount || 0);
    
    if (currency === 'INR') {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 2
        }).format(numAmount);
    }
    
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 2
    }).format(numAmount);
};

/**
 * Format date for receipt display
 */
export const formatReceiptDate = (dateString, locale = 'en-IN') => {
    const date = new Date(dateString);
    
    return {
        date: date.toLocaleDateString(locale, {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }),
        time: date.toLocaleTimeString(locale, {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        }),
        full: date.toLocaleDateString(locale, {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        })
    };
};

/**
 * Generate downloadable receipt filename
 */
export const generateReceiptFilename = (orderData, format = 'html') => {
    const orderNumber = orderData.order_number || orderData.receipt_number || orderData.id || 'unknown';
    const date = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
    
    return `peckup-receipt-${orderNumber}-${date}.${format}`;
};

export default {
    generateReceiptNumber,
    generateOrderNumber,
    formatOrderForReceipt,
    calculateOrderTotals,
    validateReceiptData,
    generateReceiptMetadata,
    formatCurrency,
    formatReceiptDate,
    generateReceiptFilename
};