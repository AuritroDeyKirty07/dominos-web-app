// src/models/MenuItemModel.js

export class MenuItemModel {
  constructor(data = {}) {
    this.id = data.id || data._id || '';
    this.name = data.name || '';
    this.category = data.category || 'veg-pizza';
    this.description = data.description || '';
    this.image = data.image || '';
    this.price = Number(data.price) || 0;
    this.costPrice = Number(data.costPrice) || Math.round((Number(data.price) || 199) * 0.45);
    this.isVeg = data.isVeg !== undefined ? data.isVeg : true;
    this.isBestseller = Boolean(data.isBestseller);
    this.rating = Number(data.rating) || 4.5;
    this.reviewsCount = Number(data.reviewsCount) || 0;
    this.badge = data.badge || null;
    this.sizes = {
      S: data.sizes?.S ?? data.customizationOptions?.sizes?.[0]?.basePrice ?? data.price ?? 0,
      M: data.sizes?.M ?? data.customizationOptions?.sizes?.[1]?.basePrice ?? (data.price ? Math.round(data.price * 1.8) : 0),
      L: data.sizes?.L ?? data.customizationOptions?.sizes?.[2]?.basePrice ?? (data.price ? Math.round(data.price * 2.6) : 0),
    };
    this.customizationOptions = data.customizationOptions || null;
    this.isAvailable = data.isAvailable !== undefined ? data.isAvailable : true;
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }

  /** Profit margin in INR */
  get profitMargin() {
    const basePrice = this.price || this.sizes.S || 0;
    return Math.max(0, basePrice - this.costPrice);
  }

  /** Profit percentage */
  get profitPercentage() {
    const basePrice = this.price || this.sizes.S || 0;
    if (basePrice === 0) return 0;
    return Math.round((this.profitMargin / basePrice) * 100);
  }

  /** Formatted price string */
  displayPrice() {
    if (this.price) return `₹${this.price}`;
    if (this.sizes.S) return `₹${this.sizes.S}`;
    return '₹0';
  }
}

export default MenuItemModel;
