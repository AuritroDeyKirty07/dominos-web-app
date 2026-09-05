// Admin Layout — wraps all admin pages with Sidebar + TopNavbar
import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '../components/layout/AdminSidebar';
import AdminTopNavbar from '../components/layout/AdminTopNavbar';
import { AdminProvider } from '../context/AdminContext';
import '../styles/admin.css';

export default function AdminLayout() {
  return (
    <AdminProvider>
      <div className="admin-root flex h-screen bg-gray-50 dark:bg-slate-900">
        <AdminSidebar />
        <div className="flex flex-col flex-1 overflow-hidden">
          <AdminTopNavbar />
          <main className="flex-1 overflow-auto p-4 lg:p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </AdminProvider>
  );
}
