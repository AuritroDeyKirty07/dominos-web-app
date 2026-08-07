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
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-slate-600 font-sans pt-24">
        <div className="flex items-center gap-3 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="w-8 h-8 rounded-full border-4 border-blue-600 border-t-transparent animate-spin" />
          <span className="font-semibold text-sm">Loading Live IP Tracking & Route...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pt-24 pb-16 w-full box-border overflow-x-hidden">
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 w-full box-border min-w-0 relative z-10">

        {/* Header Bar */}
        <div className="flex items-center justify-between bg-white rounded-2xl p-4 border border-slate-200 shadow-xs w-full box-border">
          <button 
            onClick={() => navigate('/delivery')}
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-xl transition cursor-pointer shrink-0"
          >
            <ArrowLeft className="w-4 h-4 shrink-0" /> Exit Navigation
          </button>

          <span className="text-xs font-bold bg-emerald-50 text-emerald-700 px-3.5 py-1.5 rounded-full border border-emerald-200 flex items-center gap-1.5 shrink-0">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            Out for Delivery
          </span>
        </div>

        {/* Live Rider & IP Tracking Status Bar */}
        <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl space-y-4 w-full box-border min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="min-w-0">
              <span className="bg-emerald-400/20 text-emerald-300 text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider inline-flex items-center gap-1.5 mb-2 shrink-0">
                <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse shrink-0" /> Live IP Tracking Active
              </span>
              <h2 className="text-2xl font-black text-white truncate">Delivery Executive En-Route</h2>
              <p className="text-xs text-blue-100 mt-1">
                Moving from Domino's Connaught Place to Customer End Location
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-md px-5 py-3.5 rounded-2xl border border-white/15 text-center shrink-0">
              <span className="text-[10px] font-bold uppercase text-slate-300 block">Est. Time Remaining</span>
              <span className="text-xl font-black text-amber-300 flex items-center justify-center gap-1.5 mt-0.5">
                <Clock className="w-4 h-4 shrink-0" /> 7 mins ({100 - progress}% left)
              </span>
            </div>
          </div>

          {/* IP Tracking Grid Pill */}
          {ipData && (
            <div className="bg-slate-950/60 p-3.5 rounded-2xl border border-white/10 text-xs font-mono grid grid-cols-2 sm:grid-cols-4 gap-3 text-slate-300 w-full box-border">
              <div className="truncate"><span className="text-slate-500 block text-[10px]">RIDER IP:</span> <strong>{ipData.ip}</strong></div>
              <div className="truncate"><span className="text-slate-500 block text-[10px]">CITY / REGION:</span> <strong>{ipData.city}</strong></div>
              <div className="truncate"><span className="text-slate-500 block text-[10px]">ISP NETWORK:</span> <strong>{ipData.org}</strong></div>
              <div className="truncate"><span className="text-slate-500 block text-[10px]">RIDER LAT/LONG:</span> <strong>{riderCoords.lat}, {riderCoords.lng}</strong></div>
            </div>
          )}
        </div>

        {/* 2-Column Desktop Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start w-full min-w-0">

          {/* Left Column: Live Leaflet Map */}
          <div className="lg:col-span-7 space-y-6 w-full min-w-0">
            <section className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3 w-full box-border">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Navigation className="w-5 h-5 text-blue-600 animate-pulse shrink-0" /> Live Route Tracking Map
                </h3>
                <span className="text-xs text-blue-600 font-bold bg-blue-50 px-3 py-1 rounded-full border border-blue-200 shrink-0">
                  Destination: Bhukasur
                </span>
              </div>

              <div className="h-[440px] w-full rounded-2xl overflow-hidden shadow-inner border border-slate-200">
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
          <div className="lg:col-span-5 space-y-6 w-full min-w-0">
            
            {/* Written Delivery Address & Call Card */}
            <section className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6 w-full box-border">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Written Delivery Address</span>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-md shadow-red-500/20">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-slate-900 text-base truncate">{order.customerName}</h4>
                    <p className="text-sm font-semibold text-slate-700 mt-1 leading-snug break-words">
                      {order.deliveryAddress}
                    </p>
                    <div className="mt-3 pt-3 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-2">
                      <a 
                        href={`tel:${order.customerPhone}`}
                        className="inline-flex items-center gap-2 text-xs font-bold text-blue-600 bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-xl hover:bg-blue-100 transition shrink-0"
                      >
                        <Phone className="w-3.5 h-3.5 shrink-0" /> Call Customer ({order.customerPhone})
                      </a>
                      <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 shrink-0">
                        Collect ₹{order.totalAmount} ({order.paymentStatus})
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payload Summary */}
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Payload Summary</span>
                <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100 space-y-2">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs font-medium min-w-0">
                      <span className="text-slate-800 truncate pr-2">{item.quantity}x {item.name} ({item.size})</span>
                      <span className="font-bold text-slate-900 shrink-0">₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Delivered Action Section */}
            <section className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3 w-full box-border">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> Complete Delivery Action
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

          </div>

        </div>

      </main>

      {/* Completion Modal Notice */}
      {isDeliveredModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl border border-slate-200 text-center space-y-5">
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
