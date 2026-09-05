// src/components/dashboard/OrderTracker.jsx
import React from 'react';
import { FiCheckCircle, FiClock, FiTruck, FiBox, FiHome } from 'react-icons/fi';

const steps = [
  { id: 'Received', label: 'Order Received', icon: FiClock },
  { id: 'Preparing', label: 'Preparing', icon: FiBox },
  { id: 'Cooking', label: 'Cooking', icon: FiBox },
  { id: 'Out for Delivery', label: 'Out for Delivery', icon: FiTruck },
  { id: 'Delivered', label: 'Delivered', icon: FiHome },
];

export default function OrderTracker({ activeStatus = 'Cooking' }) {
  const getStepIndex = (status) => {
    switch (status) {
      case 'Order Received':
      case 'Received':
        return 0;
      case 'Preparing':
        return 1;
      case 'Cooking':
        return 2;
      case 'Out for Delivery':
        return 3;
      case 'Delivered':
        return 4;
      default:
        return 0;
    }
  };

  const currentIndex = getStepIndex(activeStatus);

  return (
    <div className="rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-card transition-all duration-300">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-gray-800 dark:text-white">Live Order Status Tracker</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">Real-time order progress timeline</p>
        </div>
        <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full animate-pulse">
          Live Tracking
        </span>
      </div>

      <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-0 py-4">
        {/* Horizontal Line for Desktop */}
        <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-700 -translate-y-1/2 z-0" />

        {steps.map((step, idx) => {
          const isCompleted = idx <= currentIndex;
          const isCurrent = idx === currentIndex;
          const Icon = step.icon;

          return (
            <div key={step.id} className="relative z-10 flex md:flex-col items-center gap-3 md:gap-2 flex-1 w-full md:w-auto">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold transition-all duration-300 ${
                  isCompleted
                    ? 'bg-primary text-white shadow-glow scale-110'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-400'
                }`}
              >
                {isCompleted ? <FiCheckCircle /> : <Icon />}
              </div>
              <div className="text-left md:text-center">
                <p
                  className={`text-xs font-semibold ${
                    isCurrent
                      ? 'text-primary font-bold'
                      : isCompleted
                      ? 'text-gray-800 dark:text-white'
                      : 'text-gray-400 dark:text-gray-500'
                  }`}
                >
                  {step.label}
                </p>
                {isCurrent && (
                  <span className="text-[10px] text-primary bg-primary/10 px-2 py-0.5 rounded-full inline-block mt-0.5">
                    In Progress
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
