import * as menuService from '../services/menuService.js';
import { successResponse, errorResponse } from '../services/apiResponse.js';

export const getCategories = async (req, res, next) => {
  try {
    const categories = await menuService.getCategories();
    return successResponse(res, categories, 'Categories retrieved');
  } catch (error) {
    next(error);
  }
};

export const getMenuItems = async (req, res, next) => {
  try {
    const { category, isVeg, search } = req.query;
    const items = await menuService.getMenuItems({ category, isVeg, search });
    return successResponse(res, items, 'Menu items retrieved');
  } catch (error) {
    next(error);
  }
};

export const getMenuItemById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const item = await menuService.getMenuItemById(id);
    if (!item) {
      return errorResponse(res, `Menu item '${id}' not found`, 404);
    }
    return successResponse(res, item, 'Menu item retrieved');
  } catch (error) {
    next(error);
  }
};
