import { MenuItem } from '../models/MenuItem.js';
import { Category } from '../models/Category.js';

export const getCategories = async () => {
  try {
    const dbCategories = await Category.find();
    return dbCategories;
  } catch (err) {
    throw new Error('Failed to fetch categories');
  }
};

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
    return dbItems;
  } catch (err) {
    throw new Error('Failed to fetch menu items');
  }
};

export const getMenuItemById = async (id) => {
  try {
    const dbItem = await MenuItem.findOne({ id });
    return dbItem;
  } catch (err) {
    throw new Error('Failed to fetch menu item by ID');
  }
};
