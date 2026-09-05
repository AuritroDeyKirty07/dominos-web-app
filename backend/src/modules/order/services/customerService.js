import { Customer } from '../models/Customer.js';
import { Address } from '../models/Address.js';
import { userModel } from '../../auth/models/user-model.js';

export const getCustomerProfile = async (userId) => {
  // 1. Fetch main user details from Team 1 Auth
  const user = await userModel.findById(userId).select('-passwordHash');
  if (!user) {
    throw new Error('User not found');
  }

  // 2. Fetch or create Customer extra metadata (loyalty points, preferences)
  let customerDetails = await Customer.findOne({ userId });
  if (!customerDetails) {
    customerDetails = await Customer.create({ userId });
  }

  // 3. Fetch customer addresses from Address collection
  const addresses = await Address.find({ customerId: userId }).sort({ isDefault: -1, createdAt: -1 });

  return {
    customerId: user._id.toString(),
    name: user.name,
    email: user.email,
    phone: user.phone,
    loyaltyPoints: customerDetails.loyaltyPoints,
    addresses: addresses,
    preferences: customerDetails.preferences,
  };
};

export const updateCustomerProfile = async (userId, updates) => {
  // Update name/phone/email if provided
  const userFields = {};
  if (updates.name) userFields.name = updates.name;
  if (updates.phone) userFields.phone = updates.phone;
  if (updates.email) userFields.email = updates.email;

  if (Object.keys(userFields).length > 0) {
    await userModel.findByIdAndUpdate(userId, { $set: userFields });
  }

  // Update preferences if provided
  if (updates.preferences) {
    await Customer.findOneAndUpdate(
      { userId },
      { $set: { preferences: updates.preferences } },
      { upsert: true }
    );
  }

  return getCustomerProfile(userId);
};

export const getAddresses = async (userId) => {
  return Address.find({ customerId: userId }).sort({ isDefault: -1, createdAt: -1 });
};

export const addAddress = async (userId, newAddress) => {
  if (newAddress.isDefault) {
    // If setting as default, clear defaults for other addresses first
    await Address.updateMany({ customerId: userId }, { $set: { isDefault: false } });
  } else {
    // If this is the first address, make it default
    const count = await Address.countDocuments({ customerId: userId });
    if (count === 0) {
      newAddress.isDefault = true;
    }
  }

  await Address.create({
    ...newAddress,
    customerId: userId,
  });

  return getAddresses(userId);
};

export const deleteAddress = async (userId, addressId) => {
  const addressToDelete = await Address.findOne({ id: addressId, customerId: userId });
  if (addressToDelete) {
    await Address.deleteOne({ _id: addressToDelete._id });
    // If we deleted the default address, set another one as default
    if (addressToDelete.isDefault) {
      const firstNext = await Address.findOne({ customerId: userId });
      if (firstNext) {
        firstNext.isDefault = true;
        await firstNext.save();
      }
    }
  }
  return getAddresses(userId);
};

export const setDefaultAddress = async (userId, addressId) => {
  await Address.updateMany({ customerId: userId }, { $set: { isDefault: false } });
  await Address.updateOne({ customerId: userId, id: addressId }, { $set: { isDefault: true } });
  return getAddresses(userId);
};
