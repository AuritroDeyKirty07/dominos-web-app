// Admin Order Service — manages orders via main backend
import adminApi from './adminApi';

/**
 * Get all orders.
 */
export async function getOrders(params = {}) {
  try {
    const response = await adminApi.get('/orders', { params });
    return response.data?.data ?? response.data;
  } catch (err) {
    console.error('Failed to fetch orders:', err.message);
    throw err;
  }
}

/**
 * Get single order by ID.
 */
export async function getOrderById(orderId) {
  try {
    const response = await adminApi.get(`/orders/${orderId}`);
    return response.data?.data ?? response.data;
  } catch (err) {
    console.error('Failed to fetch order:', err.message);
    throw err;
  }
}

/**
 * Update the status of an order.
 */
export async function updateOrderStatus(orderId, newStatus) {
  try {
    const response = await adminApi.patch(`/orders/${orderId}/status`, { status: newStatus });
    return response.data?.data ?? response.data;
  } catch (err) {
    console.error('Failed to update order status:', err.message);
    throw err;
  }
}

/**
 * Cancel an order.
 */
export async function cancelOrder(orderId) {
  try {
    const response = await adminApi.patch(`/orders/${orderId}/cancel`);
    return response.data?.data ?? response.data;
  } catch (err) {
    console.error('Failed to cancel order:', err.message);
    throw err;
  }
}
