// src/pages/Settings/Settings.jsx
import React, { useState } from 'react';
import useTheme from '../../hooks/useTheme';
import adminApi from '../../services/adminApi';
import {
  FiMoon,
  FiSun,
  FiSave,
  FiServer,
  FiLock,
  FiActivity,
  FiCheckCircle,
  FiXCircle,
  FiShield,
} from 'react-icons/fi';

const rolesMatrix = [
  { role: 'Manager', viewOrders: true, editStatus: true, cancelOrders: true, requestRoles: true, analytics: true },
  { role: 'Cook', viewOrders: true, editStatus: true, cancelOrders: false, requestRoles: false, analytics: false },
  { role: 'Delivery Driver', viewOrders: true, editStatus: true, cancelOrders: false, requestRoles: false, analytics: false },
  { role: 'Cashier', viewOrders: true, editStatus: true, cancelOrders: true, requestRoles: false, analytics: false },
];

export default function Settings() {
  const { isDark, toggle } = useTheme();
  const [storeName, setStoreName] = useState("Domino's Central Store #104");
  const [currency, setCurrency] = useState('INR');
  const [saved, setSaved] = useState(false);
  const [testingApi, setTestingApi] = useState(false);
  const [apiStatus, setApiStatus] = useState(null);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const testApiConnection = async () => {
    setTestingApi(true);
    setApiStatus(null);
    try {
      // Attempt call to configured base URL
      await api.get('/health', { timeout: 3000 });
      setApiStatus({ success: true, message: 'Successfully connected to backend microservices!' });
    } catch (err) {
      const isMock = import.meta.env.VITE_USE_MOCK === 'true';
      if (isMock) {
        setApiStatus({
          success: true,
          message: 'VITE_USE_MOCK is set to true. Fallback Mock Service layer is active & operational.',
        });
      } else {
        setApiStatus({
          success: false,
          message: `Connection failed: ${err.message}. Verify VITE_API_BASE_URL endpoint.`,
        });
      }
    } finally {
      setTestingApi(false);
    }
  };

  return (
    <div className="space-y-6 pb-10 max-w-4xl">
      <div>
        <h1 className="text-2xl font-black text-gray-800 dark:text-white tracking-tight">
          System Settings & Configuration
        </h1>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Configure store identity, theme preferences, role permissions, and microservice connection testing
        </p>
      </div>

      {saved && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-sm font-semibold animate-fade-in">
          Settings updated successfully!
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Appearance Settings */}
        <div className="rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-card space-y-4">
          <h2 className="text-lg font-bold text-gray-800 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-3 flex items-center gap-2">
            {isDark ? <FiMoon /> : <FiSun />} Appearance & Theme
          </h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-800 dark:text-white">Dark Mode</p>
              <p className="text-xs text-gray-500">Toggle dark theme across dashboard layout (persisted in localStorage)</p>
            </div>
            <button
              type="button"
              onClick={toggle}
              className={`w-14 h-8 rounded-full p-1 transition-colors ${
                isDark ? 'bg-primary' : 'bg-gray-300'
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full bg-white shadow-md transform transition-transform ${
                  isDark ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* General Store Config */}
        <div className="rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-card space-y-4">
          <h2 className="text-lg font-bold text-gray-800 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-3 flex items-center gap-2">
            <FiServer /> Store Information
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 mb-1">
                Store Name
              </label>
              <input
                type="text"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-sm text-gray-800 dark:text-white focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 mb-1">
                Display Currency
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-sm text-gray-800 dark:text-white focus:ring-2 focus:ring-primary/30"
              >
                <option value="INR">INR (₹)</option>
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Role Permissions Matrix */}
        <div className="rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-card space-y-4">
          <h2 className="text-lg font-bold text-gray-800 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-3 flex items-center gap-2">
            <FiShield /> Employee Role Access Matrix
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700 font-semibold text-gray-400 uppercase">
                  <th className="py-2.5 px-3">Role</th>
                  <th className="py-2.5 px-3 text-center">View Orders</th>
                  <th className="py-2.5 px-3 text-center">Update Status</th>
                  <th className="py-2.5 px-3 text-center">Cancel Orders</th>
                  <th className="py-2.5 px-3 text-center">Request Roles</th>
                  <th className="py-2.5 px-3 text-center">Full Analytics</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
                {rolesMatrix.map((r) => (
                  <tr key={r.role}>
                    <td className="py-3 px-3 font-semibold text-gray-800 dark:text-white">{r.role}</td>
                    <td className="py-3 px-3 text-center">{r.viewOrders ? <FiCheckCircle className="inline text-emerald-500" /> : <FiXCircle className="inline text-gray-300" />}</td>
                    <td className="py-3 px-3 text-center">{r.editStatus ? <FiCheckCircle className="inline text-emerald-500" /> : <FiXCircle className="inline text-gray-300" />}</td>
                    <td className="py-3 px-3 text-center">{r.cancelOrders ? <FiCheckCircle className="inline text-emerald-500" /> : <FiXCircle className="inline text-gray-300" />}</td>
                    <td className="py-3 px-3 text-center">{r.requestRoles ? <FiCheckCircle className="inline text-emerald-500" /> : <FiXCircle className="inline text-gray-300" />}</td>
                    <td className="py-3 px-3 text-center">{r.analytics ? <FiCheckCircle className="inline text-emerald-500" /> : <FiXCircle className="inline text-gray-300" />}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Microservices API Config & Connection Tester */}
        <div className="rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-card space-y-4">
          <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-3">
            <h2 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
              <FiLock /> Service Endpoints & Diagnostic Test
            </h2>
            <button
              type="button"
              onClick={testApiConnection}
              disabled={testingApi}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              <FiActivity className={testingApi ? 'animate-spin' : ''} />
              {testingApi ? 'Testing...' : 'Test Backend Connection'}
            </button>
          </div>

          {apiStatus && (
            <div
              className={`p-3.5 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                apiStatus.success
                  ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
                  : 'bg-red-500/10 text-red-600 border border-red-500/20'
              }`}
            >
              {apiStatus.success ? <FiCheckCircle /> : <FiXCircle />}
              {apiStatus.message}
            </div>
          )}

          <div className="space-y-3 text-xs">
            <div className="flex justify-between items-center p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50">
              <span className="font-semibold text-gray-700 dark:text-gray-300">Registration Service:</span>
              <code className="text-primary font-mono">POST /employees/request-role</code>
            </div>
            <div className="flex justify-between items-center p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50">
              <span className="font-semibold text-gray-700 dark:text-gray-300">Orders Service:</span>
              <code className="text-primary font-mono">GET /orders, PATCH /orders/:id/status</code>
            </div>
            <div className="flex justify-between items-center p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50">
              <span className="font-semibold text-gray-700 dark:text-gray-300">Analytics Service:</span>
              <code className="text-primary font-mono">GET /analytics/dashboard, GET /analytics/sales</code>
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all"
        >
          <FiSave />
          Save Changes
        </button>
      </form>
    </div>
  );
}
