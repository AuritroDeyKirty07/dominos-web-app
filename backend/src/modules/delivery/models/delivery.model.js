import mongoose from 'mongoose';

const deliveryOrderSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true },
  customerName: { type: String, required: true, default: 'Bhukasur' },
  customerPhone: { type: String, default: '+91 98765 43210' },
  restaurantName: { type: String, default: "Domino's Pizza - Connaught Place" },
  restaurantAddress: { type: String, default: 'Plot 14, Outer Circle, Connaught Place, New Delhi' },
  restaurantMapUrl: { type: String, default: 'https://maps.app.goo.gl/igoxP8L3S527o5Qh7' },
  restaurantCoords: {
    lat: { type: Number, default: 28.6139 },
    lng: { type: Number, default: 77.2090 }
  },
  deliveryAddress: { 
    type: String, 
    default: 'Flat 402, B-Block, Sunshine Heights, Ring Road, Sector 14, New Delhi - 110001' 
  },
  customerCoords: {
    lat: { type: Number, default: 28.6324 },
    lng: { type: Number, default: 77.2187 }
  },
  items: [
    {
      name: String,
      quantity: Number,
      price: Number,
      size: String
    }
  ],
  totalAmount: { type: Number, required: true },
  paymentStatus: { type: String, default: 'COD (Cash on Delivery)' },
  status: { 
    type: String, 
    enum: ['PENDING', 'ACCEPTED', 'REJECTED', 'OUT_FOR_DELIVERY', 'DELIVERED'],
    default: 'PENDING'
  },
  createdAt: { type: Date, default: Date.now }
});

const deliveryProfileSchema = new mongoose.Schema({
  name: { type: String, default: 'Rahul Sharma' },
  role: { type: String, default: 'Senior Delivery Executive' },
  rating: { type: Number, default: 4.9 },
  completedOrdersCount: { type: Number, default: 148 },
  earningsToday: { type: Number, default: 1450 },
  status: { type: String, default: 'Online' },
  vehicle: { type: String, default: 'Honda Activa (DL 3S CW 9081)' }
});

export const DeliveryOrderModel = mongoose.models.DeliveryOrder || mongoose.model('DeliveryOrder', deliveryOrderSchema);
export const DeliveryProfileModel = mongoose.models.DeliveryProfile || mongoose.model('DeliveryProfile', deliveryProfileSchema);
