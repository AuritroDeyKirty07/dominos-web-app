// src/components/cards/NotificationCard.jsx
import React from 'react';
import { FiBell, FiAlertCircle, FiUserPlus, FiBox } from 'react-icons/fi';
import { mockNotifications } from '../../shared/config/mockData';

export default function NotificationCard() {
  const getIcon = (type) => {
    switch (type) {
      case 'new_order':
        return <FiBell className="text-primary" />;
      case 'delayed':
        return <FiAlertCircle className="text-red-500" />;
      case 'employee':
        return <FiUserPlus className="text-blue-500" />;
      case 'inventory':
        return <FiBox className="text-amber-500" />;
      default:
        return <FiBell className="text-gray-400" />;
    }
  };

  return (
    <div className="rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-card transition-all duration-300">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-gray-800 dark:text-white">Notifications</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">System alerts & pending requests</p>
        </div>
      </div>

      <div className="space-y-3">
        {mockNotifications.map((n) => (
          <div
            key={n.id}
            className={`p-3.5 rounded-xl border flex items-start gap-3 transition-all ${
              !n.read
                ? 'bg-primary/5 dark:bg-primary/10 border-primary/20'
                : 'bg-gray-50 dark:bg-gray-700/30 border-gray-100 dark:border-gray-700'
            }`}
          >
            <div className="w-8 h-8 rounded-lg bg-white dark:bg-gray-800 flex items-center justify-center flex-shrink-0 text-base shadow-sm">
              {getIcon(n.type)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-center">
                <h4 className="text-xs font-bold text-gray-800 dark:text-white">{n.title}</h4>
                <span className="text-[10px] text-gray-400">{n.time}</span>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-300 mt-0.5">{n.message}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
