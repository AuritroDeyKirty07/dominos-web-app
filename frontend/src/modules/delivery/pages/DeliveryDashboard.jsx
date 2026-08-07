import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { deliveryApi } from '../services/deliveryApi';
import { 
  Bike, Star, CheckCircle2, DollarSign, Clock, ArrowRight, 
  MapPin, Phone, Shield, History, Radio, Pizza, ChevronRight
} from 'lucide-react';

export default function DeliveryDashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      const res = await deliveryApi.getDashboard();
      setData(res);
      setLoading(false);
    }
    loadDashboard();
  }, []);

  if (loading || !data) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-slate-600 font-sans">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full border-4 border-blue-600 border-t-transparent animate-spin" />
          <span className="font-semibold text-sm">Loading Delivery Dashboard...</span>
        </div>
      </div>
    );
  }

  const { profile, liveOrder, orderHistory } = data;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-16">
      
      {/* Top Navbar Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-xs">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
              <Bike className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900 leading-tight">Domino's Delivery Fleet</h1>
              <span className="text-xs text-slate-500 font-medium">Dashboard • Light Operations</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              {profile.status}
            </span>
          </div>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-6 space-y-6">

        {/* Executive Profile Card */}
        <section className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-blue-50 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 text-white font-bold text-xl flex items-center justify-center shadow-lg shadow-blue-600/30 border-2 border-white">
                {profile.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">{profile.name}</h2>
                <p className="text-xs font-semibold text-blue-600 flex items-center gap-1.5 mt-0.5">
                  <Shield className="w-3.5 h-3.5" /> {profile.role}
                </p>
                <div className="text-xs text-slate-500 mt-1 font-mono">{profile.vehicle}</div>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-3 sm:gap-6 bg-slate-50/80 p-3.5 rounded-2xl border border-slate-100 text-center">
              <div>
                <span className="text-[11px] font-semibold uppercase text-slate-400 block">Rating</span>
                <span className="text-base font-extrabold text-slate-900 flex items-center justify-center gap-1">
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" /> {profile.rating}
                </span>
              </div>
              <div className="border-x border-slate-200 px-2">
                <span className="text-[11px] font-semibold uppercase text-slate-400 block">Today's Pay</span>
                <span className="text-base font-extrabold text-blue-600">₹{profile.earningsToday}</span>
              </div>
              <div>
                <span className="text-[11px] font-semibold uppercase text-slate-400 block">Orders</span>
                <span className="text-base font-extrabold text-slate-900">{profile.completedOrdersCount}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Live / Upcoming Order Section (Static/Dynamic) */}
        {liveOrder && (
          <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white rounded-3xl p-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 translate-x-6 -translate-y-6 opacity-10 pointer-events-none">
              <Pizza className="w-64 h-64" />
            </div>

            <div className="flex items-center justify-between mb-4">
              <span className="inline-flex items-center gap-1.5 bg-blue-500/30 backdrop-blur-md text-amber-300 text-xs font-bold px-3 py-1 rounded-full border border-amber-300/30">
                <Radio className="w-3.5 h-3.5 text-amber-400 animate-pulse" /> UPCOMING LIVE DISPATCH
              </span>
              <span className="text-xs font-mono bg-white/10 px-2.5 py-1 rounded-md text-slate-200">
                Order #{liveOrder.orderId}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div>
                <h3 className="text-2xl font-black tracking-tight text-white mb-2">
                  Customer: {liveOrder.customerName}
                </h3>
                
                <div className="space-y-2 text-sm text-slate-200">
                  <p className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                    <span><strong>Pickup:</strong> {liveOrder.restaurantName}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span><strong>Amount:</strong> ₹{liveOrder.totalAmount} • <strong className="text-emerald-300">{liveOrder.paymentStatus}</strong></span>
                  </p>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {liveOrder.items.map((item, idx) => (
                    <span key={idx} className="bg-white/10 text-xs px-2.5 py-1 rounded-lg border border-white/10 font-medium">
                      {item.quantity}x {item.name}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex flex-col items-stretch sm:items-end justify-center">
                <button
                  onClick={() => navigate(`/delivery/accept-order`)}
                  className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-amber-400 hover:bg-amber-300 active:scale-[0.98] text-slate-950 font-black text-sm shadow-lg shadow-amber-400/20 flex items-center justify-center gap-3 transition cursor-pointer"
                >
                  <span>View Order Details & Accept</span>
                  <ChevronRight className="w-5 h-5" />
                </button>
                <span className="text-[11px] text-slate-300 text-center sm:text-right mt-2 font-medium">
                  Redirects to Restaurant Lat/Lng & Detonate Accept page
                </span>
              </div>
            </div>
          </section>
        )}

        {/* Order History Table */}
        <section className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <History className="w-5 h-5 text-blue-600" /> Executive Order History
            </h3>
            <span className="text-xs text-slate-500 font-medium">{orderHistory.length} Delivered Records</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="pb-3">Order ID</th>
                  <th className="pb-3">Customer</th>
                  <th className="pb-3">Delivery Address</th>
                  <th className="pb-3">Amount</th>
                  <th className="pb-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {orderHistory.map((item) => (
                  <tr key={item.orderId} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 font-mono font-bold text-blue-600">{item.orderId}</td>
                    <td className="py-3.5 font-semibold text-slate-900">{item.customerName}</td>
                    <td className="py-3.5 text-slate-500 text-xs max-w-xs truncate">{item.deliveryAddress}</td>
                    <td className="py-3.5 font-bold text-slate-900">₹{item.totalAmount}</td>
                    <td className="py-3.5">
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Delivered
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

      </main>
    </div>
  );
}
