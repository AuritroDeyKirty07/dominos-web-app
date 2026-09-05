// Admin Order Controller — adapted for integrated app
import { getOrders, updateOrderStatus, cancelOrder } from '../services/orderService';
import { OrderModel } from '../models/OrderModel';

export async function fetchAllOrders() {
  const raw = await getOrders();
  return raw.map((o) => new OrderModel(o));
}

export async function changeOrderStatus(orderId, newStatus) {
  return await updateOrderStatus(orderId, newStatus);
}

export async function cancelExistingOrder(orderId) {
  return await cancelOrder(orderId);
}
