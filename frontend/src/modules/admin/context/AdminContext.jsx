// Admin Global Context — provides dashboard stats and sales data
import React, { createContext, useState, useEffect } from 'react';
import { getDashboardStats, getSalesData } from '../services/dashboardService';

export const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  const [stats, setStats] = useState(null);
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = async () => {
    try {
      setError(null);
      const data = await getDashboardStats();
      setStats(data);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    }
  };

  const fetchSales = async (period = 'weekly') => {
    try {
      const data = await getSalesData(period);
      setSales(data);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    }
  };

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      await Promise.all([fetchStats(), fetchSales()]);
      setLoading(false);
    };
    load();
  }, []);

  const value = {
    stats,
    sales,
    loading,
    error,
    refetchStats: fetchStats,
    refetchSales: fetchSales,
  };

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
};
