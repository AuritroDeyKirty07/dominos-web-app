import { userModel } from "../models/user-model.js";
import bcrypt from "bcrypt";
import { userRoleService } from "./role-service.js";
import { roleModel } from "../models/user-role.js";
import { rightModel } from "../models/right-model.js";
import mongoose from "mongoose";
// import { roleModel } from "../models/role-model.js";

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

export const changeUserRoleService = async (userId, roleName) => {

  const user = await userModel.findById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  const role = await roleModel.findOne({ name: roleName });

  if (!role) {
    throw new Error("Role not found");
  }

  user.roleId = role._id;

  await user.save();

  return await user.populate("roleId");
};

export const changeUserStatusService = async (userId, isActive) => {

  const user = await userModel.findById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  if (user.isActive === isActive) {
    throw new Error(
      `User is already ${isActive ? "active" : "inactive"}`
    );
  }

  user.isActive = isActive;

  await user.save();

  return user;
};

export const getAllRolesService = async () => {
  const roles = await roleModel.find().populate("rights");

  return roles;
};


export const getAllRightsService = async () => {
  const rights = await rightModel.find();

  return rights;
};

export const updateRoleRightsService = async (roleId, rights) => {

  const role = await roleModel.findById(roleId);

  if (!role) {
    throw new Error("Role not found");
  }

  if (!Array.isArray(rights)) {
    throw new Error("Rights must be an array");
  }

  for (const rightId of rights) {
    if (!mongoose.Types.ObjectId.isValid(rightId)) {
      throw new Error(`Invalid Right ID: ${rightId}`);
    }

    const right = await rightModel.findById(rightId);

    if (!right) {
      throw new Error(`Right not found: ${rightId}`);
    }
  }

  role.rights = rights;

  await role.save();

  return await role.populate("rights");
};