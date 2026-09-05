// Admin Menu Controller — adapted for integrated app
import {
  getMenuItems,
  getMenuItemById,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
} from '../services/menuService';
import { MenuItemModel } from '../models/MenuItemModel';

export async function fetchAllMenuItems() {
  const raw = await getMenuItems();
  return raw.map((item) => new MenuItemModel(item));
}

export async function fetchMenuItemById(id) {
  const raw = await getMenuItemById(id);
  return raw ? new MenuItemModel(raw) : null;
}

export async function addMenuItem(itemData) {
  const created = await createMenuItem(itemData);
  return new MenuItemModel(created);
}

export async function editMenuItem(id, updates) {
  const updated = await updateMenuItem(id, updates);
  return new MenuItemModel(updated);
}

export async function removeMenuItem(id) {
  return await deleteMenuItem(id);
}
