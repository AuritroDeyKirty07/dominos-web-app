import * as couponService from '../services/couponService.js';
import { successResponse, errorResponse } from '../services/apiResponse.js';

export const getCoupons = async (req, res, next) => {
  try {
    const coupons = await couponService.getAllCoupons();
    return successResponse(res, coupons, 'Coupons retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const validateCoupon = async (req, res, next) => {
  try {
    const { code, subtotal } = req.body;
    if (!code) {
      return errorResponse(res, 'Coupon code is required', 400);
    }
    const result = await couponService.validateCouponCode(code, Number(subtotal || 0));
    if (!result.isValid) {
      return errorResponse(res, result.message, 400, result);
    }
    return successResponse(res, result, result.message);
  } catch (error) {
    next(error);
  }
};
