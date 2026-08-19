import { errorResponse } from '../services/apiResponse.js';

export const validateAddress = (req, res, next) => {
  const { name, phone, addressLine1, city, state, pinCode } = req.body;

  const errors = [];
  if (!name || name.trim() === '') errors.push('Contact name is required');
  if (!phone || phone.trim().length < 10) errors.push('Valid 10-digit phone number is required');
  if (!addressLine1 || addressLine1.trim() === '') errors.push('Street address is required');
  if (!city || city.trim() === '') errors.push('City is required');
  if (!pinCode || pinCode.trim().length < 6) errors.push('Valid 6-digit PIN code is required');

  if (errors.length > 0) {
    return errorResponse(res, 'Validation failed', 400, errors);
  }

  next();
};

export const validateOrder = (req, res, next) => {
  const { items, deliveryAddress, totalAmount } = req.body;

  const errors = [];
  if (!items || !Array.isArray(items) || items.length === 0) {
    errors.push('Order must contain at least one item');
  }
  if (!deliveryAddress) {
    errors.push('Delivery address is required');
  }
  // Allow check for totalAmount if passed
  if (totalAmount !== undefined && (typeof totalAmount !== 'number' || totalAmount <= 0)) {
    errors.push('Valid total amount is required');
  }

  if (errors.length > 0) {
    return errorResponse(res, 'Invalid order details', 400, errors);
  }

  next();
};
