import mongoose from 'mongoose';

const customerSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true, index: true },
    loyaltyPoints: { type: Number, default: 420 },
    preferences: {
      vegOnly: { type: Boolean, default: false },
      spiceLevel: { type: String, default: 'Medium' },
      contactlessDelivery: { type: Boolean, default: true },
    },
  },
  {
    timestamps: true,
  }
);

export const Customer = mongoose.models.Customer || mongoose.model('Customer', customerSchema);
