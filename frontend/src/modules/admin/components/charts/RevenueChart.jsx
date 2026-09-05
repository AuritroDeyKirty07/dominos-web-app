// src/components/charts/RevenueChart.jsx
import React, { useState, useEffect } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts';
import { fetchRevenueChart } from '../../controllers/dashboardController';
import { formatCurrency } from '../../shared/utils/format';
import { ChartSkeleton } from '../loaders/SkeletonLoader';

const periods = [
  { key: 'today', label: 'Today' },
  { key: 'weekly', label: 'Weekly' },
  { key: 'monthly', label: 'Monthly' },
];

export default function RevenueChart() {
  const [activePeriod, setActivePeriod] = useState('weekly');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      setLoading(true);
      try {
        const result = await fetchRevenueChart(activePeriod);
        if (isMounted) setData(result);
      } catch (err) {
        console.error('Error loading revenue chart:', err);
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
          <h2 className="text-lg font-bold text-gray-800 dark:text-white">Revenue & Profit Analytics</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">Comparing gross revenue, net profit, and total orders</p>
        </div>
        <div className="flex bg-gray-100 dark:bg-gray-700/60 p-1 rounded-xl self-start sm:self-auto">
          {periods.map((p) => (
            <button
              key={p.key}
              onClick={() => setActivePeriod(p.key)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                activePeriod === p.key
                  ? 'bg-secondary text-gray-900 shadow-sm font-bold'
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
          <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" opacity={0.5} />
            <XAxis
              dataKey="time"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#94A3B8', fontSize: 12 }}
            />
            <YAxis
              yAxisId="left"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#94A3B8', fontSize: 12 }}
              tickFormatter={(val) => `₹${val >= 1000 ? (val / 1000).toFixed(0) + 'k' : val}`}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#94A3B8', fontSize: 12 }}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-gray-900 text-white p-3 rounded-xl shadow-xl text-xs space-y-1.5">
                      <p className="font-semibold text-gray-300 border-b border-gray-700 pb-1">{label}</p>
                      <p className="text-emerald-400 font-medium">Revenue: {formatCurrency(payload[0]?.value)}</p>
                      <p className="text-amber-400 font-medium">Profit: {formatCurrency(payload[1]?.value)}</p>
                      <p className="text-blue-400 font-medium">Orders: {payload[2]?.value}</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend wrapperStyle={{ paddingTop: '10px', fontSize: '12px' }} />
            <Bar yAxisId="left" dataKey="revenue" name="Revenue" fill="#10B981" radius={[6, 6, 0, 0]} barSize={16} />
            <Bar yAxisId="left" dataKey="profit" name="Profit" fill="#FFB400" radius={[6, 6, 0, 0]} barSize={16} />
            <Bar yAxisId="right" dataKey="orders" name="Orders" fill="#3B82F6" radius={[6, 6, 0, 0]} barSize={16} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
