import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../modules/auth/pages/LoginPage';
import RegisterPage from '../modules/auth/pages/RegisterPage';
import ProfilePage from '../modules/dashboard/pages/ProfilePage';
import { ErrorBoundary } from '../modules/dashboard/pages/ErrorBoundary';
import ProtectedRoute from '../shared/components/ProtectedRoute';
import ResetPasswordPage from '../modules/auth/pages/ResetPasswordPage';
import KitchenDashboard from '../modules/kitchen/pages/KitchenDashboard';

import DeliveryDashboard from '../modules/delivery/pages/DeliveryDashboard';
import OrderAcceptancePage from '../modules/delivery/pages/OrderAcceptancePage';
import OutForDeliveryPage from '../modules/delivery/pages/OutForDeliveryPage';

// Customer Provider & Layout Imports
import { CustomerLayout } from '../modules/home/components/layout/CustomerLayout.jsx';

// Customer Pages Imports
import { HomePage } from '../modules/home/pages/HomePage.jsx';
import { MenuPage } from '../modules/home/pages/MenuPage.jsx';
import { CategoriesPage } from '../modules/home/pages/CategoriesPage.jsx';
import { OffersPage } from '../modules/home/pages/OffersPage.jsx';
import { ProductDetailPage } from '../modules/home/pages/ProductDetailPage.jsx';
import { CartPage } from '../modules/home/pages/CartPage.jsx';
import { CheckoutPage } from '../modules/home/pages/CheckoutPage.jsx';
import { OrderConfirmationPage } from '../modules/home/pages/OrderConfirmationPage.jsx';
import { OrderHistoryPage } from '../modules/home/pages/OrderHistoryPage.jsx';
import { OrderDetailPage } from '../modules/home/pages/OrderDetailPage.jsx';
import { OrderTrackingPage } from '../modules/home/pages/OrderTrackingPage.jsx';
import { AddressManagementPage } from '../modules/home/pages/AddressManagementPage.jsx';

// ─── Admin Panel Imports ──────────────────────────────────────────────────────
import AdminLayout from '../modules/admin/layouts/AdminLayout';
import AdminDashboard from '../modules/admin/pages/Dashboard/Dashboard';
import AdminOrders from '../modules/admin/pages/Orders/Orders';
import AdminMenu from '../modules/admin/pages/Menu/Menu';
import AdminCustomers from '../modules/admin/pages/Customers/Customers';
import AdminEmployees from '../modules/admin/pages/Employees/Employees';
import AdminAnalytics from '../modules/admin/pages/Analytics/Analytics';
import AdminSettings from '../modules/admin/pages/Settings/Settings';
import AdminProfile from '../modules/admin/pages/Profile/Profile';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Customer Routes */}
      <Route
        element={
          <ProtectedRoute allowedRoles={['customer', 'admin']}>
            <CustomerLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<HomePage />} />
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/categories" element={<CategoriesPage />} />
        <Route path="/offers" element={<OffersPage />} />
        <Route path="/product/:id" element={<ProductDetailPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/order-confirmation/:orderId" element={<OrderConfirmationPage />} />
        <Route path="/orders" element={<OrderHistoryPage />} />
        <Route path="/orders/:orderId" element={<OrderDetailPage />} />
        <Route path="/orders/:orderId/track" element={<OrderTrackingPage />} />
        <Route path="/addresses" element={<AddressManagementPage />} />
      </Route>

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ErrorBoundary>
              <ProfilePage />
            </ErrorBoundary>
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile/reset-password"
        element={
          <ProtectedRoute>
            <ResetPasswordPage />
          </ProtectedRoute>
        }
      />

      {/* Kitchen Routes */}
      <Route
        path="/kitchen"
        element={
          <ProtectedRoute allowedRoles={['cook']}>
            <KitchenDashboard />
          </ProtectedRoute>
        }
      />

      {/* Delivery Routes */}
      <Route 
        path="/delivery" 
        element={
          <ProtectedRoute allowedRoles={['delivery']}>
            <DeliveryDashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/delivery/accept-order/:orderId" 
        element={
          <ProtectedRoute allowedRoles={['delivery']}>
            <OrderAcceptancePage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/delivery/out-for-delivery/:orderId" 
        element={
          <ProtectedRoute allowedRoles={['delivery']}>
            <OutForDeliveryPage />
          </ProtectedRoute>
        } 
      />

      {/* ─── Admin Panel Routes ──────────────────────────────────────────── */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="menu" element={<AdminMenu />} />
        <Route path="customers" element={<AdminCustomers />} />
        <Route path="employees" element={<AdminEmployees />} />
        <Route path="analytics" element={<AdminAnalytics />} />
        <Route path="settings" element={<AdminSettings />} />
        <Route path="profile" element={<AdminProfile />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
