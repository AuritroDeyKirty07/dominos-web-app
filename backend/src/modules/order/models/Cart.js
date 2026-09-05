import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema(
  {
    cartItemId: { type: String, required: true },
    id: { type: String, required: true },
    name: { type: String, required: true },
    image: { type: String },
    category: { type: String },
    isVeg: { type: Boolean, default: true },
    unitPrice: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 1, default: 1 },
    customization: {
      size: { type: String, default: 'Medium' },
      crust: { type: String, default: 'New Hand Tossed' },
      toppings: [{ type: String }],
      addOns: [{ type: String }],
    },
  },
  { _id: false }
);

const cartSchema = new mongoose.Schema(
  {
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true, index: true },
    items: [cartItemSchema],
    appliedCoupon: {
      code: { type: String, default: null },
      discountAmount: { type: Number, default: 0 },
    },
    subtotal: { type: Number, default: 0 },
    deliveryFee: { type: Number, default: 0 },
    taxes: { type: Number, default: 0 },
    grandTotal: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

export const Cart = mongoose.models.Cart || mongoose.model('Cart', cartSchema);
