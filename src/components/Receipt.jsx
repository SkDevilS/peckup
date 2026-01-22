import React from 'react';
import { formatPrice } from '../utils/priceFormatter';
import { 
    formatOrderForReceipt, 
    validateReceiptData, 
    generateReceiptFilename,
    formatReceiptDate 
} from '../utils/receiptGenerator';

const Receipt = ({ orderData, onDownload, onClose }) => {
    // Format and validate order data
    const formattedOrder = formatOrderForReceipt(orderData);
    const validation = validateReceiptData(formattedOrder);
    
    if (!validation.isValid) {
        console.error('Invalid receipt data:', validation.errors);
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-lg p-6 max-w-md">
                    <h3 className="text-lg font-semibold text-red-600 mb-2">Receipt Error</h3>
                    <p className="text-gray-600 mb-4">Unable to generate receipt due to missing data.</p>
                    <button onClick={onClose} className="px-4 py-2 bg-gray-500 text-white rounded-lg">
                        Close
                    </button>
                </div>
            </div>
        );
    }
    const generateReceiptHTML = () => {
        const receiptDate = formatReceiptDate(new Date().toISOString());

        return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Receipt - ${orderData.order_number}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Arial', sans-serif;
            line-height: 1.6;
            color: #333;
            background: #f8f9fa;
            padding: 20px;
        }
        
        .receipt-container {
            max-width: 600px;
            margin: 0 auto;
            background: white;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.1);
            overflow: hidden;
        }
        
        .receipt-header {
            background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%);
            color: white;
            padding: 30px;
            text-align: center;
        }
        
        .company-name {
            font-size: 28px;
            font-weight: bold;
            margin-bottom: 8px;
            letter-spacing: 1px;
        }
        
        .company-tagline {
            font-size: 14px;
            opacity: 0.9;
            margin-bottom: 4px;
        }
        
        .support-email {
            font-size: 12px;
            opacity: 0.8;
        }
        
        .receipt-title {
            font-size: 24px;
            font-weight: bold;
            margin-top: 20px;
            text-transform: uppercase;
            letter-spacing: 2px;
        }
        
        .receipt-body {
            padding: 30px;
        }
        
        .order-info {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-bottom: 30px;
            padding: 20px;
            background: #f8f9fa;
            border-radius: 8px;
        }
        
        .info-group h4 {
            color: #666;
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 8px;
        }
        
        .info-group p {
            font-size: 14px;
            font-weight: 600;
            color: #333;
        }
        
        .items-section {
            margin-bottom: 30px;
        }
        
        .section-title {
            font-size: 18px;
            font-weight: bold;
            color: #333;
            margin-bottom: 15px;
            padding-bottom: 8px;
            border-bottom: 2px solid #ff6b35;
        }
        
        .items-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }
        
        .items-table th {
            background: #f8f9fa;
            padding: 12px;
            text-align: left;
            font-weight: 600;
            color: #666;
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            border-bottom: 2px solid #e9ecef;
        }
        
        .items-table td {
            padding: 12px;
            border-bottom: 1px solid #e9ecef;
            font-size: 14px;
        }
        
        .item-name {
            font-weight: 600;
            color: #333;
        }
        
        .item-details {
            font-size: 12px;
            color: #666;
            margin-top: 4px;
        }
        
        .price-cell {
            text-align: right;
            font-weight: 600;
        }
        
        .totals-section {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 30px;
        }
        
        .total-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 8px 0;
            font-size: 14px;
        }
        
        .total-row.subtotal {
            color: #666;
        }
        
        .total-row.shipping {
            color: #666;
            border-bottom: 1px solid #dee2e6;
            padding-bottom: 12px;
            margin-bottom: 12px;
        }
        
        .total-row.final {
            font-size: 18px;
            font-weight: bold;
            color: #333;
            border-top: 2px solid #ff6b35;
            padding-top: 12px;
            margin-top: 12px;
        }
        
        .shipping-address {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 30px;
        }
        
        .address-title {
            font-weight: 600;
            color: #333;
            margin-bottom: 12px;
        }
        
        .address-details {
            color: #666;
            line-height: 1.6;
        }
        
        .payment-info {
            background: #e8f5e8;
            padding: 20px;
            border-radius: 8px;
            border-left: 4px solid #28a745;
            margin-bottom: 30px;
        }
        
        .payment-method {
            font-weight: 600;
            color: #155724;
            margin-bottom: 8px;
        }
        
        .payment-status {
            font-size: 14px;
            color: #155724;
        }
        
        .footer-note {
            text-align: center;
            padding: 20px;
            background: #f8f9fa;
            color: #666;
            font-size: 12px;
            line-height: 1.6;
        }
        
        .thank-you {
            font-size: 16px;
            font-weight: 600;
            color: #ff6b35;
            margin-bottom: 10px;
        }
        
        .contact-info {
            margin-top: 15px;
            padding-top: 15px;
            border-top: 1px solid #dee2e6;
        }
        
        @media print {
            body {
                background: white;
                padding: 0;
            }
            
            .receipt-container {
                box-shadow: none;
                border-radius: 0;
            }
        }
        
        @media (max-width: 600px) {
            .order-info {
                grid-template-columns: 1fr;
                gap: 15px;
            }
            
            .receipt-body {
                padding: 20px;
            }
            
            .items-table {
                font-size: 12px;
            }
            
            .items-table th,
            .items-table td {
                padding: 8px 4px;
            }
        }
    </style>
</head>
<body>
    <div class="receipt-container">
        <div class="receipt-header">
            <div class="company-name">PECKUP PRIVATE LIMITED</div>
            <div class="company-tagline">Your Trusted Shopping Partner</div>
            <div class="support-email">support@peckup.in</div>
            <div class="receipt-title">Order Receipt</div>
        </div>
        
        <div class="receipt-body">
            <div class="order-info">
                <div class="info-group">
                    <h4>Order Number</h4>
                    <p>${formattedOrder.order_number}</p>
                </div>
                <div class="info-group">
                    <h4>Receipt Number</h4>
                    <p>${formattedOrder.receipt_number}</p>
                </div>
                <div class="info-group">
                    <h4>Order Date</h4>
                    <p>${formatReceiptDate(formattedOrder.created_at).date}</p>
                </div>
                <div class="info-group">
                    <h4>Receipt Generated</h4>
                    <p>${receiptDate.full}</p>
                </div>
            </div>
            
            <div class="items-section">
                <h3 class="section-title">Order Items</h3>
                <table class="items-table">
                    <thead>
                        <tr>
                            <th>Item</th>
                            <th>Qty</th>
                            <th>Price</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${formattedOrder.order_items?.map(item => `
                            <tr>
                                <td>
                                    <div class="item-name">${item.product_name}</div>
                                    ${item.size ? `<div class="item-details">Size: ${item.size}</div>` : ''}
                                    ${item.color ? `<div class="item-details">Color: ${item.color}</div>` : ''}
                                </td>
                                <td>${item.quantity}</td>
                                <td class="price-cell">₹${item.price.toFixed(2)}</td>
                                <td class="price-cell">₹${(item.quantity * item.price).toFixed(2)}</td>
                            </tr>
                        `).join('') || ''}
                    </tbody>
                </table>
            </div>
            
            <div class="totals-section">
                <div class="total-row subtotal">
                    <span>Subtotal</span>
                    <span>₹${formattedOrder.subtotal?.toFixed(2)}</span>
                </div>
                <div class="total-row shipping">
                    <span>Shipping & Handling</span>
                    <span>₹${formattedOrder.shipping_cost?.toFixed(2)}</span>
                </div>
                <div class="total-row final">
                    <span>Total Amount</span>
                    <span>₹${formattedOrder.total_amount.toFixed(2)}</span>
                </div>
            </div>
            
            ${formattedOrder.shipping_address ? `
            <div class="shipping-address">
                <h3 class="section-title">Shipping Address</h3>
                <div class="address-details">
                    <strong>${formattedOrder.shipping_address.full_name}</strong><br>
                    ${formattedOrder.shipping_address.address_line1}<br>
                    ${formattedOrder.shipping_address.address_line2 ? `${formattedOrder.shipping_address.address_line2}<br>` : ''}
                    ${formattedOrder.shipping_address.city}, ${formattedOrder.shipping_address.state} - ${formattedOrder.shipping_address.pincode}<br>
                    Phone: ${formattedOrder.shipping_address.phone}
                </div>
            </div>
            ` : ''}
            
            <div class="payment-info">
                <div class="payment-method">Payment Method: ${formattedOrder.payment_method?.toUpperCase()}</div>
                <div class="payment-status">
                    Status: ${formattedOrder.payment_status === 'completed' ? 'Payment Completed' : 
                             formattedOrder.payment_method === 'cod' ? 'Cash on Delivery' : 'Payment Pending'}
                </div>
            </div>
        </div>
        
        <div class="footer-note">
            <div class="thank-you">Thank you for shopping with Peckup!</div>
            <p>This is a computer-generated receipt and does not require a signature.</p>
            <p>For any queries regarding your order, please contact us at support@peckup.in</p>
            
            <div class="contact-info">
                <strong>PECKUP PRIVATE LIMITED</strong><br>
                Email: support@peckup.in<br>
                Website: www.peckup.in
            </div>
        </div>
    </div>
</body>
</html>`;
    };

    const handleDownload = () => {
        const receiptHTML = generateReceiptHTML();
        const blob = new Blob([receiptHTML], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = generateReceiptFilename(formattedOrder, 'html');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        if (onDownload) onDownload();
    };

    const handlePrint = () => {
        const receiptHTML = generateReceiptHTML();
        const printWindow = window.open('', '_blank');
        printWindow.document.write(receiptHTML);
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 text-center">
                    <h2 className="text-2xl font-bold mb-2">PECKUP PRIVATE LIMITED</h2>
                    <p className="text-orange-100 text-sm mb-1">Your Trusted Shopping Partner</p>
                    <p className="text-orange-100 text-xs">support@peckup.in</p>
                    <h3 className="text-xl font-bold mt-4 tracking-wider">ORDER RECEIPT</h3>
                </div>

                {/* Receipt Content */}
                <div className="p-6 overflow-y-auto max-h-[60vh]">
                    {/* Order Info */}
                    <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                        <div>
                            <h4 className="text-xs text-gray-600 uppercase tracking-wide mb-1">Order Number</h4>
                            <p className="font-semibold">{formattedOrder.order_number}</p>
                        </div>
                        <div>
                            <h4 className="text-xs text-gray-600 uppercase tracking-wide mb-1">Receipt Number</h4>
                            <p className="font-semibold">{formattedOrder.receipt_number}</p>
                        </div>
                        <div>
                            <h4 className="text-xs text-gray-600 uppercase tracking-wide mb-1">Order Date</h4>
                            <p className="font-semibold">{formatReceiptDate(formattedOrder.created_at).date}</p>
                        </div>
                        <div>
                            <h4 className="text-xs text-gray-600 uppercase tracking-wide mb-1">Receipt Generated</h4>
                            <p className="font-semibold">{formatReceiptDate(new Date().toISOString()).date}</p>
                        </div>
                    </div>

                    {/* Order Items */}
                    <div className="mb-6">
                        <h3 className="text-lg font-bold mb-3 pb-2 border-b-2 border-orange-500">Order Items</h3>
                        <div className="space-y-3">
                            {formattedOrder.order_items?.map((item, index) => (
                                <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100">
                                    <div className="flex-1">
                                        <p className="font-medium">{item.product_name}</p>
                                        <div className="text-sm text-gray-600">
                                            {item.size && <span>Size: {item.size} </span>}
                                            {item.color && <span>Color: {item.color}</span>}
                                        </div>
                                        <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold">₹{(item.quantity * item.price).toFixed(2)}</p>
                                        <p className="text-sm text-gray-600">₹{item.price.toFixed(2)} each</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Totals */}
                    <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                        <div className="flex justify-between py-2">
                            <span>Subtotal</span>
                            <span>₹{formattedOrder.subtotal?.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-gray-300">
                            <span>Shipping & Handling</span>
                            <span>₹{formattedOrder.shipping_cost?.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between py-3 text-lg font-bold border-t-2 border-orange-500 mt-2">
                            <span>Total Amount</span>
                            <span>₹{formattedOrder.total_amount.toFixed(2)}</span>
                        </div>
                    </div>

                    {/* Shipping Address */}
                    {formattedOrder.shipping_address && (
                        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                            <h3 className="font-bold mb-2">Shipping Address</h3>
                            <div className="text-sm text-gray-700">
                                <p className="font-medium">{formattedOrder.shipping_address.full_name}</p>
                                <p>{formattedOrder.shipping_address.address_line1}</p>
                                {formattedOrder.shipping_address.address_line2 && <p>{formattedOrder.shipping_address.address_line2}</p>}
                                <p>{formattedOrder.shipping_address.city}, {formattedOrder.shipping_address.state} - {formattedOrder.shipping_address.pincode}</p>
                                <p>Phone: {formattedOrder.shipping_address.phone}</p>
                            </div>
                        </div>
                    )}

                    {/* Payment Info */}
                    <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 rounded">
                        <div className="font-semibold text-green-800">Payment Method: {formattedOrder.payment_method?.toUpperCase()}</div>
                        <div className="text-sm text-green-700">
                            Status: {formattedOrder.payment_status === 'completed' ? 'Payment Completed' : 
                                   formattedOrder.payment_method === 'cod' ? 'Cash on Delivery' : 'Payment Pending'}
                        </div>
                    </div>

                    {/* Footer Note */}
                    <div className="text-center text-sm text-gray-600 border-t pt-4">
                        <p className="font-semibold text-orange-600 mb-2">Thank you for shopping with Peckup!</p>
                        <p>This is a computer-generated receipt and does not require a signature.</p>
                        <p>For any queries regarding your order, please contact us at support@peckup.in</p>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="p-6 border-t bg-gray-50 flex gap-3 justify-end">
                    <button
                        onClick={handlePrint}
                        className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                        </svg>
                        Print
                    </button>
                    <button
                        onClick={handleDownload}
                        className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-2"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Download
                    </button>
                    <button
                        onClick={onClose}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Receipt;