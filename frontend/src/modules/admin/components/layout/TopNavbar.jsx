// src/components/layout/TopNavbar.jsx
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiSearch,
  FiMoon,
  FiSun,
  FiBell,
  FiUser,
  FiMenu,
  FiUsers,
  FiTruck,
  FiChevronRight,
} from 'react-icons/fi';
import { GiChefToque } from 'react-icons/gi';
import useTheme from '../../hooks/useTheme';
import { mockNotifications } from '../../shared/config/mockData';

export default function TopNavbar() {
  const { isDark, toggle } = useTheme();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const notifRef = useRef(null);
  const profileRef = useRef(null);

  const unreadCount = mockNotifications.filter((n) => !n.read).length;

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotifications(false);
      if (profileRef.current && !profileRef.current.contains(e.target)) setShowProfile(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleProfileSelect = (tab) => {
    setShowProfile(false);
    navigate(`/profile?tab=${tab}`);
  };

  return (
    <header className="h-16 bg-white dark:bg-surface-darker border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-4 lg:px-6">
      {/* Left: Mobile menu + Search */}
      <div className="flex items-center gap-4">
        <button className="md:hidden text-gray-600 dark:text-gray-300">
          <FiMenu className="text-xl" />
        </button>
        <div className="relative hidden sm:block">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search orders, customers, staff..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 w-64 lg:w-80 rounded-lg bg-gray-100 dark:bg-gray-800 text-sm text-gray-700 dark:text-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
          />
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-3">
        {/* Dark mode toggle */}
        <button
          onClick={toggle}
          className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {isDark ? <FiSun className="text-xl" /> : <FiMoon className="text-xl" />}
        </button>

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotifications((p) => !p)}
            className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors relative"
          >
            <FiBell className="text-xl" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-primary text-white text-xs rounded-full flex items-center justify-center animate-pulse-glow">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 z-50 animate-fade-in">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="font-semibold text-gray-800 dark:text-white">Notifications</h3>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {mockNotifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`p-4 border-b border-gray-100 dark:border-gray-700 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
                      !notif.read ? 'bg-primary/5 dark:bg-primary/10' : ''
                    }`}
                  >
                    <p className="text-sm font-medium text-gray-800 dark:text-white">{notif.title}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{notif.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Profile Button & 3-Option Dropdown (User, Delivery, Cook) */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setShowProfile((p) => !p)}
            className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all border border-transparent hover:border-gray-200 dark:hover:border-gray-700"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-sm">
              <FiUser className="text-white text-sm" />
            </div>
            <div className="hidden lg:block text-left">
              <span className="block text-xs font-bold text-gray-800 dark:text-white leading-tight">
                Admin Panel
              </span>
              <span className="block text-[10px] text-gray-400">Profile & Roles</span>
            </div>
          </button>

          {showProfile && (
            <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 z-50 animate-fade-in overflow-hidden">
              {/* Header */}
              <div className="p-4 bg-gradient-to-br from-gray-50 to-gray-100/50 dark:from-gray-800 dark:to-gray-800/80 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center font-bold text-base shadow-sm">
                    A
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900 dark:text-white">Store Admin</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">admin@dominos.com</p>
                  </div>
                </div>
                <div className="mt-3 inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  ● Store Manager Access
                </div>
              </div>

              {/* 3 Main Profile Role Options */}
              <div className="p-2 space-y-1">
                <p className="px-3 pt-2 pb-1 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                  Select Profile Category
                </p>

                {/* Option 1: User */}
                <button
                  onClick={() => handleProfileSelect('user')}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700/60 transition-colors group text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-base group-hover:scale-105 transition-transform">
                      <FiUsers />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-800 dark:text-white">User Profiles</p>
                      <p className="text-[11px] text-gray-400">Customers & account details</p>
                    </div>
                  </div>
                  <FiChevronRight className="text-gray-400 group-hover:text-primary transition-colors text-sm" />
                </button>

                {/* Option 2: Delivery */}
                <button
                  onClick={() => handleProfileSelect('delivery')}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700/60 transition-colors group text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center text-base group-hover:scale-105 transition-transform">
                      <FiTruck />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-800 dark:text-white">Delivery Fleet</p>
                      <p className="text-[11px] text-gray-400">Drivers & vehicle records</p>
                    </div>
                  </div>
                  <FiChevronRight className="text-gray-400 group-hover:text-blue-500 transition-colors text-sm" />
                </button>

                {/* Option 3: Cook */}
                <button
                  onClick={() => handleProfileSelect('cook')}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700/60 transition-colors group text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center text-base group-hover:scale-105 transition-transform">
                      <GiChefToque />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-800 dark:text-white">Kitchen Cooks</p>
                      <p className="text-[11px] text-gray-400">Chefs, prep & shift details</p>
                    </div>
                  </div>
                  <FiChevronRight className="text-gray-400 group-hover:text-amber-500 transition-colors text-sm" />
                </button>
              </div>

              {/* Bottom Quick Links */}
              <div className="p-2 border-t border-gray-100 dark:border-gray-700/60 bg-gray-50/50 dark:bg-gray-800/50">
                <button
                  onClick={() => handleProfileSelect('user')}
                  className="w-full text-center py-1.5 text-xs font-bold text-primary hover:underline"
                >
                  Open Full Profile Hub →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
