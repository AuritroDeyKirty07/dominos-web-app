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
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-slate-600 font-sans pt-24">
        <div className="flex items-center gap-3 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="w-8 h-8 rounded-full border-4 border-blue-600 border-t-transparent animate-spin" />
          <span className="font-semibold text-sm">Loading Delivery Dashboard...</span>
        </div>
      </div>
    );
  }

  const { profile, liveOrder, orderHistory } = data;

  return (

    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pt-24 pb-16 w-full box-border overflow-x-hidden">
      {/* Main Content Container - Full Width max-w-7xl with explicit top margin to guarantee no overlap with Navbar */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 w-full box-border min-w-0 relative z-10">

        {/* Fleet Operational Title Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-2xl p-5 border border-slate-200 shadow-xs w-full box-border min-w-0">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-11 h-11 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20 shrink-0">
              <Bike className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <h1 className="text-xl font-bold text-slate-900 leading-tight truncate">Domino's Delivery Fleet</h1>
              <span className="text-xs text-slate-500 font-medium block truncate">Executive Dashboard • Express Operations</span>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200 shadow-xs">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              {profile.status}
            </span>
          </div>
        </div>

        {/* Executive Profile Card */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm relative overflow-hidden w-full box-border min-w-0 z-10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10 w-full min-w-0">
            <div className="flex items-center gap-4 min-w-0">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 text-white font-bold text-xl flex items-center justify-center shadow-lg shadow-blue-600/30 border-2 border-white shrink-0">
                {profile.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="min-w-0">
                <h2 className="text-2xl font-black text-slate-900 truncate">{profile.name}</h2>
                <p className="text-xs font-semibold text-blue-600 flex items-center gap-1.5 mt-0.5">
                  <Shield className="w-3.5 h-3.5 shrink-0" /> {profile.role}
                </p>
                <div className="text-xs text-slate-500 mt-1 font-mono">{profile.vehicle}</div>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-3 sm:gap-6 bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center w-full md:w-auto md:min-w-[380px] shrink-0 box-border">
              <div>
                <span className="text-[11px] font-semibold uppercase text-slate-400 block">Rating</span>
                <span className="text-lg font-extrabold text-slate-900 flex items-center justify-center gap-1 mt-0.5">
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400 shrink-0" /> {profile.rating}
                </span>
              </div>
              <div className="border-x border-slate-200 px-2">
                <span className="text-[11px] font-semibold uppercase text-slate-400 block">Today's Pay</span>
                <span className="text-lg font-extrabold text-blue-600 mt-0.5 block">₹{profile.earningsToday}</span>
              </div>
              <div>
                <span className="text-[11px] font-semibold uppercase text-slate-400 block">Orders</span>
                <span className="text-lg font-extrabold text-slate-900 mt-0.5 block">{profile.completedOrdersCount}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Live / Upcoming Order Section */}
        {liveOrder && (
          <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden w-full max-w-full box-border min-w-0 z-10">
            <div className="absolute top-0 right-0 translate-x-6 -translate-y-6 opacity-10 pointer-events-none">
              <Pizza className="w-80 h-80" />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 mb-4 w-full min-w-0">
              <span className="inline-flex items-center gap-1.5 bg-blue-500/30 backdrop-blur-md text-amber-300 text-xs font-bold px-3.5 py-1 rounded-full border border-amber-300/30 shrink-0">
                <Radio className="w-3.5 h-3.5 text-amber-400 animate-pulse shrink-0" /> UPCOMING LIVE DISPATCH
              </span>
              <span className="text-xs font-mono bg-white/10 px-3 py-1 rounded-lg text-slate-200 border border-white/10 shrink-0">
                Order #{liveOrder.orderId}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center w-full min-w-0">
              <div className="md:col-span-8 min-w-0 break-words space-y-3">
                <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-white break-words">
                  Customer: {liveOrder.customerName}
                </h3>

                <div className="space-y-2 text-sm text-slate-200">
                  <p className="flex items-start gap-2 break-words">
                    <MapPin className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                    <span><strong>Pickup:</strong> {liveOrder.restaurantName}</span>
                  </p>
                  <p className="flex items-center gap-2 flex-wrap">
                    <DollarSign className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span><strong>Amount:</strong> ₹{liveOrder.totalAmount} • <strong className="text-emerald-300">{liveOrder.paymentStatus}</strong></span>
                  </p>
                </div>

                <div className="mt-4 flex flex-wrap gap-2 max-w-full overflow-hidden">
                  {liveOrder.items.map((item, idx) => (
                    <span key={idx} className="bg-white/10 text-xs px-3 py-1.5 rounded-xl border border-white/10 font-medium break-words">
                      {item.quantity}x {item.name}
                    </span>
                  ))}
                </div>
              </div>

              <div className="md:col-span-4 flex flex-col items-stretch md:items-end justify-center pt-2 md:pt-0 min-w-0">
                <button
                  onClick={() => navigate(`/delivery/accept-order`)}
                  className="w-full md:w-auto px-6 py-4 rounded-2xl bg-amber-400 hover:bg-amber-300 active:scale-[0.98] text-slate-950 font-black text-sm shadow-xl shadow-amber-400/20 flex items-center justify-center gap-3 transition cursor-pointer shrink-0"
                >
                  <span>View Order Details & Accept</span>
                  <ChevronRight className="w-5 h-5 shrink-0" />
                </button>
              </div>
            </div>
          </section>
        )}

        {/* Executive Order History Table */}
        <section className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm w-full max-w-full box-border min-w-0 z-10 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2 w-full min-w-0">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <History className="w-5 h-5 text-blue-600 shrink-0" /> Executive Order History
            </h3>
            <span className="text-xs text-slate-500 font-medium">{orderHistory.length} Delivered Records</span>
          </div>

          <div className="w-full overflow-x-auto rounded-2xl border border-slate-100">
            <table className="w-full text-left border-collapse table-fixed min-w-[650px]">
              <thead>
                <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50/50">
                  <th className="py-3.5 px-4 w-[16%] min-w-[90px]">ORDER ID</th>
                  <th className="py-3.5 px-4 w-[22%] min-w-[120px]">CUSTOMER</th>
                  <th className="py-3.5 px-4 w-[37%] min-w-[180px]">DELIVERY ADDRESS</th>
                  <th className="py-3.5 px-4 w-[12%] min-w-[80px]">AMOUNT</th>
                  <th className="py-3.5 px-4 w-[15%] min-w-[100px]">STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {orderHistory.map((item) => (
                  <tr key={item.orderId} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-blue-600 truncate">{item.orderId}</td>
                    <td className="py-3.5 px-4 font-semibold text-slate-900 truncate">{item.customerName}</td>
                    <td className="py-3.5 px-4 text-slate-500 text-xs truncate" title={item.deliveryAddress}>{item.deliveryAddress}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-900 whitespace-nowrap">₹{item.totalAmount}</td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> Delivered
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
