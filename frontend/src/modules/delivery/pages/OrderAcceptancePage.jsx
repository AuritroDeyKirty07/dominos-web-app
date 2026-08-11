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
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-slate-600 font-sans pt-24">
        <div className="flex items-center gap-3 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="w-8 h-8 rounded-full border-4 border-blue-600 border-t-transparent animate-spin" />
          <span className="font-semibold text-sm">Loading Order Details & Restaurant Location...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-20 w-full box-border overflow-x-hidden">
      
      {/* Main Content Container with explicit top margin below fixed Navbar & generous inner padding */}
      <main style={{ marginTop: '24px' }} className="max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-12 space-y-8 w-full box-border min-w-0 relative z-10">

        {/* Top Navigation Bar */}
        <div className="flex items-center justify-between bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm w-full box-border">
          <button 
            onClick={() => navigate('/delivery')}
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-4 py-2.5 rounded-xl transition cursor-pointer shrink-0"
          >
            <ArrowLeft className="w-4 h-4 shrink-0" /> Back to Fleet Dashboard
          </button>

          <span className="text-xs font-mono bg-blue-50 text-blue-700 px-4 py-2 rounded-full font-bold border border-blue-200 shrink-0">
            Order #{order.orderId}
          </span>
        </div>

        {/* Top Assignment Banner */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-3xl p-8 sm:p-10 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 w-full box-border min-w-0">
          <div className="min-w-0">
            <span className="bg-white/20 text-xs font-bold px-3.5 py-1 rounded-full uppercase tracking-wider mb-2.5 inline-block">
              Pickup Ready
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white">Accept Delivery Assignment</h2>
            <p className="text-xs sm:text-sm text-blue-100 mt-1.5">
              Verify restaurant coordinates and order payload before sliding to accept order.
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-md px-5 py-3.5 rounded-2xl text-right font-mono text-xs border border-white/20 shrink-0">
            <div>Restaurant Lat: <strong>{order.restaurantCoords.lat}</strong></div>
            <div>Restaurant Lng: <strong>{order.restaurantCoords.lng}</strong></div>
          </div>
        </div>

        {/* 2-Column Desktop Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start w-full min-w-0">
          
          {/* Left Column: Restaurant Map */}
          <div className="lg:col-span-7 space-y-6 w-full min-w-0">
            <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6 w-full box-border">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-red-600 shrink-0" /> Restaurant Location Pin
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 font-medium">{order.restaurantAddress}</p>
                </div>

                <a
                  href={order.restaurantMapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 px-4 py-2.5 rounded-xl transition w-fit shrink-0"
                >
                  <span>Open Google Maps</span>
                  <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                </a>
              </div>

              {/* Leaflet Map Rendering */}
              <div className="h-[440px] w-full rounded-2xl overflow-hidden shadow-inner border border-slate-200">
                <MapView 
                  restaurantCoords={order.restaurantCoords} 
                  customerCoords={order.customerCoords}
                  mode="restaurant"
                />
              </div>
            </section>
          </div>

          {/* Right Column: Order Details & Action Controls */}
          <div className="lg:col-span-5 space-y-6 w-full min-w-0">
            
            {/* Order Details Card */}
            <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6 w-full box-border">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Pizza className="w-5 h-5 text-blue-600 shrink-0" /> Order Details
                </h3>
                <span className="text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200 px-3.5 py-1 rounded-full shrink-0">
                  {order.paymentStatus}
                </span>
              </div>

              {/* Customer Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-5 rounded-2xl border border-slate-100">
                <div>
                  <span className="text-[11px] font-bold uppercase text-slate-400 block tracking-wider">Customer Name</span>
                  <span className="text-base font-black text-slate-900 flex items-center gap-2 mt-1">
                    <User className="w-4 h-4 text-blue-600 shrink-0" /> {order.customerName}
                  </span>
                </div>
                <div>
                  <span className="text-[11px] font-bold uppercase text-slate-400 block tracking-wider">Payment Method</span>
                  <span className="text-base font-extrabold text-emerald-700 flex items-center gap-2 mt-1">
                    <DollarSign className="w-4 h-4 text-emerald-600 shrink-0" /> {order.paymentStatus}
                  </span>
                </div>
              </div>

              {/* Itemized Breakdown */}
              <div className="space-y-3">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Itemized Bill</span>
                <div className="space-y-2.5">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50/80 border border-slate-100 text-sm">
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center shrink-0">
                          {item.quantity}x
                        </span>
                        <div className="min-w-0">
                          <strong className="text-slate-900 block truncate">{item.name}</strong>
                          <span className="text-[11px] text-slate-500 block truncate">Size: {item.size}</span>
                        </div>
                      </div>
                      <span className="font-bold text-slate-900 shrink-0">₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-5 pt-4 border-t border-slate-200 flex items-center justify-between text-base font-extrabold text-slate-900">
                  <span>Total Order Value:</span>
                  <span className="text-blue-600 text-2xl font-black">₹{order.totalAmount}</span>
                </div>
              </div>
            </section>

            {/* Action Slide & Reject Section */}
            <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5 w-full box-border">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Flame className="w-4 h-4 text-blue-600 animate-pulse shrink-0" /> Confirm Action
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

              {/* Reject Order Button */}
              <div className="pt-2 flex justify-center">
                <button
                  onClick={handleReject}
                  className="text-xs font-bold text-red-600 hover:text-red-700 hover:underline flex items-center gap-1.5 py-2 px-4 rounded-xl hover:bg-red-50 transition cursor-pointer"
                >
                  <AlertCircle className="w-4 h-4 shrink-0" /> Reject Order & Return to Dashboard
                </button>
              </div>
            </section>

          </div>

        </div>

      </main>
    </div>
  );
}
