import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { deliveryApi } from '../services/deliveryApi';
import MapView from '../components/MapView';
import SlideButton from '../components/SlideButton';
import {
  ArrowLeft, MapPin, ExternalLink, DollarSign, User, Phone,
  Pizza, Clock, AlertCircle, Flame, ShieldAlert, CheckCircle
} from 'lucide-react';

export default function OrderAcceptancePage() {
  const navigate = useNavigate();
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOrder() {
      try {
        const data = await deliveryApi.getOrderById(orderId);
        setOrder(data);
      } catch (err) {
        console.error('Failed to load order:', err);
      } finally {
        setLoading(false);
      }
    }
    loadOrder();
  }, [orderId]);

  const handleAccept = async () => {
    await deliveryApi.updateOrderStatus(orderId, 'OUT_FOR_DELIVERY');
    setTimeout(() => {
      navigate('/delivery/out-for-delivery/' + orderId);
    }, 600);
  };

  const handleReject = async () => {
    await deliveryApi.updateOrderStatus(orderId, 'REJECTED');
    navigate('/delivery');
  };

  if (loading || !order) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-8 text-slate-600 font-sans">
        <div className="flex items-center gap-4 bg-white p-8 border border-slate-200 rounded-2xl shadow-sm">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent animate-spin rounded-full" />
          <span className="font-bold text-lg text-slate-700">Loading Order Details & Restaurant Location...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pt-6 pb-12 px-4 sm:px-6 lg:px-12 w-full box-border overflow-x-hidden">
      {/* Main Content Container */}
      <main className="max-w-[1600px] mx-auto space-y-8 w-full box-border relative z-10">

        {/* Top Navigation Bar */}
        <div className="flex items-center justify-between bg-white p-4 sm:p-6 border border-slate-200 rounded-2xl shadow-sm w-full box-border">
          <button
            onClick={() => navigate('/delivery')}
            className="inline-flex items-center gap-2 text-sm sm:text-base font-bold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-4 py-2.5 rounded-xl border border-slate-200 transition cursor-pointer shrink-0"
          >
            <ArrowLeft className="w-5 h-5 shrink-0" /> Back to Fleet Dashboard
          </button>

          <span className="text-sm sm:text-base font-mono bg-blue-50 text-blue-700 px-4 py-2 rounded-full font-black border border-blue-200 shrink-0">
            Order #{order.orderId}
          </span>
        </div>

        {/* Top Assignment Banner */}
        <div className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white p-6 sm:p-8 rounded-2xl shadow-sm border border-blue-900 flex flex-col items-start gap-2 w-full box-border">
          <span className="bg-white/20 text-xs sm:text-sm font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-2 border border-white/20">
            Pickup Ready
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white">Accept Delivery Assignment</h2>
          <p className="text-sm sm:text-base text-blue-100 font-semibold">
            Verify restaurant coordinates and order payload before sliding to accept order.
          </p>
        </div>

        {/* 2-Column Desktop Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start w-full">

          {/* Left Column: Restaurant Map */}
          <div className="lg:col-span-7 w-full flex flex-col">
            <section className="bg-white p-6 sm:p-8 border border-slate-200 rounded-2xl shadow-sm space-y-6 w-full box-border flex-1 flex flex-col">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-3">
                    <MapPin className="w-6 h-6 text-red-600 shrink-0" /> Restaurant Location Pin
                  </h3>
                  <p className="text-sm sm:text-base text-slate-600 mt-1 font-semibold">{order.restaurantAddress}</p>
                </div>

                <a
                  href={order.restaurantMapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 px-4 py-2.5 rounded-xl transition w-fit shrink-0"
                >
                  <span>Open Google Maps</span>
                  <ExternalLink className="w-4 h-4 shrink-0" />
                </a>
              </div>

              {/* Leaflet Map Rendering */}
              <div className="h-[500px] lg:h-[600px] w-full overflow-hidden border border-slate-200 rounded-xl">
                <MapView
                  restaurantCoords={order.restaurantCoords}
                  customerCoords={order.customerCoords}
                  mode="restaurant"
                />
              </div>
            </section>
          </div>

          {/* Right Column: Order Details & Action Controls */}
          <div className="lg:col-span-5 space-y-6 w-full flex flex-col">

            {/* Order Details Card */}
            <section className="bg-white p-6 sm:p-8 border border-slate-200 rounded-2xl shadow-sm space-y-6 w-full box-border">
              <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-3">
                  <Pizza className="w-6 h-6 text-blue-600 shrink-0" /> Order Details
                </h3>
                <span className="rounded-full px-3 py-1 text-xs sm:text-sm font-bold bg-amber-50 text-amber-700 border border-amber-200 shrink-0 uppercase">
                  {order.paymentStatus}
                </span>
              </div>

              {/* Customer Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-5 border border-slate-200 rounded-xl">
                <div>
                  <span className="text-[13px] font-bold uppercase text-slate-400 block tracking-wider">Customer Name</span>
                  <span className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2 mt-1">
                    <User className="w-5 h-5 text-blue-600 shrink-0" />
                    <span>{order.customerName}</span>
                  </span>
                </div>
                <div>
                  <span className="text-[13px] font-bold uppercase text-slate-400 block tracking-wider">Payment Method</span>
                  <span className="text-base sm:text-lg font-black text-emerald-700 flex items-center gap-2 mt-1">
                    <span>{order.paymentStatus}</span>
                  </span>
                </div>
              </div>

              {/* Itemized Breakdown */}
              <div className="space-y-4">
                <span className="text-[13px] font-bold text-slate-400 uppercase tracking-wider block">Itemized Bill</span>
                <div className="space-y-3">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm sm:text-base">
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="w-9 h-9 rounded-lg bg-blue-100 text-blue-700 font-black text-sm flex items-center justify-center shrink-0">
                          {item.quantity}x
                        </span>
                        <div className="min-w-0">
                          <strong className="text-slate-900 block truncate font-bold">{item.name}</strong>
                          <span className="text-xs text-slate-500 block truncate font-semibold">Size: {item.size}</span>
                        </div>
                      </div>
                      <span className="font-black text-slate-900 shrink-0">₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-base sm:text-lg font-black text-slate-900">
                  <span>Total Order Value:</span>
                  <span className="text-blue-600 text-2xl font-black">₹{order.totalAmount}</span>
                </div>
              </div>
            </section>

            {/* Action Slide & Reject Section */}
            <section className="bg-white p-6 sm:p-8 border border-slate-200 rounded-2xl shadow-sm space-y-6 w-full box-border">
              <div className="flex items-center justify-between">
                <h3 className="text-base sm:text-xl font-black text-slate-900 flex items-center gap-2">
                  <Flame className="w-5 h-5 text-blue-600 animate-pulse shrink-0" /> Confirm Action
                </h3>
                <span className="text-xs sm:text-sm text-slate-400 font-semibold">Swipe right to accept</span>
              </div>

              {/* Slide to Detonate & Accept Order */}
              <SlideButton
                onConfirm={handleAccept}
                text="Slide to Detonate & Accept Order"
                completedText="Order Detonated & Accepted! Redirecting..."
                variant="detonate"
              />

              {/* Reject Order Button */}
              <div className="pt-2 flex justify-center">
                <button
                  onClick={handleReject}
                  className="text-xs sm:text-sm font-bold text-red-600 hover:text-red-700 hover:underline flex items-center gap-2 py-2 px-4 rounded-xl hover:bg-red-50 transition cursor-pointer border border-red-200"
                >
                  <AlertCircle className="w-4 h-4 shrink-0" /> Reject Assignment
                </button>
              </div>
            </section>

          </div>

        </div>

      </main>
    </div>
  );
}

