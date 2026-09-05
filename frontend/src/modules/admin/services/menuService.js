// Admin Menu Service — CRUD operations via main backend
import adminApi from './adminApi';

/**
 * GET /admin/menu — returns all menu items (including unavailable for admin view).
 */
export async function getMenuItems(filters = {}) {
  try {
    const response = await adminApi.get('/menu', { params: filters });
    return response.data?.data ?? response.data;
  } catch (err) {
    console.error('Failed to fetch menu items:', err.message);
    throw err;
  }
}

/**
 * GET /admin/menu/categories — returns all categories.
 */
export async function getCategories() {
  try {
    const response = await adminApi.get('/menu/categories');
    return response.data?.data ?? response.data;
  } catch (err) {
    console.error('Failed to fetch categories:', err.message);
    throw err;
  }
}

/**
 * GET /admin/menu/:id — returns a single menu item.
 */
export async function getMenuItemById(id) {
  try {
    const response = await adminApi.get(`/menu/${id}`);
    return response.data?.data ?? response.data;
  } catch (err) {
    console.error('Failed to fetch menu item:', err.message);
    throw err;
  }
}

/**
 * POST /admin/menu — Create a new menu item (Admin only).
 */
export async function createMenuItem(itemData) {
  try {
    const response = await adminApi.post('/menu', itemData);
    return response.data?.data ?? response.data;
  } catch (err) {
    console.error('Failed to create menu item:', err.message);
    throw err;
  }
}

/**
 * PATCH /admin/menu/:id — Update a menu item (Admin only).
 */
export async function updateMenuItem(id, updates) {
  try {
    const response = await adminApi.patch(`/menu/${id}`, updates);
    return response.data?.data ?? response.data;
  } catch (err) {
    console.error('Failed to update menu item:', err.message);
    throw err;
  }
}

/**
 * DELETE /admin/menu/:id — Delete a menu item (Admin only).
 */
export async function deleteMenuItem(id) {
  try {
    const response = await adminApi.delete(`/menu/${id}`);
    return response.data?.data ?? response.data;
  } catch (err) {
    console.error('Failed to delete menu item:', err.message);
    throw err;
  }
}
