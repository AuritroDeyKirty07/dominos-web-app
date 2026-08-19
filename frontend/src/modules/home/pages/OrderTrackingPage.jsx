import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useOrders } from '../services/useOrders.js';
import { LiveOrderTracker } from '../components/order/LiveOrderTracker.jsx';
import { OrderItemSummary } from '../components/order/OrderItemSummary.jsx';
import { Button } from '../components/common/Button.jsx';
import { Spinner } from '../components/common/Spinner.jsx';
import { formatCurrency, formatDate } from '../services/formatters.js';
import { ArrowLeft, RefreshCw, Phone, ShieldCheck, MapPin } from 'lucide-react';

export const OrderTrackingPage = () => {
  const { orderId } = useParams();
  const { getOrderDetails } = useOrders();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchDetails = async (showSpinner = true) => {
    try {
      if (showSpinner) setLoading(true);
      else setIsRefreshing(true);
      const data = await getOrderDetails(orderId);
      setOrder(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDetails(true);

    // Auto refresh status every 10 seconds for live tracker effect
    const interval = setInterval(() => {
      fetchDetails(false);
    }, 10000);

    return () => clearInterval(interval);
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
          View All Orders
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <Link
          to="/orders"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-dominos-blue transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Orders</span>
        </Link>

        <button
          onClick={() => fetchDetails(false)}
          className="flex items-center gap-1 text-xs font-semibold text-dominos-blue hover:underline"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span>Refresh Live Status</span>
        </button>
      </div>

      {/* Main Live Tracker Component */}
      <LiveOrderTracker order={order} />

      {/* Order Info & Address Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-dominos-blue text-xs font-bold uppercase tracking-wider">
            <MapPin className="w-4 h-4" />
            <span>Delivering To</span>
          </div>
          <div className="text-xs text-slate-600 space-y-1">
            <p className="font-bold text-sm text-slate-900">{order.deliveryAddress?.name}</p>
            <p className="font-medium text-slate-800">{order.deliveryAddress?.addressLine1}</p>
            {order.deliveryAddress?.addressLine2 && <p>{order.deliveryAddress.addressLine2}</p>}
            <p>{order.deliveryAddress?.city} - {order.deliveryAddress?.pinCode}</p>
            <p className="pt-1 text-slate-500 font-semibold">Phone: {order.deliveryAddress?.phone}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400">
            <span>Payment & Invoice</span>
            <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-black">{order.paymentMethod}</span>
          </div>
          <div className="space-y-1 text-xs text-slate-600">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span className="font-semibold text-slate-900">{formatCurrency(order.pricing?.subtotal)}</span>
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
              <span>GST & Taxes:</span>
              <span className="font-semibold text-slate-900">{formatCurrency(order.pricing?.tax)}</span>
            </div>
            <div className="pt-2 border-t border-slate-100 flex justify-between text-sm font-black text-slate-900 font-brand">
              <span>Grand Total:</span>
              <span>{formatCurrency(order.pricing?.grandTotal)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Ordered Items Summary */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <h3 className="font-bold text-base font-brand text-slate-900">ORDERED ITEMS ({order.items?.length})</h3>
        <div className="divide-y divide-slate-100">
          {order.items?.map((item, idx) => (
            <OrderItemSummary key={idx} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
};

