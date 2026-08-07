import { userModel } from "../models/user-model.js";
import bcrypt from "bcrypt";
import { roleModel } from "../models/user-role.js";
import { userRoleService } from "./role-service.js";
import { genrateToken } from "../../../shared/services/tokenService.js";

export const registerService = async (userData) => {
  const { name, email, phone, password, address, role } = userData;

  const existingUser = await userModel.findOne({
    $or: [{ phone }, { email }],
  });

  if (existingUser) {
    throw new Error("User already exists");
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const roleData = await userRoleService(role);

  const isActive = role === "customer";

  const user = await userModel.create({
    name,
    email,
    phone,
    passwordHash,
    address,
    roleId: roleData._id,
    isActive,
  });

  return user;
};


export const loginService = async (userData) => {
  const { email, password } = userData;

  const exsitingUser = await userModel.findOne({ email }).populate({
    path: 'roleId',
    populate: { path: 'rights' }
  });
  if (!exsitingUser) {
    throw new Error("user not exsist");
  }
  const checkPassword=await bcrypt.compare(password,exsitingUser.passwordHash);
  if(!checkPassword){
    throw new Error("password is incorrect");
  }

  if(exsitingUser.isActive===false){
    throw new Error("you are banned by admin");
  }
  console.log("Existing user",exsitingUser._id);
  
  const token=await genrateToken(exsitingUser._id);
  
  const user = exsitingUser.toObject();
  delete user.passwordHash;

 return { token, user };
  
};







