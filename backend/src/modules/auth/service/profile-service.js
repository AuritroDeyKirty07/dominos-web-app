import { userModel } from "../models/user-model.js";

export const getProfileService = async (userId) => {
  const currentUser = await userModel
    .findById(userId)
    .select("-passwordHash");

  if (!currentUser) {
    throw new Error("User not found");
  }

  return currentUser;
};

export const updateProfileService = async (userId, userData) => {
  const { name, phone, address, email } = userData;

  const updatedUser = await userModel.findByIdAndUpdate(
    userId,
    {
      name,
      phone,
      address,
      email,
    },
    {
      new: true,
      runValidators: true,
    }
  ).select("-passwordHash");

  if (!updatedUser) {
    throw new Error("User not found");
  }

  return updatedUser;
};