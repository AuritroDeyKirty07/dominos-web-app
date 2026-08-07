import { DeliveryOrderModel, DeliveryProfileModel } from '../models/delivery.model.js';

// In-memory initial data for robust offline runtime fallback
const initialProfile = {
  name: 'Rahul Sharma',
  role: 'Senior Delivery Executive',
  rating: 4.9,
  completedOrdersCount: 148,
  earningsToday: 1450,
  status: 'Online',
  vehicle: 'Honda Activa (DL 3S CW 9081)'
};

let inMemoryOrders = [
  {
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
    createdAt: new Date()
  },
  {
    orderId: 'DOM-9420',
    customerName: 'Vikram Singh',
    customerPhone: '+91 91234 56789',
    restaurantName: "Domino's Pizza - Connaught Place",
    restaurantAddress: 'Plot 14, Outer Circle, Connaught Place, New Delhi',
    restaurantMapUrl: 'https://maps.app.goo.gl/igoxP8L3S527o5Qh7',
    deliveryAddress: 'H.No 12, Main Market, Lajpat Nagar, New Delhi',
    items: [
      { name: 'Farmhouse Pizza', quantity: 1, price: 399, size: 'Large' },
      { name: 'Pepsi 475ml', quantity: 2, price: 60, size: 'Standard' }
    ],
    totalAmount: 519,
    paymentStatus: 'Paid Online',
    status: 'DELIVERED',
    createdAt: new Date(Date.now() - 3600000 * 2)
  },
  {
    orderId: 'DOM-9380',
    customerName: 'Neha Kapoor',
    customerPhone: '+91 99887 76655',
    restaurantName: "Domino's Pizza - Connaught Place",
    restaurantAddress: 'Plot 14, Outer Circle, Connaught Place, New Delhi',
    restaurantMapUrl: 'https://maps.app.goo.gl/igoxP8L3S527o5Qh7',
    deliveryAddress: 'Tower 4, Apex Greens, Noida Sector 62',
    items: [
      { name: 'Veg Extravaganza Pizza', quantity: 1, price: 549, size: 'Medium' }
    ],
    totalAmount: 549,
    paymentStatus: 'Paid Online',
    status: 'DELIVERED',
    createdAt: new Date(Date.now() - 3600000 * 5)
  }
];

export class DeliveryService {
  static async getProfile() {
    try {
      const dbProfile = await DeliveryProfileModel.findOne();
      if (dbProfile) return dbProfile;
    } catch {
      // Fallback to in-memory
    }
    return initialProfile;
  }

  static async getDashboardData() {
    let orders = inMemoryOrders;
    try {
      const dbOrders = await DeliveryOrderModel.find().sort({ createdAt: -1 });
      if (dbOrders && dbOrders.length > 0) {
        orders = dbOrders;
      }
    } catch {
      // Fallback
    }

    const liveOrder = orders.find(o => o.status === 'PENDING' || o.status === 'ACCEPTED' || o.status === 'OUT_FOR_DELIVERY') || orders[0];
    const orderHistory = orders.filter(o => o.status === 'DELIVERED' || o.status === 'REJECTED');
    const profile = await this.getProfile();

    return {
      profile,
      liveOrder,
      orderHistory
    };
  }

  static async getOrderById(orderId) {
    try {
      const dbOrder = await DeliveryOrderModel.findOne({ orderId });
      if (dbOrder) return dbOrder;
    } catch {
      // Fallback
    }
    return inMemoryOrders.find(o => o.orderId === orderId) || inMemoryOrders[0];
  }

  static async updateOrderStatus(orderId, status) {
    try {
      const dbOrder = await DeliveryOrderModel.findOneAndUpdate(
        { orderId },
        { status },
        { new: true }
      );
      if (dbOrder) return dbOrder;
    } catch {
      // Fallback
    }

    const order = inMemoryOrders.find(o => o.orderId === orderId);
    if (order) {
      order.status = status;
    }
    return order;
  }
}
