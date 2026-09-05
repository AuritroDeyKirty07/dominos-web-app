import mongoose from 'mongoose';

const addressSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, default: () => `ADDR-${Date.now()}` },
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    type: { type: String, enum: ['Home', 'Work', 'Other'], default: 'Home' },
    name: { type: String, required: [true, 'Contact name is required'] },
    phone: { type: String, required: [true, 'Phone number is required'] },
    addressLine1: { type: String, required: [true, 'Street address is required'] },
    addressLine2: { type: String, default: '' },
    landmark: { type: String, default: '' },
    city: { type: String, required: [true, 'City is required'], default: 'Bengaluru' },
    state: { type: String, default: 'Karnataka' },
    pinCode: { type: String, required: [true, 'PIN code is required'] },
    isDefault: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

addressSchema.index({ customerId: 1, isDefault: -1 });

export const Address = mongoose.models.Address || mongoose.model('Address', addressSchema);
