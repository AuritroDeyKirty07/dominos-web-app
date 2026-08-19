import { MenuItem } from '../models/MenuItem.js';

export const categories = [
  { id: 'veg-pizza', name: 'Veg Pizzas', count: 6, icon: 'Leaf', description: 'Delectable veg delights loaded with fresh veggies & premium mozzarella.' },
  { id: 'non-veg-pizza', name: 'Non-Veg Pizzas', count: 6, icon: 'Flame', description: 'Loaded with tender barbecued chicken, sausages, and hot peri-peri chicken.' },
  { id: 'pizza-mania', name: 'Pizza Mania', count: 4, icon: 'Zap', description: 'Pocket-friendly single toppings starting at just ₹99!' },
  { id: 'sides', name: 'Sides & Dips', count: 5, icon: 'Utensils', description: 'Iconic garlic breadsticks, cheesy dips, and spicy parcels.' },
  { id: 'desserts', name: 'Desserts', count: 3, icon: 'Heart', description: 'Warm Choco Lava Cake and sweet indulgences.' },
  { id: 'beverages', name: 'Beverages', count: 3, icon: 'Coffee', description: 'Chilled Pepsi, Mirinda, and 7Up to quench your thirst.' },
];

export const menuItems = [
  {
    id: 'margherita',
    name: 'Margherita Classic',
    category: 'veg-pizza',
    description: 'A hugely popular classic with 100% real mozzarella cheese on our signature herb-infused tomato sauce.',
    price: 199,
    isVeg: true,
    isCustomizable: true,
    isBestseller: true,
    rating: 4.8,
    reviewsCount: 3420,
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=600&q=80',
    badge: 'Bestseller',
    customizationOptions: {
      sizes: [
        { name: 'Regular', serves: '1 Person', priceMultiplier: 1, basePrice: 199 },
        { name: 'Medium', serves: '2-3 Persons', priceMultiplier: 1.8, basePrice: 359 },
        { name: 'Large', serves: '4-5 Persons', priceMultiplier: 2.6, basePrice: 519 },
      ],
      crusts: [
        { name: 'New Hand Tossed', extraPrice: 0, description: 'Classic crust, crispy outside and soft inside.' },
        { name: '100% Wheat Thin Crust', extraPrice: 50, description: 'Crispy whole wheat thin crust.' },
        { name: 'Cheese Burst', extraPrice: 99, description: 'Crust filled with gooey molten cheese.' },
        { name: 'Fresh Pan Pizza', extraPrice: 40, description: 'Thick, buttery golden crust baked in a deep pan.' },
      ],
      toppings: [
        { name: 'Extra Cheese', price: 65, isVeg: true, category: 'Cheese' },
        { name: 'Crisp Capsicum', price: 40, isVeg: true, category: 'Veggie' },
        { name: 'Fresh Tomato', price: 40, isVeg: true, category: 'Veggie' },
        { name: 'Grilled Mushroom', price: 50, isVeg: true, category: 'Veggie' },
        { name: 'Paneer Cubes', price: 60, isVeg: true, category: 'Veggie' },
        { name: 'Black Olives', price: 45, isVeg: true, category: 'Veggie' },
        { name: 'Red Paprika', price: 45, isVeg: true, category: 'Veggie' },
        { name: 'Golden Corn', price: 40, isVeg: true, category: 'Veggie' },
      ],
      addOns: [
        { name: 'Cheesy Jalapeno Dip (30g)', price: 30 },
        { name: 'Domino’s Herb Seasoning Pack', price: 15 },
        { name: 'Extra Oregano & Chili Flakes', price: 10 },
      ],
    },
  },
  {
    id: 'peppy-paneer',
    name: 'Peppy Paneer',
    category: 'veg-pizza',
    description: 'Chunky paneer with crisp capsicum and spicy red paprika, crafted on our secret tangy marinara.',
    price: 259,
    isVeg: true,
    isCustomizable: true,
    isBestseller: true,
    rating: 4.7,
    reviewsCount: 2890,
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=600&q=80',
    badge: 'Popular',
    customizationOptions: {
      sizes: [
        { name: 'Regular', serves: '1 Person', priceMultiplier: 1, basePrice: 259 },
        { name: 'Medium', serves: '2-3 Persons', priceMultiplier: 1.8, basePrice: 459 },
        { name: 'Large', serves: '4-5 Persons', priceMultiplier: 2.6, basePrice: 679 },
      ],
      crusts: [
        { name: 'New Hand Tossed', extraPrice: 0, description: 'Classic crust, crispy outside and soft inside.' },
        { name: 'Cheese Burst', extraPrice: 99, description: 'Crust filled with gooey molten cheese.' },
        { name: '100% Wheat Thin Crust', extraPrice: 50, description: 'Crispy whole wheat thin crust.' },
        { name: 'Fresh Pan Pizza', extraPrice: 40, description: 'Thick, buttery golden crust.' },
      ],
      toppings: [
        { name: 'Extra Cheese', price: 65, isVeg: true, category: 'Cheese' },
        { name: 'Grilled Mushroom', price: 50, isVeg: true, category: 'Veggie' },
        { name: 'Black Olives', price: 45, isVeg: true, category: 'Veggie' },
        { name: 'Golden Corn', price: 40, isVeg: true, category: 'Veggie' },
        { name: 'Spicy Jalapeno', price: 45, isVeg: true, category: 'Veggie' },
      ],
      addOns: [
        { name: 'Cheesy Jalapeno Dip (30g)', price: 30 },
        { name: 'Domino’s Herb Seasoning Pack', price: 15 },
      ],
    },
  },
  {
    id: 'farmhouse',
    name: 'Farmhouse Special',
    category: 'veg-pizza',
    description: 'Delightful combination of onion, capsicum, tomato & grilled mushroom on a bed of fresh mozzarella.',
    price: 269,
    isVeg: true,
    isCustomizable: true,
    isBestseller: false,
    rating: 4.6,
    reviewsCount: 1980,
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80',
    badge: 'Chef Choice',
    customizationOptions: {
      sizes: [
        { name: 'Regular', serves: '1 Person', priceMultiplier: 1, basePrice: 269 },
        { name: 'Medium', serves: '2-3 Persons', priceMultiplier: 1.8, basePrice: 479 },
        { name: 'Large', serves: '4-5 Persons', priceMultiplier: 2.6, basePrice: 699 },
      ],
      crusts: [
        { name: 'New Hand Tossed', extraPrice: 0, description: 'Classic crust, crispy outside and soft inside.' },
        { name: 'Cheese Burst', extraPrice: 99, description: 'Crust filled with gooey molten cheese.' },
        { name: 'Fresh Pan Pizza', extraPrice: 40, description: 'Thick, buttery golden crust.' },
      ],
      toppings: [
        { name: 'Extra Cheese', price: 65, isVeg: true, category: 'Cheese' },
        { name: 'Paneer Cubes', price: 60, isVeg: true, category: 'Veggie' },
        { name: 'Golden Corn', price: 40, isVeg: true, category: 'Veggie' },
      ],
      addOns: [
        { name: 'Cheesy Jalapeno Dip (30g)', price: 30 },
      ],
    },
  },
  {
    id: 'veggie-paradise',
    name: 'Veggie Paradise',
    category: 'veg-pizza',
    description: 'Gold corn, black olives, capsicum & red paprika offering a colorful burst of authentic flavors.',
    price: 249,
    isVeg: true,
    isCustomizable: true,
    isBestseller: false,
    rating: 4.5,
    reviewsCount: 1450,
    image: 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?auto=format&fit=crop&w=600&q=80',
    badge: null,
    customizationOptions: {
      sizes: [
        { name: 'Regular', serves: '1 Person', priceMultiplier: 1, basePrice: 249 },
        { name: 'Medium', serves: '2-3 Persons', priceMultiplier: 1.8, basePrice: 439 },
        { name: 'Large', serves: '4-5 Persons', priceMultiplier: 2.6, basePrice: 649 },
      ],
      crusts: [
        { name: 'New Hand Tossed', extraPrice: 0, description: 'Classic crust.' },
        { name: 'Cheese Burst', extraPrice: 99, description: 'Gooey cheese.' },
      ],
      toppings: [
        { name: 'Extra Cheese', price: 65, isVeg: true, category: 'Cheese' },
        { name: 'Paneer Cubes', price: 60, isVeg: true, category: 'Veggie' },
      ],
      addOns: [
        { name: 'Cheesy Dip (30g)', price: 30 },
      ],
    },
  },
  {
    id: 'pepper-barbecue-chicken',
    name: 'Pepper Barbecue Chicken',
    category: 'non-veg-pizza',
    description: 'Smoky pepper barbecue chicken pieces sprinkled over melted mozzarella with seasoned herbs.',
    price: 319,
    isVeg: false,
    isCustomizable: true,
    isBestseller: true,
    rating: 4.9,
    reviewsCount: 4120,
    image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=600&q=80',
    badge: 'Top Rated',
    customizationOptions: {
      sizes: [
        { name: 'Regular', serves: '1 Person', priceMultiplier: 1, basePrice: 319 },
        { name: 'Medium', serves: '2-3 Persons', priceMultiplier: 1.8, basePrice: 569 },
        { name: 'Large', serves: '4-5 Persons', priceMultiplier: 2.6, basePrice: 799 },
      ],
      crusts: [
        { name: 'New Hand Tossed', extraPrice: 0, description: 'Classic crust.' },
        { name: 'Cheese Burst', extraPrice: 99, description: 'Gooey molten cheese.' },
        { name: 'Fresh Pan Pizza', extraPrice: 40, description: 'Crisp & buttery.' },
      ],
      toppings: [
        { name: 'Extra Barbecue Chicken', price: 75, isVeg: false, category: 'Non-Veg' },
        { name: 'Peri-Peri Chicken', price: 75, isVeg: false, category: 'Non-Veg' },
        { name: 'Extra Cheese', price: 65, isVeg: true, category: 'Cheese' },
        { name: 'Crisp Onion', price: 40, isVeg: true, category: 'Veggie' },
        { name: 'Spicy Jalapenos', price: 45, isVeg: true, category: 'Veggie' },
      ],
      addOns: [
        { name: 'Cheesy Jalapeno Dip (30g)', price: 30 },
        { name: 'Hot Chilli Seasoning', price: 15 },
      ],
    },
  },
  {
    id: 'chicken-golden-delight',
    name: 'Chicken Golden Delight',
    category: 'non-veg-pizza',
    description: 'Double barbecue chicken with golden corn and double cheese layer. An absolute crowd pleaser.',
    price: 339,
    isVeg: false,
    isCustomizable: true,
    isBestseller: true,
    rating: 4.8,
    reviewsCount: 3100,
    image: 'https://images.unsplash.com/photo-1594007654729-407eedc4be65?auto=format&fit=crop&w=600&q=80',
    badge: 'Bestseller',
    customizationOptions: {
      sizes: [
        { name: 'Regular', serves: '1 Person', priceMultiplier: 1, basePrice: 339 },
        { name: 'Medium', serves: '2-3 Persons', priceMultiplier: 1.8, basePrice: 599 },
        { name: 'Large', serves: '4-5 Persons', priceMultiplier: 2.6, basePrice: 849 },
      ],
      crusts: [
        { name: 'New Hand Tossed', extraPrice: 0, description: 'Classic crust.' },
        { name: 'Cheese Burst', extraPrice: 99, description: 'Gooey cheese.' },
      ],
      toppings: [
        { name: 'Peri-Peri Chicken', price: 75, isVeg: false, category: 'Non-Veg' },
        { name: 'Extra Cheese', price: 65, isVeg: true, category: 'Cheese' },
      ],
      addOns: [
        { name: 'Cheesy Dip (30g)', price: 30 },
      ],
    },
  },
  {
    id: 'stuffed-garlic-bread',
    name: 'Stuffed Garlic Bread',
    category: 'sides',
    description: 'Freshly baked garlic breadsticks stuffed with cheesy jalapeños and sweet corn.',
    price: 159,
    isVeg: true,
    isCustomizable: false,
    isBestseller: true,
    rating: 4.9,
    reviewsCount: 5210,
    image: 'https://www.indianveggiedelight.com/wp-content/uploads/2017/03/dominos_stuffed_garlic_bread_final-1536x2048.jpg',
    badge: 'Must Try',
    customizationOptions: null,
  },
  {
    id: 'garlic-breadsticks',
    name: 'Classic Garlic Breadsticks',
    category: 'sides',
    description: 'Crispy on the outside, soft on the inside with garlic butter seasoning. Pair with cheesy dip!',
    price: 109,
    isVeg: true,
    isCustomizable: false,
    isBestseller: false,
    rating: 4.7,
    reviewsCount: 3120,
    image: 'https://images.unsplash.com/photo-1619895092538-128341789043?auto=format&fit=crop&w=600&q=80',
    badge: null,
    customizationOptions: null,
  },
  {
    id: 'choco-lava-cake',
    name: 'Choco Lava Cake',
    category: 'desserts',
    description: 'Warm chocolate cake with a molten chocolate center that melts in your mouth with every bite.',
    price: 119,
    isVeg: true,
    isCustomizable: false,
    isBestseller: true,
    rating: 4.9,
    reviewsCount: 8900,
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=600&q=80',
    badge: 'Iconic Dessert',
    customizationOptions: null,
  },
  {
    id: 'pepsi-500ml',
    name: 'Pepsi Pet Bottle (500ml)',
    category: 'beverages',
    description: 'Refreshing carbonated soft drink served chilled.',
    price: 60,
    isVeg: true,
    isCustomizable: false,
    isBestseller: false,
    rating: 4.5,
    reviewsCount: 1200,
    image: 'https://images.unsplash.com/photo-1629203851122-3726ecdf080e?auto=format&fit=crop&w=600&q=80',
    badge: null,
    customizationOptions: null,
  },
];

export const getCategories = async () => categories;

export const getMenuItems = async (filters = {}) => {
  try {
    const dbQuery = {};
    if (filters.category && filters.category !== 'all') {
      dbQuery.category = filters.category;
    }
    if (filters.isVeg !== undefined && filters.isVeg !== null) {
      dbQuery.isVeg = filters.isVeg === 'true' || filters.isVeg === true;
    }
    if (filters.search) {
      dbQuery.$or = [
        { name: { $regex: filters.search, $options: 'i' } },
        { description: { $regex: filters.search, $options: 'i' } },
      ];
    }
    const dbItems = await MenuItem.find(dbQuery);
    if (dbItems && dbItems.length > 0) return dbItems;
  } catch (err) {}

  // Local fallback filtering
  let items = [...menuItems];
  if (filters.category && filters.category !== 'all') {
    items = items.filter(i => i.category === filters.category);
  }
  if (filters.isVeg !== undefined && filters.isVeg !== null) {
    items = items.filter(i => i.isVeg === (filters.isVeg === 'true' || filters.isVeg === true));
  }
  if (filters.search) {
    const q = filters.search.toLowerCase();
    items = items.filter(i =>
      i.name.toLowerCase().includes(q) ||
      i.description.toLowerCase().includes(q)
    );
  }
  return items;
};

export const getMenuItemById = async (id) => {
  try {
    const dbItem = await MenuItem.findOne({ id });
    if (dbItem) return dbItem;
  } catch (err) {}
  return menuItems.find(i => i.id === id) || null;
};
