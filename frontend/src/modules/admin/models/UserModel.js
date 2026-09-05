// src/models/UserModel.js

export class UserModel {
  constructor(data = {}) {
    this.id = data.id || 0;
    this.name = data.name || '';
    this.email = data.email || '';
    this.phone = data.phone || '';
    this.address = data.address || '';
    this.city = data.city || '';
    this.role = data.role || 'Customer';
    this.ordersCount = data.ordersCount || 0;
    this.totalSpent = data.totalSpent || 0;
    this.joinedAt = data.joinedAt || new Date().toISOString();
    this.isActive = data.isActive !== undefined ? data.isActive : true;
  }
}

export default UserModel;
