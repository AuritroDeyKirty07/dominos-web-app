import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useOrders } from '../services/useOrders.js';
import { useCart } from '../services/useCart.js';
import { OrderItemSummary } from '../components/order/OrderItemSummary.jsx';
import { Button } from '../components/common/Button.jsx';
import { Badge } from '../components/common/Badge.jsx';
import { Spinner } from '../components/common/Spinner.jsx';
import { formatCurrency, formatDate } from '../services/formatters.js';
import {
  ArrowLeft,
  MapPin,
  Clock,
  Printer,
  RotateCcw,
  Bike,
  ShieldCheck,
  CreditCard,
  FileText,
} from 'lucide-react';

export const OrderDetailPage = () => {
  const { orderId } = useParams();
  const { getOrderDetails } = useOrders();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const data = await getOrderDetails(orderId);
        setOrder(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-md mx-auto py-16 text-center">
        <h2 className="text-2xl font-bold font-brand">Order Not Found</h2>
        <Button variant="primary" onClick={() => navigate('/orders')} className="mt-4">
          Back to Orders
        </Button>
      </div>
    );
  }

  const handleReorder = () => {
    order.items?.forEach(item => {
      addToCart(item, item.customization, item.quantity);
    });
    navigate('/cart');
  };

  const isActive = order.status !== 'DELIVERED' && order.status !== 'CANCELLED';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Breadcrumb & Action */}
      <div className="flex items-center justify-between">
        <Link
          to="/orders"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-dominos-blue transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Orders</span>
        </Link>

        <div className="flex items-center gap-2">
          {isActive && (
            <Button
              variant="danger"
              size="sm"
              onClick={() => navigate(`/orders/${order.orderId}/track`)}
              className="text-xs font-bold"
            >
              <Bike className="w-3.5 h-3.5 mr-1" />
              <span>Track Live</span>
            </Button>
          )}

          <Button
            variant="secondary"
            size="sm"
            onClick={() => window.print()}
            className="text-xs"
          >
            <Printer className="w-3.5 h-3.5 mr-1" />
            <span>Print Invoice</span>
          </Button>
        </div>
      </div>

      {/* Main Order Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-dominos overflow-hidden">
        {/* Header */}
        <div className="p-6 sm:p-8 bg-slate-900 text-white flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase text-amber-400">Order Receipt</span>
              <span className="text-xs text-slate-400">• {formatDate(order.createdAt)}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black font-brand text-white mt-1">
              ORDER #{order.orderId}
            </h1>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-xs text-slate-400 block">Total Amount</span>
            <span className="text-2xl font-black font-brand text-white">
              {formatCurrency(order.pricing?.grandTotal)}
            </span>
          </div>
        </div>

        {/* Content Details */}
        <div className="p-6 sm:p-8 space-y-8">
          {/* Ordered Items */}
          <div className="space-y-3">
            <h3 className="text-base font-bold text-slate-900 font-brand">ITEM BREAKDOWN</h3>
            <div className="divide-y divide-slate-100 border-y border-slate-100">
              {order.items?.map((item, idx) => (
                <OrderItemSummary key={idx} item={item} />
              ))}
            </div>
          </div>

          {/* Addresses and Payment */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <MapPin className="w-3.5 h-3.5 text-dominos-blue" />
                <span>Delivery Location</span>
              </div>
              <p className="font-bold text-sm text-slate-900">{order.deliveryAddress?.name}</p>
              <p className="text-xs text-slate-600 leading-relaxed">{order.deliveryAddress?.addressLine1}, {order.deliveryAddress?.city} - {order.deliveryAddress?.pinCode}</p>
              <p className="text-xs text-slate-500 font-semibold">Contact: {order.deliveryAddress?.phone}</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <CreditCard className="w-3.5 h-3.5 text-emerald-600" />
                <span>Payment Summary</span>
              </div>
              <div className="text-xs text-slate-600 space-y-1">
                <div className="flex justify-between">
                  <span>Method:</span>
                  <span className="font-bold text-slate-800">{order.paymentMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>{formatCurrency(order.pricing?.subtotal)}</span>
                </div>
                {order.pricing?.discount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Discount:</span>
                    <span>- {formatCurrency(order.pricing?.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Delivery Fee:</span>
                  <span>{order.pricing?.deliveryFee === 0 ? 'FREE' : formatCurrency(order.pricing?.deliveryFee)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax (5% GST):</span>
                  <span>{formatCurrency(order.pricing?.tax)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Reorder Button */}
          <div className="pt-4 flex justify-end">
            <Button
              variant="danger"
              size="md"
              onClick={handleReorder}
              className="font-bold text-xs"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              <span>Reorder Entire Meal</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

