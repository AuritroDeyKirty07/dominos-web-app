import mongoose from 'mongoose';

const employeeSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  role: {
    type: String,
    enum: ['Cook', 'Delivery Driver', 'Manager', 'Cashier', 'Kitchen Helper'],
    required: true,
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive', 'On Break', 'On Delivery', 'Off Duty'],
    default: 'Active',
  },
  phone: { type: String, default: '' },
  email: { type: String, default: '' },
  // Cook-specific attributes
  specialty: { type: String, default: 'General' },
  shift: { type: String, default: 'Morning' },
  // Delivery-specific attributes
  vehicleType: { type: String, default: 'Bike' },
  vehicleNumber: { type: String, default: '' },
  rating: { type: Number, default: 4.8 },
  ordersHandled: { type: Number, default: 0 },
  joinedAt: { type: Date, default: Date.now },
});

export const Employee = mongoose.models.Employee || mongoose.model('Employee', employeeSchema);
