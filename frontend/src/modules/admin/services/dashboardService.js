// Admin Dashboard Service — fetches real data from main backend
import adminApi from './adminApi';

/**
 * Get aggregated dashboard statistics.
 */
export async function getDashboardStats() {
  try {
    const response = await adminApi.get('/analytics/dashboard');
    return response.data?.data ?? response.data;
  } catch (err) {
    console.error('Failed to fetch dashboard stats:', err.message);
    throw err;
  }
}

/**
 * Get sales chart data for a given period.
 * @param {'today'|'weekly'|'monthly'|'yearly'} period
 */
export async function getSalesData(period = 'weekly') {
  try {
    const response = await adminApi.get(`/analytics/sales?period=${period}`);
    return response.data?.data ?? response.data;
  } catch (err) {
    console.error('Failed to fetch sales data:', err.message);
    throw err;
  }
}

/**
 * Get revenue analytics data for a given period.
 * @param {'today'|'weekly'|'monthly'} period
 */
export async function getRevenueData(period = 'weekly') {
  try {
    const response = await adminApi.get(`/analytics/revenue?period=${period}`);
    return response.data?.data ?? response.data;
  } catch (err) {
    console.error('Failed to fetch revenue data:', err.message);
    throw err;
  }
}
