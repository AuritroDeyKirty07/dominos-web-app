import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useOrders } from '../hooks/useOrders.js';
import { useCart } from '../hooks/useCart.js';
import { Button } from '../components/common/Button.jsx';
import { Badge } from '../components/common/Badge.jsx';
import { Spinner } from '../components/common/Spinner.jsx';
import { EmptyState } from '../components/common/EmptyState.jsx';
import { formatCurrency, formatDate } from '../utils/formatters.js';
import {
  Clock,
  Bike,
  PackageCheck,
  RotateCcw,
  ChevronRight,
  Pizza,
  MapPin,
  FileText,
} from 'lucide-react';

export const OrderHistoryPage = () => {
  const { orders, isLoading, refreshOrders } = useOrders();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    refreshOrders();
  }, []);

  const handleReorder = (order) => {
    if (!order.items) return;
    order.items.forEach((item) => {
      addToCart(item, item.customization, item.quantity);
    });
    navigate('/cart');
  };

  const getStatusBadge = (status) => {
    switch (status?.toUpperCase()) {
      case 'DELIVERED':
        return <Badge variant="success" size="sm">Delivered</Badge>;
      case 'CANCELLED':
        return <Badge variant="danger" size="sm">Cancelled</Badge>;
      case 'OUT_FOR_DELIVERY':
      case 'OUT FOR DELIVERY':
        return <Badge variant="brand" size="sm" className="animate-pulse">Out for Delivery</Badge>;
      default:
        return <Badge variant="primary" size="sm" className="animate-pulse">In Kitchen</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center p-20">
        <Spinner size="lg" />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="w-full px-[5%] py-16">
        <EmptyState
          icon={Pizza}
          title="No Orders Placed Yet"
          description="Looks like you haven't placed any pizza orders with Domino's yet. Explore the menu to order your first meal!"
          actionText="Browse Menu"
          onAction={() => navigate('/menu')}
        />
      </div>
    );
  }

  return (
    <div className="w-full px-[5%] py-8 space-y-6">
      {/* Header */}
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-3xl font-black font-brand text-slate-900 tracking-wide">
          MY ORDER HISTORY
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Track in-flight orders, review receipts, or reorder past favorites
        </p>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {orders.map((order) => {
          const isActive = order.status !== 'DELIVERED' && order.status !== 'CANCELLED';

          return (
            <div
              key={order.orderId}
              className={`bg-white rounded-3xl border p-6 transition-all duration-200 shadow-sm hover:shadow-dominos ${
                isActive ? 'border-dominos-blue ring-2 ring-dominos-blue/20 bg-dominos-blue/[0.01]' : 'border-slate-200'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="font-mono font-black text-base text-slate-900">
                    #{order.orderId}
                  </span>
                  {getStatusBadge(order.status)}
                  <span className="text-xs text-slate-400">
                    {formatDate(order.createdAt)}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-500">Paid via {order.paymentMethod}</span>
                  <span className="text-base font-black text-slate-900 font-brand">
                    {formatCurrency(order.pricing?.grandTotal)}
                  </span>
                </div>
              </div>

              {/* Order Items Preview */}
              <div className="py-4 space-y-2">
                <div className="flex flex-wrap gap-2">
                  {order.items?.map((item, idx) => (
                    <span
                      key={idx}
                      className="text-xs bg-slate-100 text-slate-800 px-3 py-1.5 rounded-xl font-medium border border-slate-200/60"
                    >
                      {item.quantity}× {item.name} {item.customization ? `(${item.customization.size})` : ''}
                    </span>
                  ))}
                </div>

                <p className="text-xs text-slate-500 flex items-center gap-1.5 pt-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>Delivered to: {order.deliveryAddress?.addressLine1}, {order.deliveryAddress?.city}</span>
                </p>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                {isActive ? (
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => navigate(`/orders/${order.orderId}/track`)}
                    className="font-bold text-xs"
                  >
                    <Bike className="w-4 h-4 mr-1.5" />
                    <span>TRACK LIVE STATUS</span>
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleReorder(order)}
                    className="font-bold text-xs"
                  >
                    <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
                    <span>Reorder All</span>
                  </Button>
                )}

                <div className="flex items-center gap-2">
                  <Link
                    to={`/orders/${order.orderId}`}
                    className="text-xs font-bold text-dominos-blue hover:underline flex items-center gap-1"
                  >
                    <span>View Receipt Details</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
