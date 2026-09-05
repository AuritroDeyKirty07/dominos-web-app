// Admin User/Customer Service — manages customers via main backend
import adminApi from './adminApi';

/**
 * Get all users/customers.
 */
export async function getUsers() {
  try {
    const response = await adminApi.get('/customers');
    return response.data?.data ?? response.data;
  } catch (err) {
    console.error('Failed to fetch customers:', err.message);
    throw err;
  }
}

/**
 * Get single user by ID.
 */
export async function getUserById(id) {
  try {
    const response = await adminApi.get(`/customers/${id}`);
    return response.data?.data ?? response.data;
  } catch (err) {
    console.error('Failed to fetch customer:', err.message);
    throw err;
  }
}

/**
 * Create a new user.
 */
export async function createUser(userData) {
  try {
    const response = await adminApi.post('/customers', userData);
    return response.data?.data ?? response.data;
  } catch (err) {
    console.error('Failed to create customer:', err.message);
    throw err;
  }
}

/**
 * Update an existing user.
 */
export async function updateUser(id, updates) {
  try {
    const response = await adminApi.put(`/customers/${id}`, updates);
    return response.data?.data ?? response.data;
  } catch (err) {
    console.error('Failed to update customer:', err.message);
    throw err;
  }
}

/**
 * Delete a user by ID.
 */
export async function deleteUser(id) {
  try {
    const response = await adminApi.delete(`/customers/${id}`);
    return response.data?.data ?? response.data;
  } catch (err) {
    console.error('Failed to delete customer:', err.message);
    throw err;
  }
}

/**
 * Update customer status (active/inactive).
 */
export async function updateUserStatus(id, isActive) {
  try {
    const response = await adminApi.patch(`/customers/${id}/status`, { isActive });
    return response.data?.data ?? response.data;
  } catch (err) {
    console.error('Failed to update customer status:', err.message);
    throw err;
  }
}
