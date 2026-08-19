import axiosInstance from '../../../shared/api/axiosInstance.js';

export const getOrders = async () => {
  const res = await axiosInstance.get('/orders');
  return res.data.data;
};

export const getOrderById = async (orderId) => {
  const res = await axiosInstance.get(`/orders/${orderId}`);
  return res.data.data;
};

export const placeOrder = async (orderPayload) => {
  const res = await axiosInstance.post('/orders', orderPayload);
  return res.data.data;
};

export const updatePaymentStatus = async (orderId, paymentStatus, transactionId = null) => {
  const res = await axiosInstance.put(`/orders/${orderId}/payment`, { paymentStatus, transactionId });
  return res.data.data;
};

