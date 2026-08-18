import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { deliveryApi, fetchIpLocation } from '../services/deliveryApi';
import MapView from '../components/MapView';
import SlideButton from '../components/SlideButton';
import {
  ArrowLeft, MapPin, Navigation, Phone, CheckCircle2,
  Clock, Radio, DollarSign, User, ShieldCheck, CheckCircle
} from 'lucide-react';

export default function OutForDeliveryPage() {
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [ipData, setIpData] = useState(null);
  const [riderCoords, setRiderCoords] = useState({ lat: 28.6210, lng: 77.2140 });
  const [progress, setProgress] = useState(40);
  const [isDeliveredModalOpen, setIsDeliveredModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const orderData = await deliveryApi.getOrderById('DOM-9482');
      const ip = await fetchIpLocation();

      setOrder(orderData);
      setIpData(ip);

      if (ip && ip.latitude && ip.longitude) {
        setRiderCoords({ lat: ip.latitude, lng: ip.longitude });
      }
      setLoading(false);
    }
    loadData();
  }, []);

  // Simulate rider movement toward customer destination over time
  useEffect(() => {
    if (!order) return;
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return 90;
        const next = prev + 5;
        const startLat = order.restaurantCoords.lat;
        const startLng = order.restaurantCoords.lng;
        const endLat = order.customerCoords.lat;
        const endLng = order.customerCoords.lng;

        const ratio = next / 100;
        setRiderCoords({
          lat: Number((startLat + (endLat - startLat) * ratio).toFixed(4)),
          lng: Number((startLng + (endLng - startLng) * ratio).toFixed(4))
        });
        return next;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [order]);

  const handleMarkDelivered = async () => {
    await deliveryApi.updateOrderStatus('DOM-9482', 'DELIVERED');
    setIsDeliveredModalOpen(true);
  };

  if (loading || !order) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-8 text-slate-600 font-sans">
        <div className="flex items-center gap-4 bg-white p-8 border border-slate-200 rounded-2xl shadow-sm">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent animate-spin rounded-full" />
          <span className="font-bold text-lg text-slate-700">Loading Live IP Tracking & Route...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pt-24 pb-12 px-6 sm:px-10 lg:px-12 w-full box-border overflow-x-hidden">

      {/* Main Content Container */}
      <main className=" translate-y-19 max-w-[1600px] mx-auto space-y-8 sm:space-y-10 w-full box-border relative z-10">

        {/* Header Bar */}
        <div className=" h-13 flex items-center justify-between bg-white p-5 sm:p-6 border border-slate-200 shadow-sm  w-full box-border">
          <button
            onClick={() => navigate('/delivery')}
            className="group translate-x-5 w-40 inline-flex items-center gap-2.5 text-sm sm:text-base font-bold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-4 py-2.5 rounded-xl border border-slate-200 transition cursor-pointer shrink-0"
          >
            <ArrowLeft className=" transition-transform duration-300 group-hover:-translate-x-0 translate-x-2  w-5 h-5 shrink-0" /> Exit Navigation
          </button>

          <span className=" -translate-x-5 w-45 text-sm sm:text-base font-black bg-emerald-50 text-emerald-700 px-4 py-2 rounded-full border border-emerald-200 flex items-center gap-2 shrink-0">
            <span className=" translate-x-2 w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            <div className='translate-x-3'>
              Out for Delivery
            </div>
          </span>
        </div>

        {/* Live Rider & IP Tracking Status Bar */}
        <div className="bg-gradient-to-r from-blue-950 via-blue-900 to-indigo-950 text-white p-6 sm:p-8 rounded-2xl shadow-sm border border-blue-900 flex flex-col sm:flex-row sm:items-center justify-between gap-6 w-full box-border">
          <div>
            <span className="bg-emerald-400/20 text-emerald-300 text-xs sm:text-sm font-bold px-3.5 py-1 rounded-full uppercase tracking-wider inline-flex items-center gap-2 mb-2 shrink-0 border border-emerald-400/30">
              <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse shrink-0" /> Live IP Tracking Active
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white">Delivery Executive En-Route</h2>
            <p className="text-sm sm:text-base text-blue-100 mt-1 font-semibold">
              Moving from Domino's Connaught Place to Customer End Location
            </p>
          </div>
        </div>

        {/* 2-Column Desktop Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start w-full">

          {/* Left Column: Live Leaflet Map */}
          <div className="lg:col-span-7 w-full flex flex-col">
            <section className="bg-white p-6 sm:p-8 border border-slate-200 shadow-sm rounded-2xl space-y-6 w-full box-border flex-1 flex flex-col justify-between">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-3">
                  <Navigation className="w-6 h-6 text-blue-600 animate-pulse shrink-0" /> Live Route Tracking Map
                </h3>
                <span className="text-xs sm:text-sm text-blue-700 font-bold bg-blue-50 px-3.5 py-1.5 rounded-xl border border-blue-200 shrink-0">
                  Destination: Bhukasur
                </span>
              </div>

              <div className="h-[450px] sm:h-[500px] w-full rounded-xl overflow-hidden border border-slate-200 flex-1">
                <MapView
                  restaurantCoords={order.restaurantCoords}
                  customerCoords={order.customerCoords}
                  riderCoords={riderCoords}
                  ipData={ipData}
                  mode="tracking"
                />
              </div>
            </section>
          </div>

          {/* Right Column: Customer Details, Payload & Action */}
          <div className="lg:col-span-5 space-y-6 w-full flex flex-col">

            {/* Written Delivery Address & Call Card */}
            <section className="bg-white p-6 sm:p-8 border border-slate-200 shadow-sm rounded-2xl space-y-6 w-full box-border flex-1">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-3">WRITTEN DELIVERY ADDRESS</span>
                <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-red-600 text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-black text-slate-900 text-xl sm:text-2xl truncate">{order.customerName}</h4>
                    <p className="text-sm sm:text-base font-semibold text-slate-700 mt-1 leading-relaxed break-words">
                      {order.deliveryAddress}
                    </p>
                    <div className="mt-4 pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
                      <a
                        href={`tel:${order.customerPhone}`}
                        className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-blue-600 bg-blue-50 border border-blue-200 px-3.5 py-2 rounded-xl hover:bg-blue-100 transition shrink-0"
                      >
                        <Phone className="w-4 h-4 shrink-0" /> Call Customer ({order.customerPhone})
                      </a>
                      <span className="text-xs sm:text-sm font-bold text-emerald-700 bg-emerald-50 px-3.5 py-2 rounded-full border border-emerald-200 shrink-0">
                        Collect ₹{order.totalAmount} ({order.paymentStatus})
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payload Summary */}
              <div className="space-y-3">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">PAYLOAD SUMMARY:</span>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-sm sm:text-base font-bold min-w-0">
                      <span className="text-slate-800 truncate pr-3">{item.quantity}x {item.name} ({item.size})</span>
                      <span className="font-black text-slate-900 shrink-0">₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Delivered Action Section */}
            <section className="bg-white p-6 sm:p-8 border border-slate-200 shadow-sm rounded-2xl space-y-5 w-full box-border">
              <div className="flex items-center justify-between">
                <h3 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" /> Complete Delivery Action
                </h3>
                <span className="text-xs sm:text-sm text-slate-400 font-semibold">Swipe right to mark delivered</span>
              </div>

              <SlideButton
                onConfirm={handleMarkDelivered}
                text="Slide to Mark Order Delivered"
                completedText="Delivery Marked as Complete!"
                variant="deliver"
              />
            </section>

          </div>

        </div>

      </main>

      {/* Completion Modal Notice */}
      {isDeliveredModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-6">
          <div className="bg-white p-8 sm:p-10 max-w-md w-full border border-slate-200 text-center space-y-6 rounded-2xl shadow-xl">
            <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-12 h-12 animate-bounce" />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900">Delivery Completed!</h3>
              <p className="text-sm font-semibold text-slate-600">
                Order DOM-9482 delivered to <strong className="text-slate-900">Bhukasur</strong>.
              </p>
            </div>

            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-sm font-bold text-emerald-800 space-y-1">
              <div>Payment Collected: <strong>₹{order.totalAmount} (COD)</strong></div>
              <div>Status Updated in Mongoose & API Service</div>
            </div>

            <button
              onClick={() => navigate('/delivery')}
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-black text-base rounded-xl transition cursor-pointer shadow-md"
            >
              Return to Fleet Dashboard
            </button>
          </div>
        </div>
      )}

    </div>
  );
}