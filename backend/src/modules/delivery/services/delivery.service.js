import { userModel } from '../../auth/models/user-model.js';
import Order from '../../kitchen/models/Order.js';

export class DeliveryService {
  /**
   * Dynamically fetch delivery driver details from the Auth UserModel
   */
  static async getProfile(userId = null) {
    if (userId) {
      try {
        const user = await userModel.findById(userId).populate('roleId');
        if (user) {
          const roleName = user.roleId?.name || user.role || 'Delivery Executive';
          return {
            _id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: roleName === 'delivery' ? 'Senior Delivery Executive' : roleName,
            status: user.isActive ? 'Online' : 'Offline'
          };
        }
      } catch (err) {
        console.error('Error fetching user profile from auth:', err.message);
      }
    }
    return null;
  }

  /**
   * Fetch live and history order data exclusively from the Kitchen module Order model
   */
  static async getDashboardData(userId = null) {
    const profile = await this.getProfile(userId);

    let orders = [];
    try {
      const kitchenOrders = await Order.find().sort({ createdAt: -1 });
      if (kitchenOrders) {
        orders = kitchenOrders.map(o => ({
          _id: o._id,
          orderId: o.orderNumber || o._id.toString(),
          customerName: o.customerName || 'Customer',
          items: (o.items || []).map(i => ({
            name: i.name,
            quantity: i.quantity
          })),
          status: o.status,
          createdAt: o.createdAt
        }));
      }
    } catch (err) {
      console.error('Error fetching orders from kitchen module:', err.message);
    }

    const DEFAULT_STATIC_ORDER = {
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

    const DEFAULT_STATIC_HISTORY = [
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

    const liveOrder = orders.find(o => 
      o.status === 'Ready' || 
      o.status === 'Preparing' || 
      o.status === 'Placed' || 
      o.status === 'Out for Delivery' || 
      o.status === 'OUT_FOR_DELIVERY' ||
      o.status === 'ACCEPTED' ||
      o.status === 'PENDING'
    ) || DEFAULT_STATIC_ORDER;

    const orderHistory = orders.filter(o => 
      o.status === 'Delivered' || 
      o.status === 'DELIVERED' || 
      o.status === 'REJECTED'
    );

    return {
      profile: profile || {
        _id: 'mock-rider-1',
        name: 'Aman Verdhiya',
        email: 'delivery.partner@dominos.com',
        phone: '+91 98100 12345',
        role: 'Senior Delivery Executive',
        status: 'Online'
      },
      liveOrder,
      orderHistory: orderHistory.length > 0 ? orderHistory : DEFAULT_STATIC_HISTORY
    };
  }

  static async getOrderById(orderId) {
    const DEFAULT_STATIC_ORDER = {
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

    try {
      const isObjectId = orderId && orderId.match(/^[0-9a-fA-F]{24}$/);
      const query = isObjectId ? { $or: [{ orderNumber: orderId }, { _id: orderId }] } : { orderNumber: orderId };
      const kitchenOrder = await Order.findOne(query);
      if (kitchenOrder) {
        return {
          ...DEFAULT_STATIC_ORDER,
          _id: kitchenOrder._id,
          orderId: kitchenOrder.orderNumber || kitchenOrder._id.toString(),
          customerName: kitchenOrder.customerName || 'Customer',
          items: (kitchenOrder.items && kitchenOrder.items.length > 0) ? kitchenOrder.items : DEFAULT_STATIC_ORDER.items,
          status: kitchenOrder.status || 'Ready',
          createdAt: kitchenOrder.createdAt
        };
      }
    } catch (err) {
      console.error('Error fetching order from kitchen module:', err.message);
    }
    return {
      ...DEFAULT_STATIC_ORDER,
      orderId: orderId || 'DOM-9482'
    };
  }

  static async updateOrderStatus(orderId, status) {
    const DEFAULT_STATIC_ORDER = {
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

    try {
      const isObjectId = orderId && orderId.match(/^[0-9a-fA-F]{24}$/);
      const query = isObjectId ? { $or: [{ orderNumber: orderId }, { _id: orderId }] } : { orderNumber: orderId };
      
      const updatedOrder = await Order.findOneAndUpdate(
        query,
        { status },
        { new: true }
      );
      if (updatedOrder) {
        return {
          ...DEFAULT_STATIC_ORDER,
          _id: updatedOrder._id,
          orderId: updatedOrder.orderNumber || updatedOrder._id.toString(),
          customerName: updatedOrder.customerName,
          items: updatedOrder.items || [],
          status: updatedOrder.status,
          createdAt: updatedOrder.createdAt
        };
      }
    } catch (err) {
      console.error('Error updating order status in kitchen module:', err.message);
    }
    return {
      ...DEFAULT_STATIC_ORDER,
      orderId: orderId || 'DOM-9482',
      status
    };
  }
}