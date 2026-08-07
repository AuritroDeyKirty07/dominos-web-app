import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { deliveryApi } from '../services/deliveryApi';
import MapView from '../components/MapView';
import SlideButton from '../components/SlideButton';
import { 
  ArrowLeft, MapPin, ExternalLink, DollarSign, User, Phone, 
  Pizza, Clock, AlertCircle, Flame, ShieldAlert, CheckCircle 
} from 'lucide-react';

export default function OrderAcceptancePage() {
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOrder() {
      const data = await deliveryApi.getOrderById('DOM-9482');
      setOrder(data);
      setLoading(false);
    }
    loadOrder();
  }, []);

  const handleAccept = async () => {
    await deliveryApi.updateOrderStatus('DOM-9482', 'OUT_FOR_DELIVERY');
    setTimeout(() => {
      navigate('/delivery/out-for-delivery');
    }, 600);
  };

  const handleReject = async () => {
    await deliveryApi.updateOrderStatus('DOM-9482', 'REJECTED');
    navigate('/delivery');
  };

  if (loading || !order) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-slate-600 font-sans">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full border-4 border-blue-600 border-t-transparent animate-spin" />
          <span className="font-semibold text-sm">Loading Order Details & Restaurant Location...</span>
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
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </button>

          <span className="text-xs font-mono bg-blue-50 text-blue-700 px-3 py-1 rounded-full font-bold border border-blue-200">
            Order #{order.orderId}
          </span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 pt-6 space-y-6">

        {/* Top Banner */}
        <div className="bg-blue-600 text-white rounded-3xl p-6 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="bg-white/20 text-xs font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider mb-2 inline-block">
              Pickup Ready
            </span>
            <h2 className="text-xl font-extrabold">Accept Delivery Assignment</h2>
            <p className="text-xs text-blue-100 mt-1">
              Verify restaurant coordinates and order payload before sliding to detonate accept.
            </p>
          </div>
          <div className="bg-white/10 px-4 py-2 rounded-2xl text-right font-mono text-xs border border-white/20">
            <div>Restaurant Lat: <strong>{order.restaurantCoords.lat}</strong></div>
            <div>Restaurant Lng: <strong>{order.restaurantCoords.lng}</strong></div>
          </div>
        </div>

        {/* Section 1: Restaurant Location Leaflet Map */}
        <section className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-red-600" /> Restaurant Location Pin
              </h3>
              <p className="text-xs text-slate-500">{order.restaurantAddress}</p>
            </div>

            <a
              href={order.restaurantMapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 px-3 py-2 rounded-xl transition w-fit"
            >
              <span>Open Google Maps</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Leaflet Map rendering restaurant coords */}
          <div className="h-72 w-full rounded-2xl overflow-hidden shadow-inner">
            <MapView 
              restaurantCoords={order.restaurantCoords} 
              customerCoords={order.customerCoords}
              mode="restaurant"
            />
          </div>
        </section>

        {/* Section 2: Order Details */}
        <section className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
          
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Pizza className="w-5 h-5 text-blue-600" /> Order Details
            </h3>
            <span className="text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200 px-3 py-1 rounded-full">
              {order.paymentStatus}
            </span>
          </div>

          {/* Customer info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <div>
              <span className="text-[11px] font-bold uppercase text-slate-400 block">Customer Name</span>
              <span className="text-base font-black text-slate-900 flex items-center gap-2">
                <User className="w-4 h-4 text-blue-600" /> {order.customerName}
              </span>
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase text-slate-400 block">Payment Method</span>
              <span className="text-base font-extrabold text-emerald-700 flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-emerald-600" /> {order.paymentStatus}
              </span>
            </div>
          </div>

          {/* Items breakdown */}
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-3">Itemized Bill</span>
            <div className="space-y-2">
              {order.items.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-xl bg-slate-50/70 border border-slate-100 text-sm">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-lg bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center">
                      {item.quantity}x
                    </span>
                    <div>
                      <strong className="text-slate-900 block">{item.name}</strong>
                      <span className="text-[11px] text-slate-500">Size: {item.size}</span>
                    </div>
                  </div>
                  <span className="font-bold text-slate-900">₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-base font-extrabold text-slate-900">
              <span>Total Order Value:</span>
              <span className="text-blue-600 text-lg">₹{order.totalAmount}</span>
            </div>
          </div>
        </section>

        {/* Section 3: Slide Button to Accept or Reject Order */}
        <section className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Flame className="w-4 h-4 text-blue-600 animate-pulse" /> Confirm Action
            </h3>
            <span className="text-xs text-slate-400 font-medium">Swipe right to accept</span>
          </div>

          {/* Slide to Detonate & Accept Order */}
          <SlideButton 
            onConfirm={handleAccept}
            text="Slide to Detonate & Accept Order"
            completedText="Order Detonated & Accepted! Redirecting..."
            variant="detonate"
          />

          {/* Reject Order button */}
          <div className="pt-2 flex justify-center">
            <button
              onClick={handleReject}
              className="text-xs font-bold text-red-600 hover:text-red-700 hover:underline flex items-center gap-1.5 py-2 px-4 rounded-xl hover:bg-red-50 transition cursor-pointer"
            >
              <AlertCircle className="w-4 h-4" /> Reject Order & Return to Dashboard
            </button>
          </div>
        </section>

      </main>
    </div>
  );
}
