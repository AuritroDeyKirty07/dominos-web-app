// src/components/charts/SalesChart.jsx
import React, { useState, useEffect } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { fetchSalesChart } from '../../controllers/dashboardController';
import { formatCurrency } from '../../shared/utils/format';
import { ChartSkeleton } from '../loaders/SkeletonLoader';

const periods = [
  { key: 'today', label: 'Today' },
  { key: 'weekly', label: 'Weekly' },
  { key: 'monthly', label: 'Monthly' },
  { key: 'yearly', label: 'Yearly' },
];

export default function SalesChart() {
  const [activePeriod, setActivePeriod] = useState('weekly');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      setLoading(true);
      try {
        const result = await fetchSalesChart(activePeriod);
        if (isMounted) setData(result);
      } catch (err) {
        console.error('Error loading sales chart:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadData();
    return () => { isMounted = false; };
  }, [activePeriod]);

  if (loading && !data.length) return <ChartSkeleton />;

  return (
    <div className="rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-card transition-all duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-lg font-bold text-gray-800 dark:text-white">Sales Analytics</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">Track dynamic sales performance over time</p>
        </div>
        <div className="flex bg-gray-100 dark:bg-gray-700/60 p-1 rounded-xl self-start sm:self-auto">
          {periods.map((p) => (
            <button
              key={p.key}
              onClick={() => setActivePeriod(p.key)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                activePeriod === p.key
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#E4002B" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#E4002B" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" opacity={0.5} />
            <XAxis
              dataKey="time"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#94A3B8', fontSize: 12 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#94A3B8', fontSize: 12 }}
              tickFormatter={(val) => `₹${val >= 1000 ? (val / 1000).toFixed(0) + 'k' : val}`}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-gray-900 text-white p-3 rounded-xl shadow-xl text-xs space-y-1">
                      <p className="font-semibold text-gray-300">{label}</p>
                      <p className="text-sm font-bold text-primary">
                        Sales: {formatCurrency(payload[0].value)}
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area
              type="monotone"
              dataKey="sales"
              stroke="#E4002B"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#salesGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
