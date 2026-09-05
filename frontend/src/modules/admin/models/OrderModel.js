// src/models/OrderModel.js

/**
 * Order entity model.
 * Seamlessly normalizes Domino's order documents for the Admin Dashboard.
 */
export class OrderModel {
  constructor(data = {}) {
    this.id = data.orderId || data.id || data._id || '';
    this.orderId = this.id;
    this.customerId = data.customerId || '';
    
    // Customer Name & Contact
    this.customerName = data.deliveryAddress?.name || data.customerName || 'Customer';
    this.phone = data.deliveryAddress?.phone || data.phone || '';
    this.deliveryAddress = data.deliveryAddress || null;
    
    // Items
    this.items = data.items || [];
    this.rawItems = data.items || [];
    
    // Pricing
    this.total = Number(data.pricing?.grandTotal ?? data.total ?? 0);
    this.pricing = data.pricing || {
      subtotal: this.total,
      discount: 0,
      tax: 0,
      deliveryFee: 0,
      grandTotal: this.total,
    };

    // Statuses
    this.paymentMethod = data.paymentMethod || 'Razorpay Online';
    this.paymentStatus = data.paymentStatus || 'PAID';
    this.status = data.status || data.deliveryStatus || 'Order Placed';
    this.deliveryStatus = this.status;
    this.statusTimeline = data.statusTimeline || [];
    this.createdAt = data.createdAt || new Date().toISOString();
  }

  /** Check if order is active (not delivered/cancelled) */
  get isActive() {
    const st = (this.deliveryStatus || this.status || '').toLowerCase();
    return !st.includes('deliver') && !st.includes('cancel');
  }

  /** Get formatted items string */
  get itemsDisplay() {
    if (!this.items || this.items.length === 0) return 'No items';
    if (typeof this.items[0] === 'string') return this.items.join(', ');
    return this.items.map((i) => `${i.name || 'Item'} x${i.quantity || 1}`).join(', ');
  }
}

export default OrderModel;
