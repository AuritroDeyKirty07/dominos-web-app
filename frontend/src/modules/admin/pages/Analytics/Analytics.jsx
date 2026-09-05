// src/pages/Analytics/Analytics.jsx
import React, { useState, useEffect } from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from 'recharts';
import { FiDownload, FiPieChart, FiClock } from 'react-icons/fi';
import SalesChart from '../../components/charts/SalesChart';
import RevenueChart from '../../components/charts/RevenueChart';
import adminApi from '../../services/adminApi';

const defaultCategoryData = [
  { name: 'Veg Pizzas', value: 45, color: '#10B981' },
  { name: 'Non-Veg Pizzas', value: 35, color: '#E4002B' },
  { name: 'Sides & Dips', value: 12, color: '#FFB400' },
  { name: 'Desserts', value: 5, color: '#EC4899' },
  { name: 'Beverages', value: 3, color: '#3B82F6' },
];

const defaultPeakHoursData = [
  { hour: '11 AM', orders: 12 },
  { hour: '12 PM', orders: 28 },
  { hour: '1 PM', orders: 45 },
  { hour: '2 PM', orders: 32 },
  { hour: '6 PM', orders: 38 },
  { hour: '7 PM', orders: 62 },
  { hour: '8 PM', orders: 75 },
  { hour: '9 PM', orders: 50 },
  { hour: '10 PM', orders: 25 },
];

export default function Analytics() {
  const [categoryData, setCategoryData] = useState(defaultCategoryData);
  const [peakHoursData, setPeakHoursData] = useState(defaultPeakHoursData);

  useEffect(() => {
    async function loadAnalytics() {
      try {
        const catRes = await api.get('/admin/analytics/categories');
        const catData = catRes.data?.data ?? catRes.data;
        if (Array.isArray(catData) && catData.length > 0) {
          setCategoryData(catData);
        }
      } catch (err) {}

      try {
        const peakRes = await api.get('/admin/analytics/peak-hours');
        const peakData = peakRes.data?.data ?? peakRes.data;
        if (Array.isArray(peakData) && peakData.length > 0) {
          setPeakHoursData(peakData);
        }
      } catch (err) {}
    }
    loadAnalytics();
  }, []);
  const exportAnalytics = () => {
    const report = {
      generatedAt: new Date().toISOString(),
      categoryBreakdown: categoryData,
      peakHours: peakHoursData,
    };
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Domino_Analytics_Report_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
  };

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-800 dark:text-white tracking-tight">
            Financial & Sales Analytics
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Deep dive into store revenue streams, category share, peak hours, and profit margins
          </p>
        </div>
        <button
          onClick={exportAnalytics}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-xs font-semibold rounded-xl hover:bg-primary/90 shadow-md transition-all self-start sm:self-auto"
        >
          <FiDownload /> Export Analytics Report
        </button>
      </div>

      {/* Main Time-series Charts */}
      <div className="space-y-6">
        <SalesChart />
        <RevenueChart />
      </div>

      {/* Extended Analytics: Donut & Peak Hours */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Share Donut Chart */}
        <div className="rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-card">
          <div className="flex items-center gap-2 mb-4">
            <FiPieChart className="text-primary text-lg" />
            <div>
              <h2 className="text-base font-bold text-gray-800 dark:text-white">Category Sales Share</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">Revenue contribution by product category</p>
            </div>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-gray-900 text-white p-2 rounded-lg text-xs">
                          <p className="font-bold">{payload[0].name}</p>
                          <p className="text-gray-300">{payload[0].value}% of total sales</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Peak Hours Histogram */}
        <div className="rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-card">
          <div className="flex items-center gap-2 mb-4">
            <FiClock className="text-secondary text-lg" />
            <div>
              <h2 className="text-base font-bold text-gray-800 dark:text-white">Hourly Peak Order Volume</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">Distribution of orders placed throughout the day</p>
            </div>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={peakHoursData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" opacity={0.5} />
                <XAxis dataKey="hour" axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 11 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 11 }} />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-gray-900 text-white p-2 rounded-lg text-xs">
                          <p className="font-bold">{label}</p>
                          <p className="text-amber-400">{payload[0].value} orders placed</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="orders" name="Orders" fill="#FFB400" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
