// src/pages/Employees/Employees.jsx
import React, { useState, useEffect } from 'react';
import { FiUserPlus, FiUserCheck, FiBriefcase, FiAward, FiCheckCircle } from 'react-icons/fi';
import AddRoleModal from '../../components/forms/AddRoleModal';
import { fetchAllEmployees } from '../../controllers/employeeController';
import { TableSkeleton } from '../../components/loaders/SkeletonLoader';
import { formatDate } from '../../shared/utils/format';

export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState(null);

  const loadEmployees = async () => {
    setLoading(true);
    try {
      const data = await fetchAllEmployees();
      setEmployees(data);
    } catch (err) {
      console.error('Failed to load employees:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEmployees();
  }, []);

  const handleRoleRequestSuccess = () => {
    setToast('Role request submitted to Registration Service team!');
    setTimeout(() => setToast(null), 4000);
  };

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-800 dark:text-white tracking-tight">
            Employee & Staff Management
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Integrated with external Registration Service for role delegation
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all self-start sm:self-auto"
        >
          <FiUserPlus className="text-lg" />
          Add Role (Request Cook/Staff)
        </button>
      </div>

      {toast && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-sm font-semibold flex items-center gap-2 animate-fade-in">
          <FiCheckCircle className="text-lg" />
          {toast}
        </div>
      )}

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl bg-white dark:bg-gray-800 p-5 shadow-card flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center text-2xl">
            <FiUserCheck />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase">Active Staff</p>
            <p className="text-2xl font-bold text-gray-800 dark:text-white">
              {employees.filter((e) => e.status === 'Active').length}
            </p>
          </div>
        </div>

        <div className="rounded-2xl bg-white dark:bg-gray-800 p-5 shadow-card flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center text-2xl">
            <FiBriefcase />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase">Total Roles</p>
            <p className="text-2xl font-bold text-gray-800 dark:text-white">
              {new Set(employees.map((e) => e.role)).size}
            </p>
          </div>
        </div>

        <div className="rounded-2xl bg-white dark:bg-gray-800 p-5 shadow-card flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center text-2xl">
            <FiAward />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase">Best Performer</p>
            <p className="text-sm font-bold text-gray-800 dark:text-white">
              Ramesh Gupta (820 Orders)
            </p>
          </div>
        </div>
      </div>

      {/* Employees Directory Table */}
      <div className="rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-card overflow-hidden">
        <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Staff Directory</h2>
        {loading ? (
          <TableSkeleton />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700 text-xs font-semibold uppercase text-gray-400">
                  <th className="py-3 px-4">Employee ID</th>
                  <th className="py-3 px-4">Name</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Orders Handled</th>
                  <th className="py-3 px-4">Joined Date</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50 text-sm">
                {employees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-primary">EMP-00{emp.id}</td>
                    <td className="py-3.5 px-4 font-medium text-gray-800 dark:text-white">{emp.name}</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs font-semibold">
                        {emp.role}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-gray-800 dark:text-gray-200">{emp.ordersHandled}</td>
                    <td className="py-3.5 px-4 text-xs text-gray-500 dark:text-gray-400">{formatDate(emp.joinedAt)}</td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                          emp.status === 'Active'
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                            : 'bg-gray-500/10 text-gray-500'
                        }`}
                      >
                        {emp.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Role Modal */}
      <AddRoleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleRoleRequestSuccess}
      />
    </div>
  );
}
