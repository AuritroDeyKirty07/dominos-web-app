// src/models/DashboardModel.js

export class DashboardModel {
  constructor(data = {}) {
    this.totalUsers = data.totalUsers || 0;
    this.totalOrders = data.totalOrders || 0;
    this.todayOrders = data.todayOrders || 0;
    this.totalItemsSold = data.totalItemsSold || 0;
    this.totalRevenue = data.totalRevenue || 0;
    this.todayRevenue = data.todayRevenue || 0;
    this.weeklyRevenue = data.weeklyRevenue || 0;
    this.monthlyRevenue = data.monthlyRevenue || 0;
    this.todayProfit = data.todayProfit || 0;
    this.totalProfit = data.totalProfit || 0;
    this.activeEmployees = data.activeEmployees || 8;
    this.pendingOrders = data.pendingOrders || 0;
    this.completedOrders = data.completedOrders || 0;
    this.cancelledOrders = data.cancelledOrders || 0;
    this.averageOrderValue = data.averageOrderValue || 0;
    this.revenueGrowth = data.revenueGrowth || 18;
    this.mostOrderedPizza = data.mostOrderedPizza || 'Margherita Classic';
    this.topCustomer = data.topCustomer || { name: 'Alex Morgan', total: 0 };
  }
}

export default DashboardModel;
