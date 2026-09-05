// src/components/tables/OrdersTable.jsx
import React, { useState } from 'react';
import { FiEye, FiCheckCircle, FiXCircle, FiClock, FiPhone, FiUser, FiMapPin, FiCreditCard } from 'react-icons/fi';
import { formatCurrency, formatDate } from '../../shared/utils/format';
import { TableSkeleton } from '../loaders/SkeletonLoader';

export default function OrdersTable({ orders = [], loading = false, onUpdateStatus, onCancelOrder }) {
  const [selectedOrder, setSelectedOrder] = useState(null);

  if (loading) return <TableSkeleton />;

  const getStatusBadge = (status) => {
    const s = String(status || '').toLowerCase();
    if (s.includes('deliver')) {
      return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
    }
    if (s.includes('out for delivery')) {
      return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20';
    }
    if (s.includes('baking') || s.includes('cook') || s.includes('prepar') || s.includes('quality')) {
      return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';
    }
    if (s.includes('cancel')) {
      return 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20';
    }
    return 'bg-primary/10 text-primary border-primary/20';
  };

  const getPaymentBadge = (status) => {
    const s = String(status || '').toUpperCase();
    if (['PAID', 'DEMO_PAID'].includes(s)) {
      return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400';
    }
    if (['PENDING', 'COD'].includes(s)) {
      return 'bg-amber-500/10 text-amber-600 dark:text-amber-400';
    }
    if (s.includes('REFUND')) {
      return 'bg-purple-500/10 text-purple-600 dark:text-purple-400';
    }
    return 'bg-red-500/10 text-red-600 dark:text-red-400';
  };

  const formatItemsSummary = (items) => {
    if (!items || items.length === 0) return 'No items';
    if (typeof items[0] === 'string') return items.join(', ');
    return items.map((i) => `${i.name || 'Pizza'} (x${i.quantity || 1})`).join(', ');
  };

  return (
    <div className="rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-card overflow-hidden transition-all duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-lg font-bold text-gray-800 dark:text-white">Customer Orders</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">Live order lifecycle and payment records from dominos_customers</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700 text-xs font-semibold uppercase text-gray-400">
              <th className="py-3 px-4">Order ID</th>
              <th className="py-3 px-4">Customer</th>
              <th className="py-3 px-4">Phone</th>
              <th className="py-3 px-4">Items</th>
              <th className="py-3 px-4">Total</th>
              <th className="py-3 px-4">Payment</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Order Time</th>
              <th className="py-3 px-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50 text-sm">
            {orders.length === 0 ? (
              <tr>
                <td colSpan="9" className="py-8 text-center text-gray-500 dark:text-gray-400">
                  No orders found.
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-primary font-mono text-xs">{order.id}</td>
                  <td className="py-3.5 px-4 font-medium text-gray-800 dark:text-white">
                    <div className="flex items-center gap-2">
                      <FiUser className="text-gray-400" />
                      <span>{order.customerName}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-gray-600 dark:text-gray-300">
                    <div className="flex items-center gap-1.5">
                      <FiPhone className="text-xs text-gray-400" />
                      <span>{order.phone}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-gray-600 dark:text-gray-300 max-w-xs truncate" title={formatItemsSummary(order.items)}>
                    {formatItemsSummary(order.items)}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-gray-900 dark:text-white">
                    {formatCurrency(order.total)}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getPaymentBadge(order.paymentStatus)}`}>
                      {order.paymentStatus || 'PAID'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(order.deliveryStatus || order.status)}`}>
                      {order.deliveryStatus || order.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-xs text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <FiClock className="text-gray-400" />
                      <span>{formatDate(order.createdAt)}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        title="View Details"
                        className="p-1.5 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                      >
                        <FiEye />
                      </button>

                      {order.isActive && (
                        <>
                          <button
                            onClick={() => onUpdateStatus && onUpdateStatus(order.id, 'Delivered')}
                            title="Mark Delivered"
                            className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 transition-colors"
                          >
                            <FiCheckCircle />
                          </button>
                          <button
                            onClick={() => onCancelOrder && onCancelOrder(order.id)}
                            title="Cancel Order"
                            className="p-1.5 rounded-lg bg-red-500/10 text-red-600 hover:bg-red-500/20 transition-colors"
                          >
                            <FiXCircle />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Detailed Order Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 w-full max-w-lg shadow-2xl space-y-4 animate-fade-in max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-3">
              <div>
                <span className="text-xs font-semibold text-primary uppercase tracking-wider">Order Details</span>
                <h3 className="font-black text-xl text-gray-800 dark:text-white">
                  {selectedOrder.id}
                </h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-500 hover:text-gray-800 dark:hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Customer & Address Info */}
            <div className="bg-gray-50 dark:bg-gray-700/40 rounded-2xl p-4 space-y-2 text-sm">
              <div className="flex items-center gap-2 font-bold text-gray-900 dark:text-white">
                <FiUser className="text-primary" />
                <span>{selectedOrder.customerName}</span>
                <span className="text-xs text-gray-500 font-normal">({selectedOrder.phone})</span>
              </div>
              {selectedOrder.deliveryAddress && (
                <div className="flex items-start gap-2 text-xs text-gray-600 dark:text-gray-300">
                  <FiMapPin className="text-primary flex-shrink-0 mt-0.5" />
                  <span>
                    {selectedOrder.deliveryAddress.addressLine1 || selectedOrder.deliveryAddress.address}
                    {selectedOrder.deliveryAddress.city ? `, ${selectedOrder.deliveryAddress.city}` : ''}
                    {selectedOrder.deliveryAddress.pinCode ? ` - ${selectedOrder.deliveryAddress.pinCode}` : ''}
                  </span>
                </div>
              )}
              <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                <FiCreditCard className="text-emerald-500" />
                <span>Payment: <strong>{selectedOrder.paymentMethod || 'Razorpay Online'}</strong> ({selectedOrder.paymentStatus})</span>
              </div>
            </div>

            {/* Order Items */}
            <div>
              <h4 className="text-xs font-bold uppercase text-gray-400 mb-2">Item Breakdown</h4>
              <div className="divide-y divide-gray-100 dark:divide-gray-700/50">
                {Array.isArray(selectedOrder.items) && typeof selectedOrder.items[0] === 'object' ? (
                  selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="py-2.5 flex justify-between items-center text-sm">
                      <div>
                        <p className="font-semibold text-gray-800 dark:text-white">{item.name}</p>
                        {item.customization && (
                          <p className="text-xs text-gray-400">
                            {item.customization.size || 'Medium'} | {item.customization.crust || 'Hand Tossed'}
                          </p>
                        )}
                        <p className="text-xs text-gray-500">Qty: {item.quantity || 1} × {formatCurrency(item.price || 0)}</p>
                      </div>
                      <span className="font-bold text-gray-900 dark:text-white">
                        {formatCurrency(item.itemTotal || (item.price || 0) * (item.quantity || 1))}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm py-2 text-gray-700 dark:text-gray-300">
                    {Array.isArray(selectedOrder.items) ? selectedOrder.items.join(', ') : selectedOrder.items}
                  </p>
                )}
              </div>
            </div>

            {/* Pricing Summary */}
            <div className="bg-gray-50 dark:bg-gray-700/40 rounded-2xl p-4 space-y-1.5 text-xs text-gray-600 dark:text-gray-300 border border-gray-100 dark:border-gray-700">
              {selectedOrder.pricing?.subtotal && (
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>{formatCurrency(selectedOrder.pricing.subtotal)}</span>
                </div>
              )}
              {selectedOrder.pricing?.discount > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>Discount:</span>
                  <span>-{formatCurrency(selectedOrder.pricing.discount)}</span>
                </div>
              )}
              {selectedOrder.pricing?.tax > 0 && (
                <div className="flex justify-between">
                  <span>Taxes & Charges:</span>
                  <span>{formatCurrency(selectedOrder.pricing.tax)}</span>
                </div>
              )}
              <div className="flex justify-between pt-2 border-t border-gray-200 dark:border-gray-600 text-sm font-bold text-gray-900 dark:text-white">
                <span>Grand Total:</span>
                <span className="text-primary font-black">{formatCurrency(selectedOrder.total)}</span>
              </div>
            </div>

            {/* Timeline */}
            {selectedOrder.statusTimeline && selectedOrder.statusTimeline.length > 0 && (
              <div>
                <h4 className="text-xs font-bold uppercase text-gray-400 mb-2">Status History</h4>
                <div className="space-y-1.5 text-xs text-gray-500 dark:text-gray-400">
                  {selectedOrder.statusTimeline.map((tl, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <span className="font-semibold text-gray-700 dark:text-gray-300">{tl.status}</span>
                      <span>{new Date(tl.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-3 border-t border-gray-200 dark:border-gray-700 flex justify-end">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-5 py-2 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary/90 transition-all shadow-md shadow-primary/20"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
