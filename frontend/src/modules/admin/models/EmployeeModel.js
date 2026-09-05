// src/models/EmployeeModel.js

export class EmployeeModel {
  constructor(data = {}) {
    this.id = data.id || 0;
    this.name = data.name || '';
    this.role = data.role || 'Cook';
    this.status = data.status || 'Active';
    this.phone = data.phone || '';
    this.email = data.email || '';
    this.specialty = data.specialty || '';
    this.shift = data.shift || 'Morning';
    this.vehicleType = data.vehicleType || 'Bike';
    this.vehicleNumber = data.vehicleNumber || '';
    this.rating = data.rating !== undefined ? data.rating : 4.8;
    this.joinedAt = data.joinedAt || new Date().toISOString();
    this.ordersHandled = data.ordersHandled || 0;
  }

  get isActive() {
    return this.status === 'Active' || this.status === 'On Delivery';
  }
}

export default EmployeeModel;
