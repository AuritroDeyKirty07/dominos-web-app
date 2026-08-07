import { userModel } from "../models/user-model.js";
import bcrypt from "bcrypt";
import { userRoleService } from "./role-service.js";

export const createStaffService = async (staffData) => {
  const { name, email, phone, password, address, role } = staffData;

  if (!role || role === "customer") {
    throw new Error("Invalid role for staff creation");
  }

  const existingUser = await userModel.findOne({
    $or: [{ phone }, { email }],
  });

  if (existingUser) {
    throw new Error("User already exists with this phone or email");
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const roleData = await userRoleService(role);
  const isActive = true;

  const staff = await userModel.create({
    name,
    email,
    phone,
    passwordHash,
    address,
    roleId: roleData._id,
    isActive,
  });

  return staff;
};
