import * as customerService from '../services/customerService.js';
import { successResponse, errorResponse } from '../services/apiResponse.js';

export const getProfile = async (req, res, next) => {
  try {
    const customerId = req.userId;
    if (!customerId) return errorResponse(res, 'User not authenticated', 401);
    const profile = await customerService.getCustomerProfile(customerId);
    return successResponse(res, profile, 'Customer profile retrieved');
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const customerId = req.userId;
    if (!customerId) return errorResponse(res, 'User not authenticated', 401);
    const updated = await customerService.updateCustomerProfile(customerId, req.body);
    return successResponse(res, updated, 'Customer profile updated successfully');
  } catch (error) {
    next(error);
  }
};

export const getAddresses = async (req, res, next) => {
  try {
    const customerId = req.userId;
    if (!customerId) return errorResponse(res, 'User not authenticated', 401);
    const addresses = await customerService.getAddresses(customerId);
    return successResponse(res, addresses, 'Customer addresses retrieved');
  } catch (error) {
    next(error);
  }
};

export const addAddress = async (req, res, next) => {
  try {
    const customerId = req.userId;
    if (!customerId) return errorResponse(res, 'User not authenticated', 401);
    const addresses = await customerService.addAddress(customerId, req.body);
    return successResponse(res, addresses, 'Address added successfully', 201);
  } catch (error) {
    next(error);
  }
};

export const deleteAddress = async (req, res, next) => {
  try {
    const { addressId } = req.params;
    const customerId = req.userId;
    if (!customerId) return errorResponse(res, 'User not authenticated', 401);
    const addresses = await customerService.deleteAddress(customerId, addressId);
    return successResponse(res, addresses, 'Address removed successfully');
  } catch (error) {
    next(error);
  }
};

export const setDefaultAddress = async (req, res, next) => {
  try {
    const { addressId } = req.params;
    const customerId = req.userId;
    if (!customerId) return errorResponse(res, 'User not authenticated', 401);
    const addresses = await customerService.setDefaultAddress(customerId, addressId);
    return successResponse(res, addresses, 'Default address updated');
  } catch (error) {
    next(error);
  }
};
