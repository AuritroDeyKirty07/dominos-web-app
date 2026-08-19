import axiosInstance from '../../../shared/api/axiosInstance.js';

export const getCategories = async () => {
  const res = await axiosInstance.get('/menu/categories');
  return res.data.data;
};

export const getMenuItems = async (filters = {}) => {
  const res = await axiosInstance.get('/menu/items', { params: filters });
  return res.data.data;
};

export const getMenuItemById = async (id) => {
  const res = await axiosInstance.get(`/menu/items/${id}`);
  return res.data.data;
};
