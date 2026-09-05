import { Coupon } from '../models/Coupon.js';

export const getAllCoupons = async () => {
  try {
    const dbCoupons = await Coupon.find({ isActive: true });
    return dbCoupons;
  } catch (err) {
    throw new Error('Failed to fetch coupons');
  }
};

export const validateCouponCode = async (code, subtotal = 0) => {
  if (!code || typeof code !== 'string') {
    return { isValid: false, message: 'Please provide a valid coupon code' };
  }

  const cleanCode = code.trim().toUpperCase();
  const all = await getAllCoupons();
  const coupon = all.find(c => c.code.toUpperCase() === cleanCode);

  if (!coupon) {
    return {
      isValid: false,
      message: "Invalid coupon '" + cleanCode + "'. Try DOMINOS50 or FIRSTPIZZA.",
    };
  }

  if (subtotal < coupon.minOrderValue) {
    return {
      isValid: false,
      coupon,
      message: "Minimum order amount of ?" + coupon.minOrderValue + " required to use '" + cleanCode + "' (Current: ?" + subtotal + ")",
    };
  }

  let discount = 0;
  if (coupon.discountType === 'percentage') {
    discount = Math.min((subtotal * coupon.discountValue) / 100, coupon.maxDiscount);
  } else {
    discount = coupon.discountValue;
  }

  return {
    isValid: true,
    coupon,
    discountAmount: Math.round(discount),
    message: "Coupon '" + coupon.code + "' applied! Saved ?" + Math.round(discount) + ".",
  };
};
