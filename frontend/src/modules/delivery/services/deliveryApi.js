import axiosInstance from '../../../shared/api/axiosInstance';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ? (import.meta.env.VITE_API_BASE_URL + '/api/delivery') : 'http://localhost:5000/api/delivery';

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

export const MOCK_ORDER = {
  _id: 'mock-dom-9482',
  orderId: 'DOM-9482',
  customerName: 'Bhukasur',
  customerPhone: '+91 98765 43210',
  deliveryAddress: 'House 42, Block B, Connaught Place, New Delhi - 110001',
  restaurantAddress: "Domino's Pizza, Inner Circle, Connaught Place, New Delhi",
  restaurantMapUrl: 'https://maps.google.com/?q=28.6315,77.2167',
  paymentStatus: 'COD (Cash on Delivery)',
  paymentMethod: 'Cash on Delivery',
  status: 'Ready',
  totalAmount: 899,
  restaurantCoords: { lat: 28.6315, lng: 77.2167 },
  customerCoords: { lat: 28.6139, lng: 77.2090 },
  items: [
    { name: 'Peppy Paneer Large Pizza', quantity: 1, size: 'Large', price: 549 },
    { name: 'Garlic Breadsticks', quantity: 1, size: 'Regular', price: 149 },
    { name: 'Choco Lava Cake', quantity: 2, size: 'Standard', price: 101 }
  ]
};

export const MOCK_PROFILE = {
  _id: 'mock-rider-1',
  name: 'Aman Verdhiya',
  email: 'delivery.partner@dominos.com',
  phone: '+91 98100 12345',
  role: 'Senior Delivery Executive',
  status: 'Online'
};

export const MOCK_ORDER_HISTORY = [
  {
    _id: 'hist-1',
    orderId: 'DOM-9480',
    customerName: 'Rohan Sharma',
    items: [
      { name: 'Margherita Large Pizza', quantity: 1 },
      { name: 'Pepsi 500ml', quantity: 2 }
    ],
    totalAmount: 599,
    status: 'Delivered',
    createdAt: new Date(Date.now() - 7200000).toISOString()
  },
  {
    _id: 'hist-2',
    orderId: 'DOM-9479',
    customerName: 'Priya Singh',
    items: [
      { name: 'Farmhouse Medium Pizza', quantity: 2 },
      { name: 'Cheesy Dip', quantity: 1 }
    ],
    totalAmount: 940,
    status: 'Delivered',
    createdAt: new Date(Date.now() - 18000000).toISOString()
  },
  {
    _id: 'hist-3',
    orderId: 'DOM-9475',
    customerName: 'Amit Kumar',
    items: [
      { name: 'Cheese N Corn Pizza', quantity: 1 },
      { name: 'Stuffed Garlic Bread', quantity: 1 }
    ],
    totalAmount: 480,
    status: 'Delivered',
    createdAt: new Date(Date.now() - 86400000).toISOString()
  }
];

export const deliveryApi = {
  async getDashboard() {
    try {
      const res = await axiosInstance.get(`${API_BASE_URL}/dashboard`);
      if (res.data && res.data.success && res.data.data) {
        const data = res.data.data;
        return {
          profile: data.profile || MOCK_PROFILE,
          liveOrder: data.liveOrder ? { ...MOCK_ORDER, ...data.liveOrder } : MOCK_ORDER,
          orderHistory: (data.orderHistory && data.orderHistory.length > 0) ? data.orderHistory : MOCK_ORDER_HISTORY
        };
      }
    } catch (err) {
      console.error('Backend API error on getDashboard:', err.message);
    }
    
    return {
      profile: MOCK_PROFILE,
      liveOrder: MOCK_ORDER,
      orderHistory: MOCK_ORDER_HISTORY
    };
  },

  async getOrderById(orderId) {
    try {
      const res = await axiosInstance.get(`${API_BASE_URL}/orders/${orderId}`);
      if (res.data && res.data.success && res.data.data) {
        return {
          ...MOCK_ORDER,
          ...res.data.data,
          items: (res.data.data.items && res.data.data.items.length > 0) ? res.data.data.items : MOCK_ORDER.items
        };
      }
    } catch (err) {
      console.error('Backend API error on getOrderById:', err.message);
    }
    
    return {
      ...MOCK_ORDER,
      orderId: orderId || 'DOM-9482'
    };
  },

  async updateOrderStatus(orderId, status) {
    try {
      const res = await axiosInstance.patch(`${API_BASE_URL}/orders/${orderId}/status`, { status });
      if (res.data && res.data.success) return res.data.data;
    } catch (err) {
      console.error('Backend API error on updateOrderStatus:', err.message);
    }
    return {
      ...MOCK_ORDER,
      orderId: orderId || 'DOM-9482',
      status
    };
  }
};
