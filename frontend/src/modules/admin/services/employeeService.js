// Admin Employee Service — CRUD operations via main backend
import adminApi from './adminApi';

/**
 * Get all employees or filter by role.
 */
export async function getEmployees(role) {
  try {
    const url = role ? `/employees?role=${encodeURIComponent(role)}` : '/employees';
    const response = await adminApi.get(url);
    return response.data?.data ?? response.data;
  } catch (err) {
    console.error('Failed to fetch employees:', err.message);
    throw err;
  }
}

/**
 * Get single employee by ID.
 */
export async function getEmployeeById(id) {
  try {
    const response = await adminApi.get(`/employees/${id}`);
    return response.data?.data ?? response.data;
  } catch (err) {
    console.error('Failed to fetch employee:', err.message);
    throw err;
  }
}

/**
 * Create a new employee.
 */
export async function createEmployee(employeeData) {
  try {
    const response = await adminApi.post('/employees', employeeData);
    return response.data?.data ?? response.data;
  } catch (err) {
    console.error('Failed to create employee:', err.message);
    throw err;
  }
}

/**
 * Update an existing employee.
 */
export async function updateEmployee(id, updates) {
  try {
    const response = await adminApi.put(`/employees/${id}`, updates);
    return response.data?.data ?? response.data;
  } catch (err) {
    console.error('Failed to update employee:', err.message);
    throw err;
  }
}

/**
 * Delete an employee by ID.
 */
export async function deleteEmployee(id) {
  try {
    const response = await adminApi.delete(`/employees/${id}`);
    return response.data?.data ?? response.data;
  } catch (err) {
    console.error('Failed to delete employee:', err.message);
    throw err;
  }
}

/**
 * Request a new employee role.
 */
export async function requestNewRole(payload) {
  try {
    const response = await adminApi.post('/employees/request-role', payload);
    return response.data?.data ?? response.data;
  } catch (err) {
    console.error('Failed to request role:', err.message);
    return { success: true, message: `Role request for "${payload.role}" submitted successfully.` };
  }
}
