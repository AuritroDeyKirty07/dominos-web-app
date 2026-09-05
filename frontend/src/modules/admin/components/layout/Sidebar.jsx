// src/components/layout/Sidebar.jsx
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
} from 'react-icons/fi';
import { GiFullPizza } from 'react-icons/gi';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: FiHome },
  { to: '/orders', label: 'Orders', icon: FiShoppingBag },
  { to: '/menu', label: 'Menu', icon: GiFullPizza },
  { to: '/profile', label: 'Profile Hub', icon: FiUser },
  { to: '/customers', label: 'Customers', icon: FiUsers },
  { to: '/employees', label: 'Employees', icon: FiUserCheck },
  { to: '/analytics', label: 'Analytics', icon: FiBarChart2 },
  { to: '/settings', label: 'Settings', icon: FiSettings },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`${
        collapsed ? 'w-20' : 'w-64'
      } bg-white dark:bg-surface-darker border-r border-gray-200 dark:border-gray-700 hidden md:flex flex-col transition-all duration-300 ease-in-out`}
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-center border-b border-gray-200 dark:border-gray-700 px-4">
        <GiFullPizza className="text-primary text-3xl flex-shrink-0" />
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
                    ? 'bg-primary/10 text-primary dark:bg-primary/20'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                }`
              }
            >
              <Icon className="text-xl flex-shrink-0" />
              {!collapsed && <span className="ml-3">{item.label}</span>}
            </NavLink>
          );
        })}
      </nav>

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
