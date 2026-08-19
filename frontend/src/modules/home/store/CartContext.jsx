import React, { createContext, useState, useEffect } from 'react';
import { validateCoupon } from '../services/offersService.js';

export const CartContext = createContext(null);

const STORAGE_KEY = 'dominos_cart_state';

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return [];
  });

  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState(null);
  const [couponSuccess, setCouponSuccess] = useState(null);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cartItems));
  }, [cartItems]);

  // Compute pricing
  const subtotal = cartItems.reduce((acc, item) => acc + (item.unitPrice * item.quantity), 0);

  // Validate coupon when subtotal changes
  useEffect(() => {
    if (appliedCoupon) {
      const result = validateCoupon(appliedCoupon.code, subtotal);
      if (!result.valid) {
        setAppliedCoupon(null);
        setCouponError(result.message);
        setCouponSuccess(null);
      }
    }
  }, [subtotal]);

  const discount = appliedCoupon ? (
    appliedCoupon.discountType === 'percentage'
      ? Math.min((subtotal * appliedCoupon.discountValue) / 100, appliedCoupon.maxDiscount)
      : Math.min(appliedCoupon.discountValue, subtotal)
  ) : 0;

  const deliveryFee = subtotal > 350 || subtotal === 0 ? 0 : 35;
  const taxableAmount = Math.max(0, subtotal - discount);
  const taxes = Math.round(taxableAmount * 0.05); // 5% GST
  const grandTotal = Math.round(taxableAmount + deliveryFee + taxes);

  const generateCartItemId = (product, customization) => {
    if (!customization) return `${product.id}-standard`;
    const toppingsKey = (customization.toppings || []).sort().join('-');
    const addOnsKey = (customization.addOns || []).sort().join('-');
    return `${product.id}-${customization.size || 'reg'}-${customization.crust || 'std'}-${toppingsKey}-${addOnsKey}`;
  };

  const calculateItemUnitPrice = (product, customization) => {
    if (!customization) return product.price;

    let base = product.price;
    // If specific size option exists
    if (product.customizationOptions?.sizes) {
      const sizeObj = product.customizationOptions.sizes.find(s => s.name === customization.size);
      if (sizeObj && sizeObj.basePrice) {
        base = sizeObj.basePrice;
      }
    }

    let crustPrice = 0;
    if (product.customizationOptions?.crusts && customization.crust) {
      const crustObj = product.customizationOptions.crusts.find(c => c.name === customization.crust);
      if (crustObj) crustPrice = crustObj.extraPrice || 0;
    }

    let toppingsPrice = 0;
    if (product.customizationOptions?.toppings && customization.toppings) {
      customization.toppings.forEach(topName => {
        const topObj = product.customizationOptions.toppings.find(t => t.name === topName);
        if (topObj) toppingsPrice += topObj.price;
      });
    }

    let addOnsPrice = 0;
    if (product.customizationOptions?.addOns && customization.addOns) {
      customization.addOns.forEach(addonName => {
        const addonObj = product.customizationOptions.addOns.find(a => a.name === addonName);
        if (addonObj) addOnsPrice += addonObj.price;
      });
    }

    return base + crustPrice + toppingsPrice + addOnsPrice;
  };

  const addToCart = (product, customization = null, quantity = 1) => {
    const unitPrice = calculateItemUnitPrice(product, customization);
    const cartItemId = generateCartItemId(product, customization);

    setCartItems(prev => {
      const existingIndex = prev.findIndex(item => item.cartItemId === cartItemId);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        return [
          ...prev,
          {
            cartItemId,
            id: product.id,
            name: product.name,
            image: product.image,
            category: product.category,
            isVeg: product.isVeg,
            unitPrice,
            quantity,
            customization: customization ? { ...customization } : null,
          }
        ];
      }
    });
  };

  const updateQuantity = (cartItemId, change) => {
    setCartItems(prev => {
      return prev
        .map(item => {
          if (item.cartItemId === cartItemId) {
            const newQty = item.quantity + change;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean);
    });
  };

  const removeFromCart = (cartItemId) => {
    setCartItems(prev => prev.filter(item => item.cartItemId !== cartItemId));
  };

  const clearCart = () => {
    setCartItems([]);
    setAppliedCoupon(null);
    setCouponError(null);
    setCouponSuccess(null);
  };

  const applyCoupon = (code) => {
    setCouponError(null);
    setCouponSuccess(null);
    const result = validateCoupon(code, subtotal);
    if (result.valid) {
      setAppliedCoupon(result.offer);
      setCouponSuccess(result.message);
      return { success: true, message: result.message };
    } else {
      setCouponError(result.message);
      return { success: false, message: result.message };
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponSuccess(null);
    setCouponError(null);
  };

  const totalItemsCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        totalItemsCount,
        subtotal,
        discount: Math.round(discount),
        deliveryFee,
        taxes,
        grandTotal,
        appliedCoupon,
        couponError,
        couponSuccess,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        applyCoupon,
        removeCoupon,
        calculateItemUnitPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
