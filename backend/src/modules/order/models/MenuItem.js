import mongoose from 'mongoose';

const menuItemSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    isVeg: { type: Boolean, default: true },
    isCustomizable: { type: Boolean, default: true },
    isBestseller: { type: Boolean, default: false },
    rating: { type: Number, default: 4.5 },
    reviewsCount: { type: Number, default: 120 },
    image: { type: String, required: true },
    badge: { type: String, default: null },
    customizationOptions: {
      sizes: [
        { name: String, serves: String, priceMultiplier: Number, basePrice: Number }
      ],
      crusts: [
        { name: String, extraPrice: Number, description: String }
      ],
      toppings: [
        { name: String, price: Number, isVeg: Boolean, category: String }
      ],
      addOns: [
        { name: String, price: Number }
      ]
    }
  },
  { timestamps: true }
);

export const MenuItem = mongoose.models.MenuItem || mongoose.model('MenuItem', menuItemSchema);
