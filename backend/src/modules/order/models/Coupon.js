import mongoose from 'mongoose';

const couponSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true, uppercase: true, trim: true, index: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    discountType: { type: String, enum: ['percentage', 'flat'], required: true },
    discountValue: { type: Number, required: true, min: 0 },
    maxDiscount: { type: Number, required: true, min: 0 },
    minOrderValue: { type: Number, required: true, min: 0 },
    badge: { type: String, default: 'Special Offer' },
    isActive: { type: Boolean, default: true },
    expiry: { type: String, default: 'Limited Time Offer' },
  },
  {
    timestamps: true,
  }
);

export const Coupon = mongoose.models.Coupon || mongoose.model('Coupon', couponSchema);
