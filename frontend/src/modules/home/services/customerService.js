import axiosInstance from '../../../shared/api/axiosInstance.js';

export const getProfile = async () => {
  const res = await axiosInstance.get('/customers/profile');
  return res.data.data;
};

export const updateProfile = async (updates) => {
  const res = await axiosInstance.put('/customers/profile', updates);
  return res.data.data;
};

export const getAddresses = async () => {
  const res = await axiosInstance.get('/customers/addresses');
  return res.data.data;
};

export const addAddress = async (newAddress) => {
  const res = await axiosInstance.post('/customers/addresses', newAddress);
  return res.data.data;
};

export const deleteAddress = async (addressId) => {
  const res = await axiosInstance.delete(`/customers/addresses/${addressId}`);
  return res.data.data;
};

export const setDefaultAddress = async (addressId) => {
  const res = await axiosInstance.put(`/customers/addresses/${addressId}/default`);
  return res.data.data;
};

