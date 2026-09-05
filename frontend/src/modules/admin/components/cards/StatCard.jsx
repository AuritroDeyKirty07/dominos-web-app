// src/components/cards/StatCard.jsx
import React from 'react';
import { FiTrendingUp, FiTrendingDown } from 'react-icons/fi';
import { formatCurrency, formatNumber } from '../../shared/utils/format';

/**
 * Reusable statistics card component.
 * @param {{ icon: React.ReactNode, title: string, value: number|string, change: number, isCurrency: boolean, color: string }} props
 */
export default function StatCard({ icon, title, value, change = 0, isCurrency = false, color = 'primary' }) {
  const isPositive = change >= 0;
  const displayValue = isCurrency ? formatCurrency(value) : formatNumber(value);

  const colorMap = {
    primary: 'from-primary/10 to-primary/5 dark:from-primary/20 dark:to-primary/10',
    blue: 'from-blue-500/10 to-blue-500/5 dark:from-blue-500/20 dark:to-blue-500/10',
    green: 'from-emerald-500/10 to-emerald-500/5 dark:from-emerald-500/20 dark:to-emerald-500/10',
    orange: 'from-amber-500/10 to-amber-500/5 dark:from-amber-500/20 dark:to-amber-500/10',
    purple: 'from-violet-500/10 to-violet-500/5 dark:from-violet-500/20 dark:to-violet-500/10',
    pink: 'from-pink-500/10 to-pink-500/5 dark:from-pink-500/20 dark:to-pink-500/10',
  };

  const iconColorMap = {
    primary: 'text-primary bg-primary/10',
    blue: 'text-blue-500 bg-blue-500/10',
    green: 'text-emerald-500 bg-emerald-500/10',
    orange: 'text-amber-500 bg-amber-500/10',
    purple: 'text-violet-500 bg-violet-500/10',
    pink: 'text-pink-500 bg-pink-500/10',
  };

  return (
    <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${colorMap[color] || colorMap.primary} bg-white dark:bg-gray-800/50 p-5 shadow-card hover:shadow-card-hover transition-all duration-300 group`}>
      {/* Background decorative circle */}
      <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full bg-white/10 dark:bg-white/5 group-hover:scale-110 transition-transform duration-500" />

      <div className="relative flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
            {title}
          </p>
          <p className="text-2xl font-bold text-gray-800 dark:text-white">{displayValue}</p>
          <div className={`flex items-center gap-1 text-xs font-medium ${isPositive ? 'text-emerald-500' : 'text-red-500'}`}>
            {isPositive ? <FiTrendingUp /> : <FiTrendingDown />}
            <span>{Math.abs(change)}%</span>
            <span className="text-gray-400 dark:text-gray-500 ml-1">vs last period</span>
          </div>
        </div>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${iconColorMap[color] || iconColorMap.primary}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}
