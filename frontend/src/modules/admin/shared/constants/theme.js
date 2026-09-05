// src/shared/constants/theme.js
export const COLORS = {
  primary: '#E4002B',
  secondary: '#FFB400',
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  info: '#3B82F6',
  chartColors: ['#E4002B', '#FFB400', '#10B981', '#3B82F6', '#8B5CF6', '#EC4899'],
};

export const ORDER_STATUSES = {
  RECEIVED: 'Order Received',
  PREPARING: 'Preparing',
  COOKING: 'Cooking',
  OUT_FOR_DELIVERY: 'Out for Delivery',
  DELIVERED: 'Delivered',
  CANCELLED: 'Cancelled',
};

export const PAYMENT_STATUSES = {
  PAID: 'Paid',
  PENDING: 'Pending',
  REFUNDED: 'Refunded',
  FAILED: 'Failed',
};

export const EMPLOYEE_ROLES = [
  'Cook',
  'Delivery Driver',
  'Manager',
  'Cashier',
  'Kitchen Helper',
  'Shift Supervisor',
];
