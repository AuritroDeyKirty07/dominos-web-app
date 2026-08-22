import * as orderService from '../services/orderService.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

export const createOrder = async (req, res, next) => {
  try {
    const customerId = req.userId;
    if (!customerId) return errorResponse(res, 'User not authenticated', 401);
    const order = await orderService.createOrder(req.body, customerId);
    return successResponse(res, order, 'Order created successfully', 201);
  } catch (error) {
    next(error);
  }
};

export const getOrderById = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const customerId = req.userId;
    if (!customerId) return errorResponse(res, 'User not authenticated', 401);
    const order = await orderService.getOrderById(orderId, customerId);
    if (!order) {
      return errorResponse(res, `Order '${orderId}' not found`, 404);
    }
    return successResponse(res, order, 'Order details retrieved');
  } catch (error) {
    next(error);
  }
};

export const getCustomerOrders = async (req, res, next) => {
  try {
    const customerId = req.userId;
    if (!customerId) return errorResponse(res, 'User not authenticated', 401);
    const orders = await orderService.getOrdersByCustomerId(customerId);
    return successResponse(res, orders, 'Customer orders retrieved');
  } catch (error) {
    next(error);
  }
};

export const updatePaymentStatus = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const { paymentStatus, transactionId } = req.body;
    if (!paymentStatus) {
      return errorResponse(res, 'paymentStatus is required', 400);
    }
    const order = await orderService.updateOrderPaymentStatus(orderId, paymentStatus, transactionId);
    if (!order) {
      return errorResponse(res, `Order '${orderId}' not found`, 404);
    }
    return successResponse(res, order, 'Payment status updated successfully');
  } catch (error) {
    next(error);
  }
};
