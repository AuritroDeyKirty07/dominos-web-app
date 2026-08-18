import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../modules/auth/pages/LoginPage';
import RegisterPage from '../modules/auth/pages/RegisterPage';
import ProfilePage from '../modules/dashboard/pages/ProfilePage';
import ProtectedRoute from '../shared/components/ProtectedRoute';
import ResetPasswordPage from '../modules/auth/pages/ResetPasswordPage';
import KitchenDashboard from '../modules/kitchen/pages/KitchenDashboard';

import DeliveryDashboard from '../modules/delivery/pages/DeliveryDashboard';
import OrderAcceptancePage from '../modules/delivery/pages/OrderAcceptancePage';
import OutForDeliveryPage from '../modules/delivery/pages/OutForDeliveryPage';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProfilePage />
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
        path="/delivery/accept-order" 
        element={
          <ProtectedRoute allowedRoles={['delivery']}>
            <OrderAcceptancePage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/delivery/out-for-delivery" 
        element={
          <ProtectedRoute allowedRoles={['delivery']}>
            <OutForDeliveryPage />
          </ProtectedRoute>
        } 
      />
    </Routes>
  );
}
