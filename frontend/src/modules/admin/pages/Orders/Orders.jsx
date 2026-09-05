// src/pages/Orders/Orders.jsx
import React, { useState, useEffect } from 'react';
import OrdersTable from '../../components/tables/OrdersTable';
import { fetchAllOrders, changeOrderStatus, cancelExistingOrder } from '../../controllers/orderController';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  const loadOrders = async () => {
    setLoading(true);
    try {
      const data = await fetchAllOrders();
      setOrders(data);
    } catch (err) {
      console.error('Failed to load orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleUpdateStatus = async (orderId, newStatus) => {
    await changeOrderStatus(orderId, newStatus);
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, deliveryStatus: newStatus } : o))
    );
  };

  const handleCancelOrder = async (orderId) => {
    await cancelExistingOrder(orderId);
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, deliveryStatus: 'Cancelled', paymentStatus: 'Refunded' } : o))
    );
  };

  const filteredOrders = orders.filter((o) => {
    if (filter === 'All') return true;
    return o.deliveryStatus === filter;
  });

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-800 dark:text-white tracking-tight">
            Orders Management
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Track, update status, and manage active customer orders
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {['All', 'Order Received', 'Preparing', 'Cooking', 'Out for Delivery', 'Delivered', 'Cancelled'].map((st) => (
            <button
              key={st}
              onClick={() => setFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                filter === st
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      <OrdersTable
        orders={filteredOrders}
        loading={loading}
        onUpdateStatus={handleUpdateStatus}
        onCancelOrder={handleCancelOrder}
      />
    </div>
  );
}
