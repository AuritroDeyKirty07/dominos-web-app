import axiosInstance from "../../../shared/api/axiosInstance";

const API_URL = "http://localhost:5000/api/kitchen";

export const getKitchenOrders = async () => {
    const response = await axiosInstance.get(`${API_URL}/orders`);
    return response.data;
};

export const getReadyKitchenOrders = async () => {
    const response = await axiosInstance.get(`${API_URL}/orders/ready`);
    return response.data;
};

export const startPreparingOrder = async (id) => {
    const response = await axiosInstance.put(`${API_URL}/orders/${id}/start-preparing`);
    return response.data;
};

export const markOrderReady = async (id) => {
    const response = await axiosInstance.put(`${API_URL}/orders/${id}/mark-ready`);
    return response.data;
};