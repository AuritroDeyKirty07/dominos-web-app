// Admin Employee Controller — adapted for integrated app
import {
  getEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  requestNewRole,
} from '../services/employeeService';
import { EmployeeModel } from '../models/EmployeeModel';

export async function fetchAllEmployees(role) {
  const raw = await getEmployees(role);
  return raw.map((e) => new EmployeeModel(e));
}

export async function fetchEmployeeById(id) {
  const raw = await getEmployeeById(id);
  return raw ? new EmployeeModel(raw) : null;
}

export async function addEmployee(employeeData) {
  const created = await createEmployee(employeeData);
  return new EmployeeModel(created);
}

export async function editEmployee(id, updates) {
  const updated = await updateEmployee(id, updates);
  return new EmployeeModel(updated);
}

export async function removeEmployee(id) {
  return await deleteEmployee(id);
}

export async function submitRoleRequest(role, notes = '') {
  return await requestNewRole({ role, notes });
}
