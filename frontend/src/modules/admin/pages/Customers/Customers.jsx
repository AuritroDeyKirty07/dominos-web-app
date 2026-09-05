// src/pages/Customers/Customers.jsx
import React, { useState, useEffect } from 'react';
import {
  FiUsers,
  FiUserCheck,
  FiUserPlus,
  FiAward,
  FiPhone,
  FiMail,
  FiSearch,
  FiDownload,
  FiShoppingBag,
  FiEye,
} from 'react-icons/fi';
import StatCard from '../../components/cards/StatCard';
import { fetchAllUsers } from '../../controllers/userController';
import { fetchAllOrders } from '../../controllers/orderController';
import { TableSkeleton } from '../../components/loaders/SkeletonLoader';
import { formatCurrency, formatDate } from '../../shared/utils/format';

export default function Customers() {
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      setLoading(true);
      try {
        const [userData, orderData] = await Promise.all([fetchAllUsers(), fetchAllOrders()]);
        if (isMounted) {
          setUsers(userData);
          setOrders(orderData);
        }
      } catch (err) {
        console.error('Failed to load customer data:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadData();
    return () => { isMounted = false; };
  }, []);

  const totalCustomers = users.length;
  const returningCustomers = users.filter((u) => u.ordersCount > 1).length;
  const newCustomersToday = users.filter((u) => {
    const diffHours = (new Date() - new Date(u.joinedAt)) / (1000 * 60 * 60);
    return diffHours <= 24;
  }).length;

  const topUser = [...users].sort((a, b) => b.totalSpent - a.totalSpent)[0] || { name: 'N/A', totalSpent: 0 };

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.phone.includes(search)
  );

  const exportCSV = () => {
    const headers = ['ID,Name,Email,Phone,OrdersCount,TotalSpent,JoinedAt,Status\n'];
    const rows = users.map(
      (u) => `${u.id},"${u.name}",${u.email},${u.phone},${u.ordersCount},${u.totalSpent},${u.joinedAt},${u.isActive ? 'Active' : 'Inactive'}`
    );
    const blob = new Blob([headers.concat(rows.join('\n')).join('')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Domino_Customers_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };

  const customerOrders = selectedCustomer
    ? orders.filter((o) => o.customerName.toLowerCase() === selectedCustomer.name.toLowerCase())
    : [];

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-800 dark:text-white tracking-tight">
            Customer Intelligence & Statistics
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Monitor customer activity, spending habits, order history, and registration records
          </p>
        </div>
        <button
          onClick={exportCSV}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white text-xs font-semibold rounded-xl hover:bg-emerald-700 shadow-md transition-all self-start sm:self-auto"
        >
          <FiDownload /> Export CSV Data
        </button>
      </div>

      {/* Customer Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={<FiUsers />} title="Total Customers" value={totalCustomers} change={14} color="blue" />
        <StatCard icon={<FiUserCheck />} title="Returning Customers" value={returningCustomers} change={18} color="green" />
        <StatCard icon={<FiUserPlus />} title="New Customers Today" value={newCustomersToday} change={25} color="orange" />
        <StatCard icon={<FiAward />} title="Most Active Customer" value={topUser.name} change={30} color="purple" />
      </div>

      {/* Search & Directory Table */}
      <div className="rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-card overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h2 className="text-lg font-bold text-gray-800 dark:text-white">Customer Directory</h2>
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email, phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 w-full sm:w-72 rounded-xl bg-gray-100 dark:bg-gray-700 text-sm text-gray-800 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary/30"
            />
          </div>
        </div>

        {loading ? (
          <TableSkeleton />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700 text-xs font-semibold uppercase text-gray-400">
                  <th className="py-3 px-4">Name</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Phone</th>
                  <th className="py-3 px-4">Orders Placed</th>
                  <th className="py-3 px-4">Total Spent</th>
                  <th className="py-3 px-4">Joined Date</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-center">History</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50 text-sm">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="py-8 text-center text-gray-500">
                      No matching customers found.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-gray-900 dark:text-white">{u.name}</td>
                      <td className="py-3.5 px-4 text-gray-600 dark:text-gray-300">
                        <div className="flex items-center gap-1.5">
                          <FiMail className="text-xs text-gray-400" />
                          <span>{u.email}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-gray-600 dark:text-gray-300">
                        <div className="flex items-center gap-1.5">
                          <FiPhone className="text-xs text-gray-400" />
                          <span>{u.phone}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-medium text-gray-800 dark:text-gray-200">{u.ordersCount}</td>
                      <td className="py-3.5 px-4 font-bold text-emerald-600 dark:text-emerald-400">
                        {formatCurrency(u.totalSpent)}
                      </td>
                      <td className="py-3.5 px-4 text-xs text-gray-500 dark:text-gray-400">{formatDate(u.joinedAt)}</td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                            u.isActive
                              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                              : 'bg-gray-500/10 text-gray-500'
                          }`}
                        >
                          {u.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => setSelectedCustomer(u)}
                          className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-primary hover:text-white rounded-lg transition-all"
                        >
                          <FiEye className="inline mr-1" /> View Orders
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Customer Order History Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-xl shadow-2xl space-y-4 animate-fade-in">
            <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-3">
              <div>
                <h3 className="font-bold text-lg text-gray-800 dark:text-white">
                  Order History: {selectedCustomer.name}
                </h3>
                <p className="text-xs text-gray-400">Total Spent: {formatCurrency(selectedCustomer.totalSpent)}</p>
              </div>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                ✕
              </button>
            </div>

            <div className="max-h-80 overflow-y-auto space-y-3">
              {customerOrders.length === 0 ? (
                <p className="text-xs text-gray-500 text-center py-4">No individual order records found for this customer.</p>
              ) : (
                customerOrders.map((o) => (
                  <div
                    key={o.id}
                    className="p-3 bg-gray-50 dark:bg-gray-700/40 rounded-xl border border-gray-100 dark:border-gray-700 flex justify-between items-center"
                  >
                    <div>
                      <span className="font-bold text-primary text-xs">{o.id}</span>
                      <p className="text-xs text-gray-700 dark:text-gray-300 mt-0.5">
                        {Array.isArray(o.items) ? o.items.join(', ') : o.items}
                      </p>
                      <span className="text-[10px] text-gray-400">{formatDate(o.createdAt)}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-sm text-gray-900 dark:text-white block">{formatCurrency(o.total)}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 font-semibold">
                        {o.deliveryStatus}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="pt-3 border-t border-gray-200 dark:border-gray-700 flex justify-end">
              <button
                onClick={() => setSelectedCustomer(null)}
                className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white rounded-xl text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
