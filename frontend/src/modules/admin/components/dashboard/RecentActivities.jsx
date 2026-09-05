// src/components/dashboard/RecentActivities.jsx
import React from 'react';
import { FiShoppingBag, FiUserPlus, FiTruck, FiRefreshCw, FiUserCheck } from 'react-icons/fi';
import { mockActivities } from '../../shared/config/mockData';

export default function RecentActivities() {
  const getActivityIcon = (type) => {
    switch (type) {
      case 'order':
        return <FiShoppingBag className="text-primary" />;
      case 'employee':
        return <FiUserPlus className="text-blue-500" />;
      case 'delivery':
        return <FiTruck className="text-emerald-500" />;
      case 'refund':
        return <FiRefreshCw className="text-amber-500" />;
      case 'customer':
        return <FiUserCheck className="text-purple-500" />;
      default:
        return <FiShoppingBag className="text-gray-400" />;
    }
  };

  return (
    <div className="rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-card transition-all duration-300">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-gray-800 dark:text-white">Recent Activities</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">Live operational events feed</p>
        </div>
      </div>

      <div className="space-y-4">
        {mockActivities.map((act) => (
          <div key={act.id} className="flex items-start gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-gray-100 dark:bg-gray-700/60 flex items-center justify-center flex-shrink-0 text-base group-hover:scale-105 transition-transform">
              {getActivityIcon(act.type)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-gray-800 dark:text-gray-200 leading-snug">
                {act.message}
              </p>
              <span className="text-[11px] text-gray-400 dark:text-gray-500 block mt-0.5">
                {act.time}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
