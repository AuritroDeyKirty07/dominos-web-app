// Admin User Controller — adapted for integrated app
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from '../services/userService';
import { UserModel } from '../models/UserModel';

export async function fetchAllUsers() {
  const raw = await getUsers();
  return raw.map((u) => new UserModel(u));
}

export async function fetchUserById(id) {
  const raw = await getUserById(id);
  return raw ? new UserModel(raw) : null;
}

export async function addUser(userData) {
  const created = await createUser(userData);
  return new UserModel(created);
}

export async function editUser(id, updates) {
  const updated = await updateUser(id, updates);
  return new UserModel(updated);
}

export async function removeUser(id) {
  return await deleteUser(id);
}
