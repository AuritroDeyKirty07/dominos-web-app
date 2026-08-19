import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useOrders } from '../hooks/useOrders.js';
import { Button } from '../components/common/Button.jsx';
import { Spinner } from '../components/common/Spinner.jsx';
import { formatCurrency, formatDate } from '../utils/formatters.js';
import { OrderItemSummary } from '../components/order/OrderItemSummary.jsx';
import {
  CheckCircle2,
  Clock,
  MapPin,
  Bike,
  Printer,
  ArrowRight,
  Pizza,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';

export const OrderConfirmationPage = () => {
  const { orderId } = useParams();
  const { getOrderDetails } = useOrders();
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
        <Button variant="primary" onClick={() => navigate('/menu')} className="mt-4">
          Go to Menu
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Confirmation Hero Card */}
      <div className="bg-gradient-to-br from-dominos-dark to-slate-900 text-white rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl" />

        <div className="relative z-10 space-y-4">
          <div className="w-20 h-20 bg-emerald-500 rounded-3xl flex items-center justify-center text-white mx-auto shadow-lg shadow-emerald-500/30 animate-bounce">
            <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
          </div>

          <div className="space-y-1">
            <span className="text-xs font-black uppercase tracking-widest text-emerald-400">
              Order Confirmed & Sent to Kitchen
            </span>
            <h1 className="text-3xl sm:text-4xl font-black font-brand text-white tracking-wide">
              THANK YOU FOR YOUR ORDER!
            </h1>
            <p className="text-sm text-slate-300">
              Order ID: <strong className="text-white font-mono">{order.orderId}</strong>
            </p>
          </div>

          {/* Quick Stats Pill */}
          <div className="inline-flex flex-wrap items-center justify-center gap-4 sm:gap-8 bg-white/10 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/15 text-xs">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-300" />
              <span>Est. Delivery: <strong>25-30 Mins</strong></span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-300" />
              <span>Payment: <strong>{order.paymentMethod}</strong></span>
            </div>
          </div>

          {/* Primary Action Buttons */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button
              variant="danger"
              size="lg"
              onClick={() => navigate(`/orders/${order.orderId}/track`)}
              className="w-full sm:w-auto font-brand text-base shadow-dominos-red"
            >
              <Bike className="w-5 h-5 mr-2" />
              <span>TRACK LIVE ORDER</span>
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>

            <Button
              variant="secondary"
              size="lg"
              onClick={() => window.print()}
              className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-bold"
            >
              <Printer className="w-4 h-4 mr-2" />
              <span>Print Receipt</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Order Summary & Address Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Delivery Details */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-dominos-blue text-xs font-bold uppercase tracking-wider">
            <MapPin className="w-4 h-4" />
            <span>Delivery Destination</span>
          </div>
          <div className="text-xs text-slate-600 space-y-1">
            <p className="font-bold text-sm text-slate-900">{order.deliveryAddress?.name}</p>
            <p className="font-medium text-slate-800">{order.deliveryAddress?.addressLine1}</p>
            {order.deliveryAddress?.addressLine2 && <p>{order.deliveryAddress.addressLine2}</p>}
            <p>{order.deliveryAddress?.city} - {order.deliveryAddress?.pinCode}</p>
            <p className="pt-1 text-slate-500 font-semibold">Phone: {order.deliveryAddress?.phone}</p>
          </div>
        </div>

        {/* Payment & Invoice Breakdown */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400">
            <span>Payment Summary</span>
            <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-black">{order.paymentStatus || 'Pending'}</span>
          </div>

          <div className="space-y-1.5 text-xs text-slate-600">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-semibold text-slate-900">{formatCurrency(order.pricing?.subtotal)}</span>
            </div>
            {order.pricing?.discount > 0 && (
              <div className="flex justify-between text-emerald-600 font-semibold">
                <span>Discount ({order.pricing?.couponCode || 'Promo'})</span>
                <span>- {formatCurrency(order.pricing?.discount)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Delivery Fee</span>
              <span>{order.pricing?.deliveryFee === 0 ? 'FREE' : formatCurrency(order.pricing?.deliveryFee)}</span>
            </div>
            <div className="flex justify-between">
              <span>Taxes (5% GST)</span>
              <span className="font-semibold text-slate-900">{formatCurrency(order.pricing?.tax)}</span>
            </div>
            <div className="pt-2 border-t border-slate-100 flex justify-between text-sm font-black text-slate-900 font-brand">
              <span>Total Paid</span>
              <span>{formatCurrency(order.pricing?.grandTotal)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Itemized Items */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <h3 className="font-bold text-base font-brand text-slate-900">ORDERED ITEMS ({order.items?.length})</h3>
        <div className="divide-y divide-slate-100">
          {order.items?.map((item, idx) => (
            <OrderItemSummary key={idx} item={item} />
          ))}
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="text-center pt-2">
        <Link
          to="/menu"
          className="text-xs font-bold text-dominos-blue hover:underline"
        >
          Want more delicious treats? Back to Domino's Menu →
        </Link>
      </div>
    </div>
  );
};
