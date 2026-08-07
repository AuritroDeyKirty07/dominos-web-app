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
        // Interpolate rider coordinates between restaurant and customer
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
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-slate-600 font-sans">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full border-4 border-blue-600 border-t-transparent animate-spin" />
          <span className="font-semibold text-sm">Loading Live IP Tracking & Route...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-16">
      
      {/* Header Bar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-xs">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <button 
            onClick={() => navigate('/delivery')}
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 px-3 py-1.5 rounded-xl transition cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" /> Exit Navigation
          </button>

          <span className="text-xs font-bold bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full border border-emerald-200 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Out for Delivery
          </span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 pt-6 space-y-6">

        {/* Live Rider & IP Tracking Status Bar */}
        <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="bg-emerald-400/20 text-emerald-300 text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider inline-flex items-center gap-1.5 mb-2">
                <Radio className="w-3 h-3 text-emerald-400 animate-pulse" /> Live IP Tracking Active
              </span>
              <h2 className="text-xl font-extrabold text-white">Delivery Executive En-Route</h2>
              <p className="text-xs text-blue-100 mt-1">
                Moving from Domino's Connaught Place to Customer End Location
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/15 text-center">
              <span className="text-[10px] font-bold uppercase text-slate-300 block">Est. Time Remaining</span>
              <span className="text-lg font-black text-amber-300 flex items-center justify-center gap-1">
                <Clock className="w-4 h-4" /> 7 mins ({100 - progress}% left)
              </span>
            </div>
          </div>

          {/* IP Tracking info pill */}
          {ipData && (
            <div className="bg-slate-950/60 p-3 rounded-2xl border border-white/10 text-xs font-mono grid grid-cols-2 sm:grid-cols-4 gap-2 text-slate-300">
              <div><span className="text-slate-500 block text-[10px]">RIDER IP:</span> <strong>{ipData.ip}</strong></div>
              <div><span className="text-slate-500 block text-[10px]">CITY / REGION:</span> <strong>{ipData.city}</strong></div>
              <div><span className="text-slate-500 block text-[10px]">ISP NETWORK:</span> <strong>{ipData.org}</strong></div>
              <div><span className="text-slate-500 block text-[10px]">RIDER LAT/LONG:</span> <strong>{riderCoords.lat}, {riderCoords.lng}</strong></div>
            </div>
          )}
        </div>

        {/* Live Leaflet Map showing delivery guy moving to end location */}
        <section className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Navigation className="w-5 h-5 text-blue-600 animate-pulse" /> Live Route Tracking Map
            </h3>
            <span className="text-xs text-blue-600 font-bold bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
              Destination: Bhukasur
            </span>
          </div>

          <div className="h-80 w-full rounded-2xl overflow-hidden shadow-inner border border-slate-200">
            <MapView 
              restaurantCoords={order.restaurantCoords}
              customerCoords={order.customerCoords}
              riderCoords={riderCoords}
              ipData={ipData}
              mode="tracking"
            />
          </div>
        </section>

        {/* Written Address & Order Details */}
        <section className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
          
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Written Delivery Address</span>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-md shadow-red-500/20">
                <MapPin className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-slate-900 text-base">{order.customerName}</h4>
                <p className="text-sm font-semibold text-slate-700 mt-1 leading-snug">
                  {order.deliveryAddress}
                </p>
                <div className="mt-3 pt-3 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-2">
                  <a 
                    href={`tel:${order.customerPhone}`}
                    className="inline-flex items-center gap-2 text-xs font-bold text-blue-600 bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-xl hover:bg-blue-100 transition"
                  >
                    <Phone className="w-3.5 h-3.5" /> Call Customer ({order.customerPhone})
                  </a>
                  <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                    Collect ₹{order.totalAmount} ({order.paymentStatus})
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Order items summary */}
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Payload Summary</span>
            <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100 space-y-2">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs font-medium">
                  <span className="text-slate-800">{item.quantity}x {item.name} ({item.size})</span>
                  <span className="font-bold text-slate-900">₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Delivered Slide Button */}
        <section className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Complete Delivery Action
            </h3>
            <span className="text-xs text-slate-400 font-medium">Swipe right to mark delivered</span>
          </div>

          <SlideButton 
            onConfirm={handleMarkDelivered}
            text="Slide to Mark Order Delivered"
            completedText="Delivery Marked as Complete!"
            variant="deliver"
          />
        </section>

      </main>

      {/* Completion Modal Notice (Redirecting to Dashboard after delivery) */}
      {isDeliveredModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl border border-slate-200 text-center space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle className="w-10 h-10 animate-bounce" />
            </div>

            <div>
              <h3 className="text-xl font-extrabold text-slate-900">Delivery Completed!</h3>
              <p className="text-xs text-slate-500 mt-1">
                Order DOM-9482 delivered to <strong>Bhukasur</strong>.
              </p>
            </div>

            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-xs font-semibold text-emerald-800 space-y-1">
              <div>Payment Collected: <strong>₹{order.totalAmount} (COD)</strong></div>
              <div>Status Updated in Mongoose & API Service</div>
            </div>

            <button
              onClick={() => navigate('/delivery')}
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-bold text-sm rounded-xl shadow-md shadow-blue-500/25 transition cursor-pointer"
            >
              Return to Fleet Dashboard
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
