// src/components/loaders/SkeletonLoader.jsx
import React from 'react';

export function StatCardSkeleton() {
  return (
    <div className="rounded-2xl bg-white dark:bg-gray-800 p-5 shadow-card animate-pulse space-y-3">
      <div className="flex justify-between items-start">
        <div className="space-y-2 flex-1">
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
          <div className="h-7 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
        </div>
        <div className="w-12 h-12 rounded-xl bg-gray-200 dark:bg-gray-700"></div>
      </div>
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div className="rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-card animate-pulse space-y-4">
      <div className="flex justify-between items-center">
        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
      </div>
      <div className="h-64 bg-gray-100 dark:bg-gray-700/50 rounded-xl"></div>
    </div>
  );
}

export function TableSkeleton() {
  return (
    <div className="rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-card animate-pulse space-y-4">
      <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-12 bg-gray-100 dark:bg-gray-700/50 rounded-lg"></div>
        ))}
      </div>
    </div>
  );
}

export default function SkeletonLoader({ type = 'card' }) {
  if (type === 'chart') return <ChartSkeleton />;
  if (type === 'table') return <TableSkeleton />;
  return <StatCardSkeleton />;
}
