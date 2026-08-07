const API_BASE_URL = 'http://localhost:5000/api/delivery';

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
    console.warn('IP location fetch failed, using localized default coordinates:', err.message);
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
      const res = await fetch(`${API_BASE_URL}/dashboard`);
      const json = await res.json();
      if (json.success) return json.data;
    } catch (err) {
      console.warn('Backend API offline, utilizing active frontend fallback state:', err.message);
    }
    
    // Fallback data structure matching requested parameters
    return {
      profile: {
        name: 'Rahul Sharma',
        role: 'Senior Delivery Executive',
        rating: 4.9,
        completedOrdersCount: 148,
        earningsToday: 1450,
        status: 'Online',
        vehicle: 'Honda Activa (DL 3S CW 9081)'
      },
      liveOrder: {
        orderId: 'DOM-9482',
        customerName: 'Bhukasur',
        customerPhone: '+91 98765 43210',
        restaurantName: "Domino's Pizza - Connaught Place",
        restaurantAddress: 'Plot 14, Outer Circle, Connaught Place, New Delhi',
        restaurantMapUrl: 'https://maps.app.goo.gl/igoxP8L3S527o5Qh7',
        restaurantCoords: { lat: 28.6139, lng: 77.2090 },
        deliveryAddress: 'Flat 402, B-Block, Sunshine Heights, Ring Road, Sector 14, New Delhi - 110001',
        customerCoords: { lat: 28.6324, lng: 77.2187 },
        items: [
          { name: 'Cheese Burst Peppy Paneer Pizza', quantity: 2, price: 449, size: 'Medium' },
          { name: 'Stuffed Garlic Breadsticks', quantity: 1, price: 179, size: 'Standard' },
          { name: 'Choco Lava Cake', quantity: 2, price: 109, size: 'Regular' }
        ],
        totalAmount: 1295,
        paymentStatus: 'COD (Cash on Delivery)',
        status: 'PENDING',
        createdAt: new Date().toISOString()
      },
      orderHistory: [
        {
          orderId: 'DOM-9420',
          customerName: 'Vikram Singh',
          deliveryAddress: 'H.No 12, Main Market, Lajpat Nagar, New Delhi',
          itemsCount: 3,
          totalAmount: 519,
          paymentStatus: 'Paid Online',
          status: 'DELIVERED',
          createdAt: new Date(Date.now() - 7200000).toISOString()
        },
        {
          orderId: 'DOM-9380',
          customerName: 'Neha Kapoor',
          deliveryAddress: 'Tower 4, Apex Greens, Sector 62',
          itemsCount: 1,
          totalAmount: 549,
          paymentStatus: 'Paid Online',
          status: 'DELIVERED',
          createdAt: new Date(Date.now() - 18000000).toISOString()
        }
      ]
    };
  },

  async getOrderById(orderId) {
    try {
      const res = await fetch(`${API_BASE_URL}/orders/${orderId}`);
      const json = await res.json();
      if (json.success) return json.data;
    } catch (err) {
      console.warn('Backend API offline, utilizing order fallback:', err.message);
    }
    
    return {
      orderId: orderId || 'DOM-9482',
      customerName: 'Bhukasur',
      customerPhone: '+91 98765 43210',
      restaurantName: "Domino's Pizza - Connaught Place",
      restaurantAddress: 'Plot 14, Outer Circle, Connaught Place, New Delhi',
      restaurantMapUrl: 'https://maps.app.goo.gl/igoxP8L3S527o5Qh7',
      restaurantCoords: { lat: 28.6139, lng: 77.2090 },
      deliveryAddress: 'Flat 402, B-Block, Sunshine Heights, Ring Road, Sector 14, New Delhi - 110001',
      customerCoords: { lat: 28.6324, lng: 77.2187 },
      items: [
        { name: 'Cheese Burst Peppy Paneer Pizza', quantity: 2, price: 449, size: 'Medium' },
        { name: 'Stuffed Garlic Breadsticks', quantity: 1, price: 179, size: 'Standard' },
        { name: 'Choco Lava Cake', quantity: 2, price: 109, size: 'Regular' }
      ],
      totalAmount: 1295,
      paymentStatus: 'COD (Cash on Delivery)',
      status: 'PENDING',
      createdAt: new Date().toISOString()
    };
  },

  async updateOrderStatus(orderId, status) {
    try {
      const res = await fetch(`${API_BASE_URL}/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      const json = await res.json();
      if (json.success) return json.data;
    } catch (err) {
      console.warn('Backend patch failed, updating frontend state locally:', err.message);
    }
    return { orderId, status };
  }
};
