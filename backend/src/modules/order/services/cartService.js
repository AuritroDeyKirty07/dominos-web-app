import { Cart } from '../models/Cart.js';
import { validateCouponCode } from './couponService.js';
import { getMenuItemById } from './menuService.js';

export const calculateVerifiedItemUnitPrice = async (item) => {
  const catalogItem = await getMenuItemById(item.id);
  if (!catalogItem) return Number(item.unitPrice || item.price || 0);

  let basePrice = catalogItem.price;
  const cust = item.customization;

  if (cust && catalogItem.customizationOptions) {
    if (cust.size && catalogItem.customizationOptions.sizes) {
      const sizeObj = catalogItem.customizationOptions.sizes.find(s => s.name === cust.size);
      if (sizeObj && sizeObj.basePrice) {
        basePrice = sizeObj.basePrice;
      }
    }

    let crustPrice = 0;
    if (cust.crust && catalogItem.customizationOptions.crusts) {
      const crustObj = catalogItem.customizationOptions.crusts.find(c => c.name === cust.crust);
      if (crustObj) crustPrice = crustObj.extraPrice || 0;
    }

    let toppingsPrice = 0;
    if (cust.toppings && Array.isArray(cust.toppings) && catalogItem.customizationOptions.toppings) {
      cust.toppings.forEach(topName => {
        const topObj = catalogItem.customizationOptions.toppings.find(t => t.name === topName);
        if (topObj) toppingsPrice += topObj.price || 0;
      });
    }

    let addOnsPrice = 0;
    if (cust.addOns && Array.isArray(cust.addOns) && catalogItem.customizationOptions.addOns) {
      cust.addOns.forEach(addonName => {
        const addonObj = catalogItem.customizationOptions.addOns.find(a => a.name === addonName);
        if (addonObj) addOnsPrice += addonObj.price || 0;
      });
    }

    return basePrice + crustPrice + toppingsPrice + addOnsPrice;
  }

  return basePrice;
};

export const calculateCartTotals = async (items = [], couponDiscount = 0) => {
  let subtotal = 0;
  for (const item of items) {
    const verifiedUnitPrice = await calculateVerifiedItemUnitPrice(item);
    subtotal += (verifiedUnitPrice * (item.quantity || 1));
  }

  const discount = Math.min(couponDiscount, subtotal);
  const deliveryFee = subtotal > 350 || subtotal === 0 ? 0 : 35;
  const taxable = Math.max(0, subtotal - discount);
  const taxes = Math.round(taxable * 0.05); // 5% GST
  const grandTotal = Math.round(taxable + deliveryFee + taxes);

  return {
    subtotal,
    discount,
    deliveryFee,
    taxes,
    grandTotal,
  };
};

export const getCartByCustomerId = async (customerId) => {
  try {
    const dbCart = await Cart.findOne({ customerId });
    if (dbCart) return dbCart.toObject();
  } catch (err) {}

  // Create an empty cart if not found in DB
  const totals = await calculateCartTotals([]);
  const emptyCart = {
    customerId,
    items: [],
    appliedCoupon: { code: null, discountAmount: 0 },
    ...totals,
  };
  return emptyCart;
};

export const syncCart = async (customerId, cartPayload) => {
  const items = cartPayload.items || [];
  let couponDiscount = 0;
  let appliedCoupon = cartPayload.appliedCoupon || { code: null, discountAmount: 0 };

  if (appliedCoupon?.code) {
    const subtotal = items.reduce((sum, item) => sum + ((item.unitPrice || item.price || 0) * (item.quantity || 1)), 0);
    const valResult = await validateCouponCode(appliedCoupon.code, subtotal);
    if (valResult.isValid) {
      couponDiscount = valResult.discountAmount;
      appliedCoupon.discountAmount = couponDiscount;
    } else {
      appliedCoupon = { code: null, discountAmount: 0 };
    }
  }

  const totals = await calculateCartTotals(items, couponDiscount);

  const cartData = {
    customerId,
    items,
    appliedCoupon,
    ...totals,
  };

  try {
    await Cart.findOneAndUpdate(
      { customerId },
      { $set: cartData },
      { upsert: true, new: true }
    );
  } catch (err) {}

  return cartData;
};

export const clearCart = async (customerId) => {
  try {
    await Cart.deleteOne({ customerId });
  } catch (err) {}

  const totals = await calculateCartTotals([]);
  return {
    customerId,
    items: [],
    appliedCoupon: { code: null, discountAmount: 0 },
    ...totals,
  };
};
