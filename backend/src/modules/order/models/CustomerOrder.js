import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    name: { type: String, required: true },
    category: { type: String },
    isVeg: { type: Boolean, default: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
    customization: {
      size: { type: String, default: 'Medium' },
      crust: { type: String, default: 'New Hand Tossed' },
      toppings: [{ type: String }],
      addOns: [{ type: String }],
    },
    itemTotal: { type: Number, required: true },
  },
  { _id: false }
);

const customerOrderSchema = new mongoose.Schema(
  {
    orderId: { type: String, required: true, unique: true, index: true },
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    items: [orderItemSchema],
    deliveryAddress: {
      type: { type: String, default: 'Home' },
      name: { type: String, required: true },
      phone: { type: String, required: true },
      addressLine1: { type: String, required: true },
      addressLine2: { type: String, default: '' },
      landmark: { type: String, default: '' },
      city: { type: String, default: 'Bengaluru' },
      state: { type: String, default: 'Karnataka' },
      pinCode: { type: String, required: true },
    },
    pricing: {
      subtotal: { type: Number, required: true },
      discount: { type: Number, default: 0 },
      couponCode: { type: String, default: null },
      deliveryFee: { type: Number, default: 0 },
      tax: { type: Number, required: true },
      grandTotal: { type: Number, required: true },
    },
    paymentMethod: { type: String, default: 'Cash on Delivery' },
    paymentStatus: {
      type: String,
      enum: ['PENDING', 'DEMO_PAID', 'PAID', 'FAILED', 'COD', 'Pending', 'Paid'],
      default: 'PENDING',
    },
    transactionId: { type: String, default: null },
    status: {
      type: String,
      default: 'PLACED',
      index: true,
    },
    deliveryInstructions: { type: String, default: '' },
    estimatedDeliveryMinutes: { type: Number, default: 30 },
    statusTimeline: [
      {
        status: { type: String },
        timestamp: { type: Date, default: Date.now },
        description: { type: String },
      },
    ],
  },
  {
    timestamps: true,
    collection: 'customer_orders'
  }
);

export const CustomerOrder = mongoose.models.CustomerOrder || mongoose.model('CustomerOrder', customerOrderSchema);
