import { Coupon } from '../models/Coupon.js';

export const availableCoupons = [
  {
    code: 'DOMINOS50',
    title: '50% OFF up to ₹100',
    description: 'Get flat 50% discount on all orders above ₹200. Valid on pizzas & sides.',
    discountType: 'percentage',
    discountValue: 50,
    maxDiscount: 100,
    minOrderValue: 200,
    badge: 'Popular',
    expiry: 'Valid till end of month',
    isActive: true,
  },
  {
    code: 'PARTYPACK',
    title: 'Flat ₹200 OFF on Party Orders',
    description: 'Planning a gathering? Save flat ₹200 on minimum order cart of ₹799.',
    discountType: 'flat',
    discountValue: 200,
    maxDiscount: 200,
    minOrderValue: 799,
    badge: 'Huge Savings',
    expiry: 'Weekend Special',
    isActive: true,
  },
  {
    code: 'FIRSTPIZZA',
    title: 'Flat ₹120 OFF on First 3 Orders',
    description: 'Welcome bonus! Enjoy ₹120 instant savings on orders above ₹350.',
    discountType: 'flat',
    discountValue: 120,
    maxDiscount: 120,
    minOrderValue: 350,
    badge: 'New User',
    expiry: 'Expires in 7 days',
    isActive: true,
  },
  {
    code: 'CHEESELOVER',
    title: 'Flat ₹80 OFF on Cheese Burst',
    description: 'Craving molten cheese? Get ₹80 OFF on any Medium or Large Cheese Burst pizza.',
    discountType: 'flat',
    discountValue: 80,
    maxDiscount: 80,
    minOrderValue: 400,
    badge: 'Cheese Lovers',
    expiry: 'Limited Time',
    isActive: true,
  },
];

export const getAllCoupons = async () => {
  try {
    const dbCoupons = await Coupon.find({ isActive: true });
    if (dbCoupons && dbCoupons.length > 0) return dbCoupons;
  } catch (err) {}
  return availableCoupons;
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
      message: `Invalid coupon '${cleanCode}'. Try DOMINOS50 or FIRSTPIZZA.`,
    };
  }

  if (subtotal < coupon.minOrderValue) {
    return {
      isValid: false,
      coupon,
      message: `Minimum order amount of ₹${coupon.minOrderValue} required to use '${cleanCode}' (Current: ₹${subtotal})`,
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
    message: `Coupon '${coupon.code}' applied! Saved ₹${Math.round(discount)}.`,
  };
};
