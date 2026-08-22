import { userModel } from '../../auth/models/user-model.js';
import { CustomerOrder } from '../../order/models/CustomerOrder.js';

export class DeliveryService {
  static async getProfile(userId) {
    if (userId) {
      try {
        const user = await userModel.findById(userId).populate('roleId');
        if (user) {
          const roleName = user.roleId?.name || user.role;
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

  static formatOrder(o) {
    const deliveryAddressStr = o.deliveryAddress 
      ? `${o.deliveryAddress.addressLine1}, ${o.deliveryAddress.city} - ${o.deliveryAddress.pinCode}`
      : 'Address not available';

    return {
      _id: o._id,
      orderId: o.orderId || o._id.toString(),
      customerName: o.deliveryAddress?.name || o.customerId?.name || 'Customer',
      customerPhone: o.deliveryAddress?.phone || o.customerId?.phone || 'N/A',
      deliveryAddress: deliveryAddressStr,
      restaurantAddress: "Domino's Pizza, Inner Circle, Connaught Place, New Delhi",
      restaurantMapUrl: 'https://maps.google.com/?q=28.6315,77.2167',
      paymentStatus: o.paymentStatus || 'PENDING',
      paymentMethod: o.paymentMethod || 'Cash on Delivery',
      status: o.status,
      totalAmount: o.pricing?.grandTotal || 0,
      restaurantCoords: { lat: 28.6315, lng: 77.2167 },
      customerCoords: { lat: 28.6139, lng: 77.2090 },
      items: (o.items || []).map(i => ({
        name: i.name,
        quantity: i.quantity,
        size: i.customization?.size || 'Regular',
        price: i.price || 0
      })),
      createdAt: o.createdAt
    };
  }

  static async getDashboardData(userId = null) {
    const profile = await this.getProfile(userId);
    let orders = [];
    try {
      const customerOrders = await CustomerOrder.find().populate('customerId', 'name phone').sort({ createdAt: -1 });
      if (customerOrders) {
        orders = customerOrders.map(o => this.formatOrder(o));
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
    }

    const liveOrder = orders.find(o => 
      ['READY', 'PREPARING', 'PLACED', 'OUT_FOR_DELIVERY', 'ACCEPTED', 'PENDING'].includes((o.status || '').toUpperCase())
    ) || null;

    const orderHistory = orders.filter(o => 
      ['DELIVERED', 'REJECTED', 'CANCELLED'].includes((o.status || '').toUpperCase())
    );

    return {
      profile: profile || {
        _id: 'mock-rider-1',
        name: 'Delivery Partner',
        email: 'delivery@dominos.com',
        phone: '+91 99999 99999',
        role: 'Delivery Executive',
        status: 'Online'
      },
      liveOrder,
      orderHistory
    };
  }

  static async getOrderById(orderId) {
    try {
      const isObjectId = orderId && orderId.match(/^[0-9a-fA-F]{24}$/);
      const query = isObjectId ? { $or: [{ orderId: orderId }, { _id: orderId }] } : { orderId: orderId };
      const customerOrder = await CustomerOrder.findOne(query).populate('customerId', 'name phone');
      
      if (customerOrder) {
        return this.formatOrder(customerOrder);
      }
    } catch (err) {
      console.error('Error fetching order:', err.message);
    }
    return null;
  }

  static async updateOrderStatus(orderId, status) {
    try {
      const isObjectId = orderId && orderId.match(/^[0-9a-fA-F]{24}$/);
      const query = isObjectId ? { $or: [{ orderId: orderId }, { _id: orderId }] } : { orderId: orderId };
      
      const updatedOrder = await CustomerOrder.findOneAndUpdate(
        query,
        { status },
        { new: true }
      ).populate('customerId', 'name phone');
      
      if (updatedOrder) {
        return this.formatOrder(updatedOrder);
      }
    } catch (err) {
      console.error('Error updating order status:', err.message);
    }
    return null;
  }
}
