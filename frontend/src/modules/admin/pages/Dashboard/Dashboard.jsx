// src/pages/Dashboard/Dashboard.jsx
import React, { useState, useEffect, useCallback } from 'react';
import {
  FiUsers,
  FiShoppingBag,
  FiDollarSign,
  FiTrendingUp,
  FiCalendar,
  FiUserCheck,
  FiClock,
  FiAward,
  FiPieChart,
  FiRefreshCw,
} from 'react-icons/fi';
import StatCard from '../../components/cards/StatCard';
import SalesChart from '../../components/charts/SalesChart';
import RevenueChart from '../../components/charts/RevenueChart';
import OrderTracker from '../../components/dashboard/OrderTracker';
import RecentActivities from '../../components/dashboard/RecentActivities';
import NotificationCard from '../../components/cards/NotificationCard';
import { StatCardSkeleton } from '../../components/loaders/SkeletonLoader';
import { fetchDashboardData } from '../../controllers/dashboardController';
import { formatCurrency } from '../../shared/utils/format';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const loadStats = useCallback(async (isManual = false) => {
    if (isManual) setIsRefreshing(true);
    try {
      const data = await fetchDashboardData();
      setStats(data);
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
    } finally {
      setLoading(false);
      if (isManual) setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadStats();
    // Live polling every 10 seconds for real-time synchronization
    const interval = setInterval(() => {
      loadStats();
    }, 10000);
    return () => clearInterval(interval);
  }, [loadStats]);

  return (
    <div className="space-y-6 pb-10">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-800 dark:text-white tracking-tight">
            Domino's Executive Dashboard
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Real-time store metrics, live order tracking, and sales analytics (Synced with MongoDB: dominos_customers)
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => loadStats(true)}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 shadow-sm transition-all"
            title="Refresh dashboard stats"
          >
            <FiRefreshCw className={`text-sm ${isRefreshing ? 'animate-spin text-primary' : ''}`} />
            <span>Refresh</span>
          </button>
          <div className="flex items-center gap-2 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            Live Sync ({lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })})
          </div>
        </div>
      </div>

      {/* 1. Statistics Cards (8 Cards as requested) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {loading ? (
          [...Array(8)].map((_, i) => <StatCardSkeleton key={i} />)
        ) : (
          <>
            <StatCard
              icon={<FiUsers />}
              title="Total Registered Users"
              value={stats?.totalUsers || 0}
              change={12}
              color="blue"
            />
            <StatCard
              icon={<FiShoppingBag />}
              title="Total Orders"
              value={stats?.totalOrders || 0}
              change={8}
              color="primary"
            />
            <StatCard
              icon={<FiDollarSign />}
              title="Total Revenue"
              value={stats?.totalRevenue || 0}
              change={15}
              isCurrency={true}
              color="green"
            />
            <StatCard
              icon={<FiTrendingUp />}
              title="Today's Revenue"
              value={stats?.todayRevenue || 0}
              change={22}
              isCurrency={true}
              color="orange"
            />
            <StatCard
              icon={<FiCalendar />}
              title="Weekly Revenue"
              value={stats?.weeklyRevenue || 0}
              change={9}
              isCurrency={true}
              color="purple"
            />
            <StatCard
              icon={<FiCalendar />}
              title="Monthly Revenue"
              value={stats?.monthlyRevenue || 0}
              change={18}
              isCurrency={true}
              color="pink"
            />
            <StatCard
              icon={<FiUserCheck />}
              title="Active Employees"
              value={stats?.activeEmployees || 0}
              change={4}
              color="blue"
            />
            <StatCard
              icon={<FiClock />}
              title="Pending Orders"
              value={stats?.pendingOrders || 0}
              change={-5}
              color="orange"
            />
          </>
        )}
      </div>

      {/* Highlights Bar */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white p-5 rounded-2xl shadow-xl">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary/20 rounded-xl text-primary text-xl">
              <FiPieChart />
            </div>
            <div>
              <p className="text-[11px] text-gray-400 font-semibold uppercase">Most Ordered Pizza</p>
              <p className="text-sm font-bold">{stats.mostOrderedPizza}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-secondary/20 rounded-xl text-secondary text-xl">
              <FiAward />
            </div>
            <div>
              <p className="text-[11px] text-gray-400 font-semibold uppercase">Top Customer</p>
              <p className="text-sm font-bold">{stats.topCustomer.name} ({formatCurrency(stats.topCustomer.total)})</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-500/20 rounded-xl text-emerald-400 text-xl">
              <FiDollarSign />
            </div>
            <div>
              <p className="text-[11px] text-gray-400 font-semibold uppercase">Today's Net Profit</p>
              <p className="text-sm font-bold text-emerald-400">
                {stats.todayProfit !== undefined ? formatCurrency(stats.todayProfit) : formatCurrency(Math.round(stats.todayRevenue * 0.55))}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-500/20 rounded-xl text-blue-400 text-xl">
              <FiTrendingUp />
            </div>
            <div>
              <p className="text-[11px] text-gray-400 font-semibold uppercase">Avg Order Value</p>
              <p className="text-sm font-bold">{formatCurrency(stats.averageOrderValue)}</p>
            </div>
          </div>
        </div>
      )}

      {/* 2. Live Order Tracker */}
      <OrderTracker activeStatus="Cooking" />

      {/* 3. Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SalesChart />
        <RevenueChart />
      </div>

      {/* 4. Side-by-Side Activity & Notifications */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentActivities />
        <NotificationCard />
      </div>
    </div>
  );
}
