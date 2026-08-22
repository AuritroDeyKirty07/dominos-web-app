import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { deliveryApi } from '../services/deliveryApi';
import { useAuthStore } from '../../../shared/store/authStore';
import {
  Bike, Star, CheckCircle2, DollarSign, Clock, ArrowRight,
  MapPin, Phone, Shield, History, Radio, Pizza, ChevronRight
} from 'lucide-react';

export default function DeliveryDashboard() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const res = await deliveryApi.getDashboard();
        setData(res);
      } catch (err) {
        console.error('Error fetching dashboard', err);
      } finally {
        setLoading(false);
      }
    }
    
    loadDashboard();
    
    // Auto update every 5 seconds
    const interval = setInterval(loadDashboard, 5000);
    return () => clearInterval(interval);
  }, []);

  if (loading && !data) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-8 text-slate-600 font-sans">
        <div className="flex items-center gap-4 bg-white p-8 border border-slate-200 rounded-2xl shadow-sm">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent animate-spin rounded-full" />
          <span className="font-bold text-lg text-slate-700">Loading Delivery Dashboard...</span>
        </div>
      </div>
    );
  }

  const { profile, liveOrder, orderHistory = [] } = data || {};

  const executiveName = user?.name || user?.fullName || profile?.name || 'Delivery Partner';
  const executiveRole = (user?.roleId?.name === 'delivery' || user?.role === 'delivery')
    ? 'Senior Delivery Executive'
    : (user?.roleId?.name || user?.role || profile?.role || 'Delivery Partner');
  const executiveInitials = executiveName
    .split(' ')
    .filter(Boolean)
    .map(n => n[0])
    .join('')
    .toUpperCase() || 'DP';
  const executivePhone = user?.phone || profile?.phone || 'Verified Staff';
  const profileStatus = profile?.status || (user?.isActive !== false ? 'Online' : 'Offline');

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pt-6 pb-12 px-4 sm:px-6 lg:px-12 w-full box-border relative overflow-x-hidden">
      <main className="max-w-[1600px] mx-auto space-y-8 w-full box-border z-10">
        
        {/* 1. Fleet Operational Title Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 bg-white p-6 sm:p-8 border border-slate-200 rounded-2xl shadow-sm w-full box-border">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 bg-blue-600 text-white flex items-center justify-center rounded-2xl shrink-0 shadow-md">
              <Bike className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
                Domino's Delivery Fleet
              </h1>
              <p className="text-sm sm:text-base text-slate-600 font-semibold mt-1">
                Executive Dashboard • Express Operations
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <span className="inline-flex items-center gap-2.5 bg-emerald-50 text-emerald-700 text-sm font-black px-4 py-2 border border-emerald-200 rounded-full shadow-sm">
              <span className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse shrink-0" />
              {profileStatus}
            </span>
          </div>
        </div>

        {/* 2. Executive Profile Card */}
        <section className="p-6 sm:p-8 border border-slate-200 shadow-sm rounded-2xl relative w-full box-border z-10 bg-white">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 relative z-10 w-full">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-600 to-blue-800 text-white font-black text-2xl sm:text-3xl flex items-center justify-center border-2 border-white rounded-2xl shadow-md shrink-0">
                {executiveInitials}
              </div>
              <div className="space-y-1">
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  {executiveName}
                </h2>
                <p className="text-sm sm:text-base font-bold text-blue-600 flex items-center gap-2">
                  <Shield className="w-4 h-4 shrink-0 text-blue-600" /> {executiveRole}
                </p>
                <div className="text-xs sm:text-sm font-mono text-slate-600 bg-slate-100 px-3 py-1 inline-block font-semibold border border-slate-200 rounded-lg">
                  {executivePhone}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 bg-slate-50 p-5 sm:p-6 border border-slate-200 text-center w-full lg:w-auto min-w-[280px] sm:min-w-[320px] rounded-xl shrink-0">
              <div>
                <span className="text-xs font-bold uppercase text-slate-400 block tracking-wider">Active Dispatch</span>
                <span className="text-2xl sm:text-3xl font-black text-blue-600 mt-1 block">{liveOrder ? 1 : 0}</span>
              </div>
              <div className="border-l border-slate-200 pl-4">
                <span className="text-xs font-bold uppercase text-slate-400 block tracking-wider">Completed Deliveries</span>
                <span className="text-2xl sm:text-3xl font-black text-slate-900 mt-1 block">{orderHistory.length}</span>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Live / Upcoming Kitchen Order Section */}
        {liveOrder ? (
          <section className="relative z-10 w-full min-h-[250px] rounded-2xl box-border bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-950 text-white p-6 sm:p-8 lg:p-10 border border-blue-900 shadow-md">
            <div className="w-full flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5 mb-6">
              <span className="inline-flex items-center gap-2.5 bg-blue-500/30 text-amber-300 text-xs sm:text-sm font-black px-4 py-2 border border-amber-300/40 rounded-full shrink-0">
                <Radio className="w-4 h-4 text-amber-400 animate-pulse shrink-0" />
                LIVE KITCHEN DISPATCH
              </span>
              <span className="text-xs sm:text-sm font-mono font-black bg-white/10 px-4 py-2 text-slate-200 border border-white/20 rounded-xl shrink-0">
                Order #{liveOrder.orderId}
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center w-full">
              <div className="lg:col-span-8 space-y-4">
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white">
                  Customer: <span className="text-amber-300">{liveOrder.customerName}</span>
                </h3>

                <div className="space-y-2 text-base sm:text-lg text-slate-200 font-semibold">
                  <p className="flex items-center gap-3">
                    <Pizza className="w-6 h-6 text-amber-400 shrink-0" />
                    <span>
                      <strong>Kitchen Status:</strong>{" "}
                      <span className="text-amber-300 uppercase font-black">{liveOrder.status}</span>
                    </span>
                  </p>
                </div>

                {liveOrder.items && liveOrder.items.length > 0 && (
                  <div className="pt-4">
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-200 block mb-3">
                      ORDER ITEMS FROM KITCHEN:
                    </span>
                    <div className="flex flex-wrap gap-2.5">
                      {liveOrder.items.map((item, idx) => (
                        <span key={idx} className="px-4 py-2 bg-white/10 text-sm sm:text-base font-bold border border-white/20 text-white rounded-full">
                          {item.quantity}x {item.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="lg:col-span-4 flex flex-col items-center lg:items-end justify-center h-full">
                <button
                  onClick={() => navigate(`/delivery/accept-order/${liveOrder.orderId}`)}
                  className="w-full lg:w-auto px-6 py-4 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-base sm:text-lg border border-amber-500 rounded-[10px] flex items-center justify-center gap-3 transition cursor-pointer shadow-md shrink-0"
                >
                  <span>View Order Details & Accept</span>
                  <ChevronRight className="w-6 h-6 shrink-0" />
                </button>
              </div>
            </div>
          </section>
        ) : (
          <section className="bg-white border border-slate-200 p-8 sm:p-12 text-center rounded-2xl shadow-sm">
            <Pizza className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg sm:text-xl font-black text-slate-700">No Active Kitchen Dispatches</h3>
            <p className="text-sm text-slate-500 font-semibold mt-1">
              Orders placed or prepared by the cook in the kitchen module will appear here automatically.
            </p>
          </section>
        )}

        {/* ORDER HISTORY */}
        <section className="w-full box-border bg-white p-6 sm:p-8 border border-slate-200 shadow-sm rounded-2xl space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-4 pb-4 border-b border-slate-100">
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-3">
              <History className="w-6 h-6 text-blue-600 shrink-0" />
              Kitchen Order History
            </h3>
            <span className="text-xs sm:text-sm text-slate-600 font-bold bg-slate-100 px-4 py-2 border border-slate-200 rounded-full">
              {orderHistory.length} Delivered Records
            </span>
          </div>

          {orderHistory.length === 0 ? (
            <div className="p-8 text-center text-slate-500 font-bold">
              No completed kitchen delivery records found.
            </div>
          ) : (
            <div className="w-full overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead>
                  <tr className="border-b border-slate-200 text-xs font-black text-slate-600 uppercase tracking-wider bg-slate-50">
                    <th className="py-4 px-6 w-[20%]">ORDER ID</th>
                    <th className="py-4 px-6 w-[30%]">CUSTOMER</th>
                    <th className="py-4 px-6 w-[30%]">ITEMS</th>
                    <th className="py-4 px-6 w-[20%]">STATUS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm sm:text-base">
                  {orderHistory.map((item) => (
                    <tr key={item._id || item.orderId} className="hover:bg-slate-50 transition-colors">
                      <td className="py-4 px-6 font-mono font-black text-blue-600">
                        {item.orderId}
                      </td>
                      <td className="py-4 px-6 font-bold text-slate-900">
                        {item.customerName}
                      </td>
                      <td className="py-4 px-6 text-slate-700 font-medium">
                        {(item.items || []).map(i => `${i.quantity}x ${i.name}`).join(', ') || 'Standard Order'}
                      </td>
                      <td className="py-4 px-6 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>{item.status}</span>
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
