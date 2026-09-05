// src/shared/helpers/calculations.js

/**
 * Calculate revenue for a given period from orders.
 * @param {Array} orders - Array of order objects with { total, createdAt, status }
 * @param {'today'|'weekly'|'monthly'|'all'} period
 * @returns {number}
 */
export function calculateRevenue(orders, period = 'all') {
  const now = new Date();
  const filtered = orders.filter((order) => {
    if (order.status === 'Cancelled' || order.deliveryStatus === 'Cancelled') return false;
    const orderDate = new Date(order.createdAt);
    switch (period) {
      case 'today': {
        return orderDate.toDateString() === now.toDateString();
      }
      case 'weekly': {
        const weekAgo = new Date(now);
        weekAgo.setDate(weekAgo.getDate() - 7);
        return orderDate >= weekAgo;
      }
      case 'monthly': {
        return (
          orderDate.getMonth() === now.getMonth() &&
          orderDate.getFullYear() === now.getFullYear()
        );
      }
      default:
        return true;
    }
  });
  return filtered.reduce((sum, o) => sum + (o.total || 0), 0);
}

/**
 * Count orders by status.
 * @param {Array} orders
 * @param {string} status
 * @returns {number}
 */
export function countOrdersByStatus(orders, status) {
  return orders.filter((o) => o.deliveryStatus === status).length;
}

/**
 * Calculate average order value.
 * @param {Array} orders
 * @returns {number}
 */
export function averageOrderValue(orders) {
  if (!orders.length) return 0;
  const total = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  return Math.round(total / orders.length);
}

/**
 * Find most ordered item from orders.
 * @param {Array} orders
 * @returns {string}
 */
export function mostOrderedItem(orders) {
  const itemCount = {};
  orders.forEach((order) => {
    (order.items || []).forEach((item) => {
      itemCount[item] = (itemCount[item] || 0) + 1;
    });
  });
  const sorted = Object.entries(itemCount).sort((a, b) => b[1] - a[1]);
  return sorted.length ? sorted[0][0] : 'N/A';
}

/**
 * Find the top customer by total spend.
 * @param {Array} orders
 * @returns {{ name: string, total: number }}
 */
export function topCustomer(orders) {
  const spendMap = {};
  orders.forEach((o) => {
    if (!spendMap[o.customerName]) spendMap[o.customerName] = 0;
    spendMap[o.customerName] += o.total || 0;
  });
  const sorted = Object.entries(spendMap).sort((a, b) => b[1] - a[1]);
  return sorted.length ? { name: sorted[0][0], total: sorted[0][1] } : { name: 'N/A', total: 0 };
}

/**
 * Calculate revenue growth percentage between two periods.
 * @param {number} current
 * @param {number} previous
 * @returns {number}
 */
export function revenueGrowth(current, previous) {
  if (previous === 0) return current > 0 ? 100 : 0;
  return Math.round(((current - previous) / previous) * 100);
}
