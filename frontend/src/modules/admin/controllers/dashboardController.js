// Admin Dashboard Controller — adapted for integrated app
import { getDashboardStats, getSalesData, getRevenueData } from '../services/dashboardService';
import { DashboardModel } from '../models/DashboardModel';

export async function fetchDashboardData() {
  const raw = await getDashboardStats();
  return new DashboardModel(raw);
}

export async function fetchSalesChart(period) {
  return await getSalesData(period);
}

export async function fetchRevenueChart(period) {
  return await getRevenueData(period);
}
