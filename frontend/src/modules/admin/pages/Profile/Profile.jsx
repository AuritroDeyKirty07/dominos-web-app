// src/pages/Profile/Profile.jsx
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  FiUsers,
  FiTruck,
  FiUserPlus,
  FiEdit2,
  FiTrash2,
  FiEye,
  FiSearch,
  FiCheckCircle,
  FiPhone,
  FiMail,
  FiMapPin,
  FiStar,
  FiAward,
  FiCheck,
  FiX,
  FiDownload,
} from 'react-icons/fi';
import { GiChefToque } from 'react-icons/gi';
import {
  fetchAllEmployees,
  addEmployee,
  editEmployee,
  removeEmployee,
} from '../../controllers/employeeController';
import {
  fetchAllUsers,
  addUser,
  editUser,
  removeUser,
} from '../../controllers/userController';
import { formatCurrency, formatDate } from '../../shared/utils/format';

export default function Profile() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTabParam = searchParams.get('tab') || 'user';
  const [activeTab, setActiveTab] = useState(activeTabParam);

  const [users, setUsers] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [toast, setToast] = useState(null);

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [selectedItem, setSelectedItem] = useState(null);
  const [formData, setFormData] = useState({});

  // Sync tab with URL
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab && ['user', 'delivery', 'cook'].includes(tab.toLowerCase())) {
      setActiveTab(tab.toLowerCase());
    }
  }, [searchParams]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchParams({ tab });
    setSearch('');
    setStatusFilter('All');
  };

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3500);
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const [uData, eData] = await Promise.all([
        fetchAllUsers(),
        fetchAllEmployees(),
      ]);
      setUsers(uData);
      setEmployees(eData);
    } catch (err) {
      console.error('Error fetching data in Profile Hub:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filtered dataset according to active tab
  const cooks = employees.filter((e) => e.role === 'Cook');
  const deliveryDrivers = employees.filter(
    (e) => e.role === 'Delivery Driver' || e.role === 'Delivery'
  );

  let currentList = [];
  if (activeTab === 'user') currentList = users;
  else if (activeTab === 'delivery') currentList = deliveryDrivers;
  else if (activeTab === 'cook') currentList = cooks;

  // Search & Filter
  const filteredList = currentList.filter((item) => {
    const matchSearch =
      (item.name && item.name.toLowerCase().includes(search.toLowerCase())) ||
      (item.email && item.email.toLowerCase().includes(search.toLowerCase())) ||
      (item.phone && item.phone.includes(search)) ||
      (item.specialty && item.specialty.toLowerCase().includes(search.toLowerCase())) ||
      (item.vehicleNumber && item.vehicleNumber.toLowerCase().includes(search.toLowerCase()));

    if (!matchSearch) return false;

    if (statusFilter === 'All') return true;
    if (activeTab === 'user') {
      return statusFilter === 'Active' ? item.isActive : !item.isActive;
    }
    return item.status === statusFilter;
  });

  // Modal Open Handlers
  const handleOpenAdd = () => {
    if (activeTab === 'user') {
      setFormData({
        name: '',
        email: '',
        phone: '',
        address: '',
        city: 'Mumbai',
        role: 'Customer',
        isActive: true,
      });
    } else if (activeTab === 'delivery') {
      setFormData({
        name: '',
        phone: '',
        email: '',
        role: 'Delivery Driver',
        vehicleType: 'Bike',
        vehicleNumber: '',
        status: 'Active',
        rating: 4.8,
      });
    } else if (activeTab === 'cook') {
      setFormData({
        name: '',
        phone: '',
        email: '',
        role: 'Cook',
        specialty: 'Pizza Master (Cheese Burst)',
        shift: 'Morning',
        status: 'Active',
        rating: 4.9,
      });
    }
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setSelectedItem(item);
    setFormData({ ...item });
    setIsEditModalOpen(true);
  };

  const handleOpenView = (item) => {
    setSelectedItem(item);
    setIsViewModalOpen(true);
  };

  const handleOpenDelete = (item) => {
    setSelectedItem(item);
    setIsDeleteModalOpen(true);
  };

  // CRUD Submissions
  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      if (activeTab === 'user') {
        const created = await addUser(formData);
        setUsers((prev) => [created, ...prev]);
        showToast(`User "${created.name}" created successfully!`);
      } else {
        const created = await addEmployee(formData);
        setEmployees((prev) => [created, ...prev]);
        showToast(
          `${activeTab === 'cook' ? 'Cook' : 'Delivery Driver'} "${created.name}" added successfully!`
        );
      }
      setIsAddModalOpen(false);
    } catch (err) {
      alert(`Failed to create: ${err.message}`);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      if (activeTab === 'user') {
        const updated = await editUser(selectedItem.id, formData);
        setUsers((prev) =>
          prev.map((u) => (u.id === selectedItem.id ? updated : u))
        );
        showToast(`User "${updated.name}" updated successfully!`);
      } else {
        const updated = await editEmployee(selectedItem.id, formData);
        setEmployees((prev) =>
          prev.map((emp) => (emp.id === selectedItem.id ? updated : emp))
        );
        showToast(
          `${activeTab === 'cook' ? 'Cook' : 'Delivery Driver'} "${updated.name}" updated successfully!`
        );
      }
      setIsEditModalOpen(false);
    } catch (err) {
      alert(`Failed to update: ${err.message}`);
    }
  };

  const handleDelete = async () => {
    try {
      if (activeTab === 'user') {
        await removeUser(selectedItem.id);
        setUsers((prev) => prev.filter((u) => u.id !== selectedItem.id));
        showToast(`User #${selectedItem.id} removed successfully.`);
      } else {
        await removeEmployee(selectedItem.id);
        setEmployees((prev) =>
          prev.filter((emp) => emp.id !== selectedItem.id)
        );
        showToast(`Employee #${selectedItem.id} removed successfully.`);
      }
      setIsDeleteModalOpen(false);
    } catch (err) {
      alert(`Failed to delete: ${err.message}`);
    }
  };

  // Export CSV
  const handleExportCSV = () => {
    let headers = '';
    let rows = [];
    if (activeTab === 'user') {
      headers = 'ID,Name,Email,Phone,Address,City,Role,OrdersCount,TotalSpent,Status,JoinedAt\n';
      rows = filteredList.map(
        (u) =>
          `${u.id},"${u.name}",${u.email},${u.phone},"${u.address || ''}","${u.city || ''}",${u.role},${u.ordersCount},${u.totalSpent},${u.isActive ? 'Active' : 'Inactive'},${u.joinedAt}`
      );
    } else if (activeTab === 'delivery') {
      headers = 'ID,Name,Phone,Email,VehicleType,VehicleNumber,OrdersDelivered,Rating,Status,JoinedAt\n';
      rows = filteredList.map(
        (d) =>
          `${d.id},"${d.name}",${d.phone},${d.email},${d.vehicleType},"${d.vehicleNumber}",${d.ordersHandled},${d.rating},${d.status},${d.joinedAt}`
      );
    } else {
      headers = 'ID,Name,Phone,Email,Specialty,Shift,OrdersPrepared,Rating,Status,JoinedAt\n';
      rows = filteredList.map(
        (c) =>
          `${c.id},"${c.name}",${c.phone},${c.email},"${c.specialty}",${c.shift},${c.ordersHandled},${c.rating},${c.status},${c.joinedAt}`
      );
    }
    const blob = new Blob([headers + rows.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Dominos_${activeTab.toUpperCase()}_Records_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-20 right-6 z-50 p-4 rounded-xl bg-emerald-600 text-white shadow-2xl text-sm font-semibold flex items-center gap-3 animate-fade-in">
          <FiCheckCircle className="text-xl" />
          <span>{toast}</span>
        </div>
      )}

      {/* Header & Main Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-800 dark:text-white tracking-tight">
            Profile & Personnel Directory
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Manage, add, update, and monitor User, Delivery, and Cook profiles across the store
          </p>
        </div>

        {/* 3 Tab Navigation Pills */}
        <div className="flex items-center bg-gray-100 dark:bg-gray-800 p-1.5 rounded-2xl border border-gray-200 dark:border-gray-700">
          <button
            onClick={() => handleTabChange('user')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'user'
                ? 'bg-white dark:bg-gray-700 text-primary shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <FiUsers className="text-base" />
            <span>Users</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-primary/10 text-primary">
              {users.length}
            </span>
          </button>

          <button
            onClick={() => handleTabChange('delivery')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'delivery'
                ? 'bg-white dark:bg-gray-700 text-primary shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <FiTruck className="text-base" />
            <span>Delivery</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-blue-500/10 text-blue-500">
              {deliveryDrivers.length}
            </span>
          </button>

          <button
            onClick={() => handleTabChange('cook')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'cook'
                ? 'bg-white dark:bg-gray-700 text-primary shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <GiChefToque className="text-base" />
            <span>Cook</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-amber-500/10 text-amber-500">
              {cooks.length}
            </span>
          </button>
        </div>
      </div>

      {/* Summary Metrics for Active Tab */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {activeTab === 'user' && (
          <>
            <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-card border border-gray-100 dark:border-gray-700/60">
              <p className="text-xs font-bold uppercase text-gray-400">Total Customers</p>
              <p className="text-2xl font-black text-gray-900 dark:text-white mt-1">{users.length}</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-card border border-gray-100 dark:border-gray-700/60">
              <p className="text-xs font-bold uppercase text-gray-400">Active Accounts</p>
              <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
                {users.filter((u) => u.isActive).length}
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-card border border-gray-100 dark:border-gray-700/60">
              <p className="text-xs font-bold uppercase text-gray-400">Total Customer Revenue</p>
              <p className="text-2xl font-black text-primary mt-1">
                {formatCurrency(users.reduce((acc, u) => acc + (Number(u.totalSpent) || 0), 0))}
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-card border border-gray-100 dark:border-gray-700/60">
              <p className="text-xs font-bold uppercase text-gray-400">VIP Members</p>
              <p className="text-2xl font-black text-purple-600 dark:text-purple-400 mt-1">
                {users.filter((u) => u.role === 'VIP Customer').length}
              </p>
            </div>
          </>
        )}

        {activeTab === 'delivery' && (
          <>
            <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-card border border-gray-100 dark:border-gray-700/60">
              <p className="text-xs font-bold uppercase text-gray-400">Fleet Drivers</p>
              <p className="text-2xl font-black text-gray-900 dark:text-white mt-1">{deliveryDrivers.length}</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-card border border-gray-100 dark:border-gray-700/60">
              <p className="text-xs font-bold uppercase text-gray-400">Active / On Duty</p>
              <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
                {deliveryDrivers.filter((d) => d.status === 'Active' || d.status === 'On Delivery').length}
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-card border border-gray-100 dark:border-gray-700/60">
              <p className="text-xs font-bold uppercase text-gray-400">Total Deliveries Handled</p>
              <p className="text-2xl font-black text-blue-600 dark:text-blue-400 mt-1">
                {deliveryDrivers.reduce((acc, d) => acc + (Number(d.ordersHandled) || 0), 0)}
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-card border border-gray-100 dark:border-gray-700/60">
              <p className="text-xs font-bold uppercase text-gray-400">Fleet Avg Rating</p>
              <p className="text-2xl font-black text-amber-500 mt-1">⭐ 4.88 / 5.0</p>
            </div>
          </>
        )}

        {activeTab === 'cook' && (
          <>
            <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-card border border-gray-100 dark:border-gray-700/60">
              <p className="text-xs font-bold uppercase text-gray-400">Kitchen Cooks & Chefs</p>
              <p className="text-2xl font-black text-gray-900 dark:text-white mt-1">{cooks.length}</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-card border border-gray-100 dark:border-gray-700/60">
              <p className="text-xs font-bold uppercase text-gray-400">Currently in Kitchen</p>
              <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
                {cooks.filter((c) => c.status === 'Active').length}
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-card border border-gray-100 dark:border-gray-700/60">
              <p className="text-xs font-bold uppercase text-gray-400">Pizzas & Dishes Prepared</p>
              <p className="text-2xl font-black text-primary mt-1">
                {cooks.reduce((acc, c) => acc + (Number(c.ordersHandled) || 0), 0)}
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-card border border-gray-100 dark:border-gray-700/60">
              <p className="text-xs font-bold uppercase text-gray-400">Top Pizza Master</p>
              <p className="text-sm font-bold text-gray-900 dark:text-white mt-2">
                Suresh Yadav (450 Orders)
              </p>
            </div>
          </>
        )}
      </div>

      {/* Main Table Card with Search, Filter & Action Buttons */}
      <div className="rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-card border border-gray-100 dark:border-gray-700/60 space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Search & Filter */}
          <div className="flex flex-wrap items-center gap-3 flex-1">
            <div className="relative flex-1 min-w-[240px] max-w-md">
              <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder={`Search ${activeTab === 'user' ? 'users by name, email, phone...' : activeTab === 'delivery' ? 'drivers by name, vehicle, phone...' : 'cooks by name, specialty...'}`}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-700/70 border border-gray-200 dark:border-gray-600 text-sm text-gray-800 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3.5 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-700/70 border border-gray-200 dark:border-gray-600 text-sm text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              {activeTab === 'delivery' && <option value="On Delivery">On Delivery</option>}
              {activeTab === 'cook' && <option value="On Break">On Break</option>}
            </select>
          </div>

          {/* Action Buttons: Add & Export */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-xs font-semibold rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              <FiDownload /> Export CSV
            </button>

            <button
              onClick={handleOpenAdd}
              className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white text-xs font-bold rounded-xl hover:bg-primary/90 shadow-lg shadow-primary/25 transition-all"
            >
              <FiUserPlus className="text-base" />
              <span>
                Add {activeTab === 'user' ? 'User' : activeTab === 'delivery' ? 'Delivery Driver' : 'Cook'}
              </span>
            </button>
          </div>
        </div>

        {/* Dynamic Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700 text-xs font-bold uppercase text-gray-400">
                <th className="py-3.5 px-4">ID</th>
                <th className="py-3.5 px-4">Name & Contact</th>
                {activeTab === 'user' && (
                  <>
                    <th className="py-3.5 px-4">City / Location</th>
                    <th className="py-3.5 px-4">Role / Segment</th>
                    <th className="py-3.5 px-4">Orders</th>
                    <th className="py-3.5 px-4">Total Spent</th>
                  </>
                )}
                {activeTab === 'delivery' && (
                  <>
                    <th className="py-3.5 px-4">Vehicle Details</th>
                    <th className="py-3.5 px-4">Deliveries</th>
                    <th className="py-3.5 px-4">Rating</th>
                  </>
                )}
                {activeTab === 'cook' && (
                  <>
                    <th className="py-3.5 px-4">Specialty</th>
                    <th className="py-3.5 px-4">Shift</th>
                    <th className="py-3.5 px-4">Orders Cooked</th>
                  </>
                )}
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-center">Actions (CRUD)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50 text-sm">
              {loading ? (
                <tr>
                  <td colSpan="8" className="py-10 text-center text-gray-400">
                    Loading records...
                  </td>
                </tr>
              ) : filteredList.length === 0 ? (
                <tr>
                  <td colSpan="8" className="py-12 text-center text-gray-400">
                    No matching records found.
                  </td>
                </tr>
              ) : (
                filteredList.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
                  >
                    {/* ID */}
                    <td className="py-3.5 px-4 font-bold text-primary text-xs">
                      #{item.id}
                    </td>

                    {/* Name & Contact */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 text-primary flex items-center justify-center font-bold text-sm">
                          {item.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white">
                            {item.name}
                          </p>
                          <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                            {item.email && (
                              <span className="flex items-center gap-1">
                                <FiMail className="text-[11px]" /> {item.email}
                              </span>
                            )}
                            {item.phone && (
                              <span className="flex items-center gap-1">
                                <FiPhone className="text-[11px]" /> {item.phone}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Tab-Specific Columns */}
                    {activeTab === 'user' && (
                      <>
                        <td className="py-3.5 px-4 text-xs text-gray-600 dark:text-gray-300">
                          {item.city || item.address || 'Standard Location'}
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                              item.role === 'VIP Customer'
                                ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400'
                                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                            }`}
                          >
                            {item.role || 'Customer'}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-bold text-gray-800 dark:text-gray-200">
                          {item.ordersCount}
                        </td>
                        <td className="py-3.5 px-4 font-bold text-emerald-600 dark:text-emerald-400">
                          {formatCurrency(item.totalSpent)}
                        </td>
                      </>
                    )}

                    {activeTab === 'delivery' && (
                      <>
                        <td className="py-3.5 px-4 text-xs">
                          <span className="font-semibold text-gray-800 dark:text-white block">
                            {item.vehicleType || 'Bike'}
                          </span>
                          <span className="text-gray-400 text-[11px]">
                            {item.vehicleNumber || 'No plate registered'}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-bold text-blue-600 dark:text-blue-400">
                          {item.ordersHandled}
                        </td>
                        <td className="py-3.5 px-4 text-xs font-bold text-amber-500">
                          ⭐ {item.rating || 4.8}
                        </td>
                      </>
                    )}

                    {activeTab === 'cook' && (
                      <>
                        <td className="py-3.5 px-4 text-xs font-medium text-gray-800 dark:text-gray-200">
                          {item.specialty || 'General Pizza Prep'}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="px-2.5 py-0.5 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-semibold">
                            {item.shift || 'Morning'}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-bold text-gray-800 dark:text-gray-200">
                          {item.ordersHandled}
                        </td>
                      </>
                    )}

                    {/* Status Badge */}
                    <td className="py-3.5 px-4">
                      {activeTab === 'user' ? (
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                            item.isActive
                              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                              : 'bg-gray-500/10 text-gray-500'
                          }`}
                        >
                          {item.isActive ? 'Active' : 'Inactive'}
                        </span>
                      ) : (
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                            item.status === 'Active'
                              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                              : item.status === 'On Delivery'
                              ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                              : item.status === 'On Break'
                              ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                              : 'bg-gray-500/10 text-gray-500'
                          }`}
                        >
                          {item.status}
                        </span>
                      )}
                    </td>

                    {/* CRUD Actions Buttons */}
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        {/* View Details */}
                        <button
                          onClick={() => handleOpenView(item)}
                          title="View Details"
                          className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-primary hover:text-white transition-colors text-xs"
                        >
                          <FiEye />
                        </button>

                        {/* Edit */}
                        <button
                          onClick={() => handleOpenEdit(item)}
                          title="Edit"
                          className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-600 hover:text-white transition-colors text-xs"
                        >
                          <FiEdit2 />
                        </button>

                        {/* Delete */}
                        <button
                          onClick={() => handleOpenDelete(item)}
                          title="Delete"
                          className="p-2 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-600 hover:text-white transition-colors text-xs"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 1. ADD MODAL (Create)                                    */}
      {/* ======================================================== */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5 animate-fade-in">
            <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-3">
              <h3 className="font-bold text-lg text-gray-800 dark:text-white flex items-center gap-2">
                <FiUserPlus className="text-primary" />
                Add New {activeTab === 'user' ? 'Customer/User' : activeTab === 'delivery' ? 'Delivery Driver' : 'Cook'}
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                <FiX className="text-xl" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-500 dark:text-gray-400 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-sm text-gray-800 dark:text-white focus:ring-2 focus:ring-primary/30"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-gray-500 dark:text-gray-400 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.phone || ''}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-sm text-gray-800 dark:text-white focus:ring-2 focus:ring-primary/30"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase text-gray-500 dark:text-gray-400 mb-1">
                    Email Address {activeTab === 'user' ? '*' : '(Optional)'}
                  </label>
                  <input
                    type="email"
                    required={activeTab === 'user'}
                    value={formData.email || ''}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-sm text-gray-800 dark:text-white focus:ring-2 focus:ring-primary/30"
                  />
                </div>

                {/* Tab specific add fields */}
                {activeTab === 'user' && (
                  <>
                    <div>
                      <label className="block text-xs font-bold uppercase text-gray-500 dark:text-gray-400 mb-1">
                        City
                      </label>
                      <input
                        type="text"
                        value={formData.city || ''}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-sm text-gray-800 dark:text-white focus:ring-2 focus:ring-primary/30"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-gray-500 dark:text-gray-400 mb-1">
                        User Segment / Role
                      </label>
                      <select
                        value={formData.role || 'Customer'}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-sm text-gray-800 dark:text-white focus:ring-2 focus:ring-primary/30"
                      >
                        <option value="Customer">Standard Customer</option>
                        <option value="VIP Customer">VIP Customer</option>
                      </select>
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold uppercase text-gray-500 dark:text-gray-400 mb-1">
                        Delivery Address
                      </label>
                      <input
                        type="text"
                        value={formData.address || ''}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-sm text-gray-800 dark:text-white focus:ring-2 focus:ring-primary/30"
                      />
                    </div>
                  </>
                )}

                {activeTab === 'delivery' && (
                  <>
                    <div>
                      <label className="block text-xs font-bold uppercase text-gray-500 dark:text-gray-400 mb-1">
                        Vehicle Type
                      </label>
                      <select
                        value={formData.vehicleType || 'Bike'}
                        onChange={(e) => setFormData({ ...formData, vehicleType: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-sm text-gray-800 dark:text-white focus:ring-2 focus:ring-primary/30"
                      >
                        <option value="Bike">Motorcycle / Bike</option>
                        <option value="EV Scooter">Electric Scooter (EV)</option>
                        <option value="Scooter">Petrol Scooter</option>
                        <option value="Car">Car / Van</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-gray-500 dark:text-gray-400 mb-1">
                        Vehicle Plate Number
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. MH-02-AB-1234"
                        value={formData.vehicleNumber || ''}
                        onChange={(e) => setFormData({ ...formData, vehicleNumber: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-sm text-gray-800 dark:text-white focus:ring-2 focus:ring-primary/30"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-gray-500 dark:text-gray-400 mb-1">
                        Status
                      </label>
                      <select
                        value={formData.status || 'Active'}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-sm text-gray-800 dark:text-white focus:ring-2 focus:ring-primary/30"
                      >
                        <option value="Active">Active / On Duty</option>
                        <option value="On Delivery">On Delivery</option>
                        <option value="Inactive">Inactive / Off Duty</option>
                      </select>
                    </div>
                  </>
                )}

                {activeTab === 'cook' && (
                  <>
                    <div>
                      <label className="block text-xs font-bold uppercase text-gray-500 dark:text-gray-400 mb-1">
                        Specialty / Role
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Pizza Master, Oven Specialist"
                        value={formData.specialty || ''}
                        onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-sm text-gray-800 dark:text-white focus:ring-2 focus:ring-primary/30"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-gray-500 dark:text-gray-400 mb-1">
                        Shift Schedule
                      </label>
                      <select
                        value={formData.shift || 'Morning'}
                        onChange={(e) => setFormData({ ...formData, shift: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-sm text-gray-800 dark:text-white focus:ring-2 focus:ring-primary/30"
                      >
                        <option value="Morning">Morning Shift (8 AM - 4 PM)</option>
                        <option value="Evening">Evening Shift (4 PM - 12 AM)</option>
                        <option value="Night">Night Shift (12 AM - 8 AM)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-gray-500 dark:text-gray-400 mb-1">
                        Kitchen Status
                      </label>
                      <select
                        value={formData.status || 'Active'}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-sm text-gray-800 dark:text-white focus:ring-2 focus:ring-primary/30"
                      >
                        <option value="Active">Active</option>
                        <option value="On Break">On Break</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </div>
                  </>
                )}
              </div>

              <div className="pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs font-bold hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary/90 shadow-md shadow-primary/20 transition-all flex items-center gap-1.5"
                >
                  <FiCheck /> Save & Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 2. EDIT MODAL (Update)                                   */}
      {/* ======================================================== */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5 animate-fade-in">
            <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-3">
              <h3 className="font-bold text-lg text-gray-800 dark:text-white flex items-center gap-2">
                <FiEdit2 className="text-blue-500" />
                Edit {activeTab === 'user' ? 'Customer Profile' : activeTab === 'delivery' ? 'Delivery Driver' : 'Cook'} #{selectedItem?.id}
              </h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                <FiX className="text-xl" />
              </button>
            </div>

            <form onSubmit={handleUpdate} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-500 dark:text-gray-400 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-sm text-gray-800 dark:text-white focus:ring-2 focus:ring-primary/30"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-gray-500 dark:text-gray-400 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.phone || ''}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-sm text-gray-800 dark:text-white focus:ring-2 focus:ring-primary/30"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase text-gray-500 dark:text-gray-400 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={formData.email || ''}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-sm text-gray-800 dark:text-white focus:ring-2 focus:ring-primary/30"
                  />
                </div>

                {activeTab === 'user' && (
                  <>
                    <div>
                      <label className="block text-xs font-bold uppercase text-gray-500 dark:text-gray-400 mb-1">
                        City
                      </label>
                      <input
                        type="text"
                        value={formData.city || ''}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-sm text-gray-800 dark:text-white focus:ring-2 focus:ring-primary/30"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-gray-500 dark:text-gray-400 mb-1">
                        Role / Tier
                      </label>
                      <select
                        value={formData.role || 'Customer'}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-sm text-gray-800 dark:text-white focus:ring-2 focus:ring-primary/30"
                      >
                        <option value="Customer">Customer</option>
                        <option value="VIP Customer">VIP Customer</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-gray-500 dark:text-gray-400 mb-1">
                        Account Status
                      </label>
                      <select
                        value={formData.isActive ? 'true' : 'false'}
                        onChange={(e) => setFormData({ ...formData, isActive: e.target.value === 'true' })}
                        className="w-full px-3.5 py-2 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-sm text-gray-800 dark:text-white focus:ring-2 focus:ring-primary/30"
                      >
                        <option value="true">Active</option>
                        <option value="false">Inactive</option>
                      </select>
                    </div>
                  </>
                )}

                {activeTab === 'delivery' && (
                  <>
                    <div>
                      <label className="block text-xs font-bold uppercase text-gray-500 dark:text-gray-400 mb-1">
                        Vehicle Type
                      </label>
                      <select
                        value={formData.vehicleType || 'Bike'}
                        onChange={(e) => setFormData({ ...formData, vehicleType: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-sm text-gray-800 dark:text-white focus:ring-2 focus:ring-primary/30"
                      >
                        <option value="Bike">Motorcycle / Bike</option>
                        <option value="EV Scooter">Electric Scooter (EV)</option>
                        <option value="Scooter">Petrol Scooter</option>
                        <option value="Car">Car / Van</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-gray-500 dark:text-gray-400 mb-1">
                        Vehicle Number
                      </label>
                      <input
                        type="text"
                        value={formData.vehicleNumber || ''}
                        onChange={(e) => setFormData({ ...formData, vehicleNumber: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-sm text-gray-800 dark:text-white focus:ring-2 focus:ring-primary/30"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-gray-500 dark:text-gray-400 mb-1">
                        Status
                      </label>
                      <select
                        value={formData.status || 'Active'}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-sm text-gray-800 dark:text-white focus:ring-2 focus:ring-primary/30"
                      >
                        <option value="Active">Active / On Duty</option>
                        <option value="On Delivery">On Delivery</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </div>
                  </>
                )}

                {activeTab === 'cook' && (
                  <>
                    <div>
                      <label className="block text-xs font-bold uppercase text-gray-500 dark:text-gray-400 mb-1">
                        Specialty
                      </label>
                      <input
                        type="text"
                        value={formData.specialty || ''}
                        onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-sm text-gray-800 dark:text-white focus:ring-2 focus:ring-primary/30"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-gray-500 dark:text-gray-400 mb-1">
                        Shift
                      </label>
                      <select
                        value={formData.shift || 'Morning'}
                        onChange={(e) => setFormData({ ...formData, shift: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-sm text-gray-800 dark:text-white focus:ring-2 focus:ring-primary/30"
                      >
                        <option value="Morning">Morning Shift</option>
                        <option value="Evening">Evening Shift</option>
                        <option value="Night">Night Shift</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-gray-500 dark:text-gray-400 mb-1">
                        Status
                      </label>
                      <select
                        value={formData.status || 'Active'}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-sm text-gray-800 dark:text-white focus:ring-2 focus:ring-primary/30"
                      >
                        <option value="Active">Active</option>
                        <option value="On Break">On Break</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </div>
                  </>
                )}
              </div>

              <div className="pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs font-bold hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 shadow-md shadow-blue-500/20 transition-all flex items-center gap-1.5"
                >
                  <FiCheck /> Update Details
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 3. VIEW DETAILS MODAL (Read)                             */}
      {/* ======================================================== */}
      {isViewModalOpen && selectedItem && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5 animate-fade-in">
            <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-secondary text-white flex items-center justify-center text-xl font-bold">
                  {selectedItem.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                    {selectedItem.name}
                  </h3>
                  <span className="text-xs text-gray-400">
                    ID #{selectedItem.id} • Registered {formatDate(selectedItem.joinedAt)}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                <FiX className="text-xl" />
              </button>
            </div>

            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-3 p-4 rounded-xl bg-gray-50 dark:bg-gray-700/40">
                <div>
                  <p className="text-[11px] font-bold text-gray-400 uppercase">Phone Number</p>
                  <p className="font-semibold text-gray-800 dark:text-white mt-0.5">{selectedItem.phone || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-[11px] font-bold text-gray-400 uppercase">Email Address</p>
                  <p className="font-semibold text-gray-800 dark:text-white mt-0.5">{selectedItem.email || 'N/A'}</p>
                </div>
              </div>

              {activeTab === 'user' && (
                <div className="grid grid-cols-2 gap-3 p-4 rounded-xl bg-gray-50 dark:bg-gray-700/40">
                  <div>
                    <p className="text-[11px] font-bold text-gray-400 uppercase">Orders Placed</p>
                    <p className="text-xl font-bold text-primary mt-0.5">{selectedItem.ordersCount || 0}</p>
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-gray-400 uppercase">Total Spent</p>
                    <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                      {formatCurrency(selectedItem.totalSpent || 0)}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-[11px] font-bold text-gray-400 uppercase">Address / Location</p>
                    <p className="text-xs text-gray-700 dark:text-gray-300 mt-0.5">
                      {selectedItem.address ? `${selectedItem.address}, ${selectedItem.city}` : 'No address provided'}
                    </p>
                  </div>
                </div>
              )}

              {activeTab === 'delivery' && (
                <div className="grid grid-cols-2 gap-3 p-4 rounded-xl bg-gray-50 dark:bg-gray-700/40">
                  <div>
                    <p className="text-[11px] font-bold text-gray-400 uppercase">Vehicle Type</p>
                    <p className="font-bold text-gray-800 dark:text-white mt-0.5">{selectedItem.vehicleType || 'Bike'}</p>
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-gray-400 uppercase">Plate Number</p>
                    <p className="font-mono font-bold text-gray-800 dark:text-white mt-0.5">{selectedItem.vehicleNumber || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-gray-400 uppercase">Deliveries Completed</p>
                    <p className="text-xl font-bold text-blue-600 dark:text-blue-400 mt-0.5">{selectedItem.ordersHandled || 0}</p>
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-gray-400 uppercase">Customer Rating</p>
                    <p className="text-xl font-bold text-amber-500 mt-0.5">⭐ {selectedItem.rating || 4.8} / 5.0</p>
                  </div>
                </div>
              )}

              {activeTab === 'cook' && (
                <div className="grid grid-cols-2 gap-3 p-4 rounded-xl bg-gray-50 dark:bg-gray-700/40">
                  <div>
                    <p className="text-[11px] font-bold text-gray-400 uppercase">Specialty</p>
                    <p className="font-bold text-gray-800 dark:text-white mt-0.5">{selectedItem.specialty || 'General'}</p>
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-gray-400 uppercase">Shift Timing</p>
                    <p className="font-bold text-gray-800 dark:text-white mt-0.5">{selectedItem.shift || 'Morning'}</p>
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-gray-400 uppercase">Pizzas Prepared</p>
                    <p className="text-xl font-bold text-primary mt-0.5">{selectedItem.ordersHandled || 0}</p>
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-gray-400 uppercase">Chef Rating</p>
                    <p className="text-xl font-bold text-amber-500 mt-0.5">⭐ {selectedItem.rating || 4.9} / 5.0</p>
                  </div>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-gray-200 dark:border-gray-700 flex justify-end">
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="px-5 py-2 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white text-xs font-bold hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 4. DELETE CONFIRMATION MODAL (Delete)                    */}
      {/* ======================================================== */}
      {isDeleteModalOpen && selectedItem && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-fade-in">
            <div className="flex items-center gap-3 text-red-600">
              <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-xl">
                <FiTrash2 />
              </div>
              <div>
                <h3 className="font-bold text-base text-gray-900 dark:text-white">
                  Confirm Deletion
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  This action cannot be undone.
                </p>
              </div>
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-300">
              Are you sure you want to permanently remove{' '}
              <strong className="text-gray-900 dark:text-white">{selectedItem.name}</strong> (ID #{selectedItem.id}) from the database?
            </p>

            <div className="pt-3 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs font-bold hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-5 py-2 rounded-xl bg-red-600 text-white text-xs font-bold hover:bg-red-700 shadow-md shadow-red-500/20 transition-all flex items-center gap-1.5"
              >
                <FiTrash2 /> Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
