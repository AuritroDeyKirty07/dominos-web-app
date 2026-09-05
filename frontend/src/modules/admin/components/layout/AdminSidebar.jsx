// Admin Sidebar — adapted for integration into main app
// Routes prefixed with /admin/
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  FiHome,
  FiShoppingBag,
  FiUsers,
  FiUserCheck,
  FiBarChart2,
  FiSettings,
  FiChevronLeft,
  FiChevronRight,
  FiUser,
  FiArrowLeft,
} from 'react-icons/fi';
import { GiFullPizza } from 'react-icons/gi';

const navItems = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: FiHome },
  { to: '/admin/orders', label: 'Orders', icon: FiShoppingBag },
  { to: '/admin/menu', label: 'Menu', icon: GiFullPizza },
  { to: '/admin/customers', label: 'Customers', icon: FiUsers },
  { to: '/admin/employees', label: 'Employees', icon: FiUserCheck },
  { to: '/admin/analytics', label: 'Analytics', icon: FiBarChart2 },
  { to: '/admin/settings', label: 'Settings', icon: FiSettings },
];

export default function AdminSidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`${
        collapsed ? 'w-20' : 'w-64'
      } bg-white dark:bg-slate-800 border-r border-gray-200 dark:border-gray-700 hidden md:flex flex-col transition-all duration-300 ease-in-out`}
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-center border-b border-gray-200 dark:border-gray-700 px-4">
        <GiFullPizza className="text-red-600 text-3xl flex-shrink-0" />
        {!collapsed && (
          <span className="ml-3 text-lg font-bold text-gray-800 dark:text-white whitespace-nowrap">
            Dominos Admin
          </span>
        )}
      </div>

      {/* Navigation links */}
      <nav className="flex-1 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center mx-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group ${
                  isActive
                    ? 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                }`
              }
            >
              <Icon className="text-xl flex-shrink-0" />
              {!collapsed && <span className="ml-3">{item.label}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* Back to main site link */}
      <NavLink
        to="/"
        className="mx-3 mb-2 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white transition-all duration-200 flex items-center"
      >
        <FiArrowLeft className="text-xl flex-shrink-0" />
        {!collapsed && <span className="ml-3">Back to Site</span>}
      </NavLink>

      {/* Collapse button */}
      <button
        onClick={() => setCollapsed((p) => !p)}
        className="h-12 flex items-center justify-center border-t border-gray-200 dark:border-gray-700 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
      >
        {collapsed ? <FiChevronRight className="text-xl" /> : <FiChevronLeft className="text-xl" />}
      </button>
    </aside>
  );
}
