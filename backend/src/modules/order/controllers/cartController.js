import * as cartService from '../services/cartService.js';
import { successResponse, errorResponse } from '../services/apiResponse.js';

export const getCart = async (req, res, next) => {
  try {
    const customerId = req.userId;
    if (!customerId) return errorResponse(res, 'User not authenticated', 401);
    const cart = await cartService.getCartByCustomerId(customerId);
    return successResponse(res, cart, 'Cart retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const syncCart = async (req, res, next) => {
  try {
    const customerId = req.userId;
    if (!customerId) return errorResponse(res, 'User not authenticated', 401);
    const updatedCart = await cartService.syncCart(customerId, req.body);
    return successResponse(res, updatedCart, 'Cart updated and calculated');
  } catch (error) {
    next(error);
  }
};

export const clearCart = async (req, res, next) => {
  try {
    const customerId = req.userId;
    if (!customerId) return errorResponse(res, 'User not authenticated', 401);
    const cart = await cartService.clearCart(customerId);
    return successResponse(res, cart, 'Cart cleared');
  } catch (error) {
    next(error);
  }
};
