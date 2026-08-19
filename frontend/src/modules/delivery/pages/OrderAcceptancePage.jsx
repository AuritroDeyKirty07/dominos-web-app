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
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-8 text-slate-600 font-sans">
        <div className="flex items-center gap-4 bg-white p-8 border border-slate-200 rounded-2xl shadow-sm">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent animate-spin rounded-full" />
          <span className="font-bold text-lg text-slate-700">Loading Order Details & Restaurant Location...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="h-195 min-h-screen bg-slate-50 text-slate-800 font-sans pt-24 pb-12 px-6 sm:px-10 lg:px-12 w-full box-border overflow-x-hidden">

      {/* Main Content Container */}
      <main className=" translate-y-19 max-w-[1600px] mx-auto space-y-8 sm:space-y-10 w-full box-border relative z-10">

        {/* Top Navigation Bar */}
        <div className=" h-10 flex items-center justify-between bg-white p-5 sm:p-6 border border-slate-200 shadow-sm  w-full box-border">
          <button
            onClick={() => navigate('/delivery')}
            className="translate-x-5 w-59 inline-flex items-center gap-2.5 text-sm sm:text-base font-bold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-4 py-2.5 rounded-xl border border-slate-200 transition cursor-pointer shrink-0"
          >
            <ArrowLeft className="translate-x-1 w-5 h-5 shrink-0" /> Back to Fleet Dashboard
          </button>

          <span className="-translate-x-5 w-43 text-sm sm:text-base font-mono bg-blue-50 text-blue-700 px-4 py-2 rounded-full font-black border border-blue-200 shrink-0">
            <div className='translate-x-2'>
              Order #{order.orderId}
            </div>
          </span>
        </div>

        {/* Top Assignment Banner */}
        <div className=" h-36 bg-gradient-to-r from-blue-700 to-indigo-800 text-white p-6 sm:p-8  shadow-sm border border-blue-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 w-full box-border">
          <div className='translate-x-5 '>
            <span className=" -translate-y-3  hover:bg-green-500 w-35  bg-white/20 text-xs sm:text-sm font-bold px-3.5 py-1 rounded-full uppercase tracking-wider mb-2 inline-block border border-white/20">
              <div className='translate-x-3'>
                Pickup Ready
              </div>
            </span>
            <h2 className=" translate-x-7 text-2xl sm:text-3xl lg:text-4xl font-black text-white">Accept Delivery Assignment</h2>
            <p className=" translate-x-7 text-sm sm:text-base text-blue-100 mt-1 font-semibold">
              Verify restaurant coordinates and order payload before sliding to accept order.
            </p>
          </div>
        </div>

        {/* 2-Column Desktop Grid Layout */}
        <div className=" grid grid-cols-1 lg:grid-cols-12 gap-1  items-start w-full">

          {/* Left Column: Restaurant Map */}
          <div className="lg:col-span-7 w-full flex flex-col">
            <section className="bg-white p-6 sm:p-8 border border-slate-200 shadow-sm  space-y-6 w-full box-border flex-1 flex flex-col justify-between">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className='h-23  translate-y-4'>
                  <h3 className=" translate-x-7  text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-3">
                    <MapPin className=" translate-x-2  w-6 h-6 text-red-600 shrink-0" /> Restaurant Location Pin
                  </h3>
                  <p className=" translate-x-7 text-sm sm:text-base text-slate-600 mt-1 font-semibold">{order.restaurantAddress}</p>
                </div>

                <a
                  href={order.restaurantMapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className=" -translate-x-5 inline-flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 px-4 py-2.5 rounded-xl transition w-fit shrink-0"
                >
                  <span>Open Google Maps</span>
                  <ExternalLink className="w-4 h-4 shrink-0" />
                </a>
              </div>

              {/* Leaflet Map Rendering */}
              <div className="  h-[450px] sm:h-[500px] w-full  overflow-hidden border border-slate-200 flex-1">
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
            <section className="bg-white p-6 sm:p-8 border border-slate-200 shadow-sm  space-y-6 w-full box-border">
              <div className="h-15 flex items-center justify-between border-b border-slate-200 pb-4">
                <h3 className=" translate-x-2 text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-3">
                  <Pizza className="w-6 h-6 text-blue-600 shrink-0" /> Order Details
                </h3>
                <span className="-translate-x-5 rounded-full w-44  px-3 py-1  text-xs sm:text-sm font-bold bg-amber-50 text-amber-700 border border-amber-200 shrink-0">
                  <div className='translate-x-2'>
                    {order.paymentStatus}
                  </div>
                </span>
              </div>

              {/* Customer Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-5 border border-slate-200">
                <div className=' h-13 translate-x-5 '>
                  <span className="text-[15px] font-bold uppercase text-slate-400 block tracking-wider">Customer Name :</span>
                  <span className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2 mt-1">
                    <User className=" -translate-y-1 w-4.7 h-4.8 text-blue-600 shrink-0" />
                    <div className=' -translate-y-1 text-[19px]'>
                      {order.customerName}
                    </div>
                  </span>
                </div>
                <div>
                  <span className="text-[15px] font-bold uppercase text-slate-400 block tracking-wider">Payment Method : </span>
                  <span className="text-base sm:text-lg font-black text-emerald-700 flex items-center gap-2 mt-1">

                    <div className='text-[19px]'>
                      {order.paymentStatus}
                    </div>
                  </span>
                </div>
              </div>

              {/* Itemized Breakdown */}
              <div className="space-y-4">
                <span className="translate-x-4 translate-y-1  h-7 text-[15px] font-bold text-slate-400 uppercase tracking-wider block">ITEMIZED BILL:</span>
                <div className="space-y-3">
                  {order.items.map((item, index) => (
                    <div key={index} className=" flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200 text-sm sm:text-base">
                      <div className=" translate-x-3 flex items-center gap-3 min-w-0">
                        <span className="rounded-[8px] w-9  bg-blue-100 text-blue-700 font-black text-lg flex items-center justify-center shrink-0">
                          {item.quantity}x
                        </span>
                        <div className="  min-w-0">
                          <strong className=" h-7 text-slate-900 block truncate font-bold">{item.name}</strong>
                          <span className=" -translate-y-1 text-xs text-slate-500 block truncate font-semibold">Size: {item.size}</span>
                        </div>
                      </div >
                      <span className=" -translate-x-4 font-black text-slate-900 shrink-0">₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>

                <div className=" h-10 pt-3 border-t border-slate-200 flex items-center justify-between text-base sm:text-lg font-black text-slate-900">
                  <span className='translate-x-5 '>Total Order Value:</span>
                  <span className=" -translate-x-3 text-blue-600 text-2xl font-black">₹{order.totalAmount}</span>
                </div>
              </div>
            </section>

            {/* Action Slide & Reject Section */}
            <section className="bg-white p-6 sm:p-8 border border-slate-200 shadow-sm  space-y-5 w-full box-border">
              <div className=" h-13 flex items-center justify-between">
                <h3 className=" translate-x-4 text-base sm:text-xl font-black text-slate-900 flex items-center gap-2">
                  <Flame className=" translate-x-1 w-5 h-5  text-blue-600 animate-pulse shrink-0" /> Confirm Action
                </h3>
                <span className="-translate-x-5 text-xs sm:text-sm text-slate-400 font-semibold">Swipe right to accept</span>
              </div>

              {/* Slide to Detonate & Accept Order */}
              <SlideButton
                onConfirm={handleAccept}
                text="Slide to Detonate & Accept Order"
                completedText="Order Detonated & Accepted! Redirecting..."
                variant="detonate"

              />

              {/* Reject Order Button */}
              <div className="pt-1 flex justify-center">
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

