import React from 'react';
import {
  CheckCircle2,
  Clock,
  Flame,
  ShieldCheck,
  Bike,
  PackageCheck,
  Phone,
  Store,
  Sparkles,
} from 'lucide-react';
import { formatDate } from '../../services/formatters.js';

const TRACKING_STAGES = [
  {
    key: 'PLACED',
    label: 'Order Placed',
    description: 'Received by Indiranagar Domino’s kitchen',
    icon: CheckCircle2,
  },
  {
    key: 'BAKING',
    label: 'Baking in Oven',
    description: 'Crafted fresh & baking at 245°C',
    icon: Flame,
  },
  {
    key: 'QUALITY_CHECK',
    label: 'Quality Check & Sealed',
    description: 'Inspected and sealed in thermal hot-bag',
    icon: ShieldCheck,
  },
  {
    key: 'OUT_FOR_DELIVERY',
    label: 'Out for Delivery',
    description: 'Rider Suresh is on the way (EV Scooter)',
    icon: Bike,
  },
  {
    key: 'DELIVERED',
    label: 'Delivered',
    description: 'Delivered hot & fresh to your doorstep',
    icon: PackageCheck,
  },
];

export const LiveOrderTracker = ({ order }) => {
  if (!order) return null;

  const getStageIndex = (status) => {
    switch (status?.toUpperCase()) {
      case 'PLACED':
      case 'ORDER PLACED':
      case 'ACCEPTED':
        return 0;
      case 'PREPARING':
      case 'BAKING':
      case 'BAKING IN OVEN':
        return 1;
      case 'QUALITY_CHECK':
      case 'QUALITY CHECK':
        return 2;
      case 'OUT_FOR_DELIVERY':
      case 'OUT FOR DELIVERY':
        return 3;
      case 'DELIVERED':
        return 4;
      default:
        return 0;
    }
  };

  const currentStageIndex = getStageIndex(order.status);
  const isDelivered = currentStageIndex === 4;

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-dominos overflow-hidden">
      {/* Tracker Header */}
      <div className="bg-gradient-to-r from-dominos-dark to-slate-900 text-white p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-widest text-dominos-red bg-white px-2 py-0.5 rounded">
                Live Tracker
              </span>
              <span className="text-xs text-slate-300">Order #{order.orderId}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black font-brand mt-1.5 text-white tracking-wide">
              {isDelivered ? 'Order Delivered!' : 'Hot & Fresh On The Way'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Placed on {formatDate(order.createdAt)}
            </p>
          </div>

          {/* ETA Box */}
          {!isDelivered && (
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15 text-center min-w-[160px] flex sm:flex-col items-center justify-between sm:justify-center gap-2">
              <div className="flex items-center gap-1.5 text-amber-300 text-xs font-bold uppercase tracking-wider">
                <Clock className="w-4 h-4 animate-spin" />
                <span>Estimated ETA</span>
              </div>
              <p className="text-2xl font-black text-white font-brand">20 - 25 MINS</p>
            </div>
          )}
        </div>
      </div>

      {/* Interactive Stage Stepper */}
      <div className="p-6 sm:p-8">
        <div className="relative">
          {/* Connecting Line */}
          <div className="absolute left-6 top-8 bottom-8 w-1 bg-slate-100 hidden sm:block">
            <div
              className="w-full bg-dominos-blue transition-all duration-700"
              style={{
                height: `${(currentStageIndex / (TRACKING_STAGES.length - 1)) * 100}%`,
              }}
            />
          </div>

          {/* Stage Items */}
          <div className="space-y-6 sm:space-y-8">
            {TRACKING_STAGES.map((stage, idx) => {
              const IconComponent = stage.icon;
              const isPast = idx < currentStageIndex;
              const isCurrent = idx === currentStageIndex;
              const isFuture = idx > currentStageIndex;

              return (
                <div key={stage.key} className="flex items-start gap-4 sm:gap-6 relative">
                  {/* Step Icon Badge */}
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold flex-shrink-0 z-10 transition-all duration-300 ${
                      isPast
                        ? 'bg-emerald-500 text-white shadow-md'
                        : isCurrent
                        ? 'bg-dominos-blue text-white ring-4 ring-dominos-blue/20 shadow-dominos-blue animate-pulse'
                        : 'bg-slate-100 text-slate-400 border border-slate-200'
                    }`}
                  >
                    <IconComponent className="w-6 h-6" />
                  </div>

                  {/* Stage Details */}
                  <div className="flex-1 pt-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4
                        className={`text-base font-bold font-brand tracking-wide ${
                          isCurrent
                            ? 'text-dominos-blue font-black text-lg'
                            : isPast
                            ? 'text-slate-900'
                            : 'text-slate-400'
                        }`}
                      >
                        {stage.label}
                      </h4>
                      {isCurrent && (
                        <span className="text-[10px] font-black uppercase tracking-wider bg-dominos-blue/10 text-dominos-blue px-2 py-0.5 rounded-full">
                          In Progress
                        </span>
                      )}
                    </div>
                    <p className={`text-xs mt-0.5 ${isCurrent ? 'text-slate-700 font-medium' : isPast ? 'text-slate-500' : 'text-slate-400'}`}>
                      {stage.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Delivery Partner Details Card */}
        <div className="mt-8 pt-6 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
            <div className="w-11 h-11 rounded-xl bg-dominos-blue/10 text-dominos-blue flex items-center justify-center font-bold text-base flex-shrink-0">
              SK
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Delivery Partner</p>
              <p className="text-sm font-bold text-slate-900 truncate">Suresh K (Hero EV)</p>
              <p className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Fully Vaccinated • Masked</span>
              </p>
            </div>
            <a
              href="tel:+919876543210"
              className="p-2.5 rounded-xl bg-white border border-slate-200 text-dominos-blue hover:bg-dominos-blue hover:text-white transition-colors shadow-sm"
              title="Call Delivery Partner"
            >
              <Phone className="w-4 h-4" />
            </a>
          </div>

          <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
            <div className="w-11 h-11 rounded-xl bg-dominos-red/10 text-dominos-red flex items-center justify-center font-bold text-base flex-shrink-0">
              <Store className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Kitchen Store</p>
              <p className="text-sm font-bold text-slate-900 truncate">Domino's Indiranagar 100ft</p>
              <p className="text-xs text-slate-500">Store Call: 080-2520-9988</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

