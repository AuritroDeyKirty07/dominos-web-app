import axiosInstance from '../../../shared/api/axiosInstance.js';

export const availableOffers = [
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
    highlight: true,
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
    highlight: false,
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
    highlight: true,
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
    highlight: false,
  },
];

export const getCoupons = async () => {
  try {
    const res = await axiosInstance.get('/coupons');
    return res.data.data;
  } catch (err) {
    return availableOffers;
  }
};

export const getOffers = async () => {
  return getCoupons();
};

export const validateCoupon = (code, cartSubtotal) => {
  if (!code) return { valid: false, message: 'Please enter a coupon code' };

  const offer = availableOffers.find(o => o.code.toUpperCase() === code.trim().toUpperCase());
  if (!offer) {
    return { valid: false, message: 'Invalid coupon code. Try DOMINOS50 or FIRSTPIZZA.' };
  }

  if (cartSubtotal < offer.minOrderValue) {
    return {
      valid: false,
      message: `Minimum cart value of ₹${offer.minOrderValue} required for ${offer.code} (Current: ₹${cartSubtotal})`,
    };
  }

  let discount = 0;
  if (offer.discountType === 'percentage') {
    discount = Math.min((cartSubtotal * offer.discountValue) / 100, offer.maxDiscount);
  } else {
    discount = offer.discountValue;
  }

  return {
    valid: true,
    offer,
    discount: Math.round(discount),
    message: `Coupon '${offer.code}' applied! You saved ₹${Math.round(discount)}.`,
  };
};

