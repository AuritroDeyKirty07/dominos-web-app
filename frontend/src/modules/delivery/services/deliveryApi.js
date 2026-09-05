import axiosInstance from '../../../shared/api/axiosInstance';

const API_BASE_URL = import.meta.env.DEV
    ? 'http://localhost:5000/api/delivery'
    : '/api/delivery';
export const fetchIpLocation = async () => {
  try {
    const res = await fetch('https://ipapi.co/json/');
    if (!res.ok) throw new Error('Failed to fetch IP tracking');
    const data = await res.json();
    return {
      ip: data.ip,
      city: data.city || 'New Delhi',
      region: data.region || 'Delhi',
      country: data.country_name || 'India',
      org: data.org || 'Airtel Broadband',
      latitude: data.latitude || 28.6139,
      longitude: data.longitude || 77.2090
    };
  } catch (err) {
    console.warn('IP location fetch failed:', err.message);
    return {
      ip: '103.21.124.89',
      city: 'New Delhi',
      region: 'Delhi',
      country: 'India',
      org: 'Jio Fiber Express',
      latitude: 28.6210,
      longitude: 77.2140
    };
  }
};

export const deliveryApi = {
  async getDashboard() {
    try {
      const res = await axiosInstance.get(`${API_BASE_URL}/dashboard`);
      if (res.data && res.data.success && res.data.data) {
        return {
          profile: res.data.data.profile,
          liveOrder: res.data.data.liveOrder,
          orderHistory: res.data.data.orderHistory || []
        };
      }
    } catch (err) {
      console.error('Backend API error on getDashboard:', err.message);
    }
    return {
      profile: null,
      liveOrder: null,
      orderHistory: []
    };
  },

  async getOrderById(orderId) {
    try {
      const res = await axiosInstance.get(`${API_BASE_URL}/orders/${orderId}`);
      if (res.data && res.data.success && res.data.data) {
        return res.data.data;
      }
    } catch (err) {
      console.error('Backend API error on getOrderById:', err.message);
    }
    return null;
  },

  async updateOrderStatus(orderId, status) {
    try {
      const res = await axiosInstance.patch(`${API_BASE_URL}/orders/${orderId}/status`, { status });
      if (res.data && res.data.success) {
        return res.data.data;
      }
    } catch (err) {
      console.error('Backend API error on updateOrderStatus:', err.message);
    }
    return null;
  }
};
