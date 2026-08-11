import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../modules/auth/pages/LoginPage';
import RegisterPage from '../modules/auth/pages/RegisterPage';
import ProfilePage from '../modules/dashboard/pages/ProfilePage';
import ProtectedRoute from '../shared/components/ProtectedRoute';
import ResetPasswordPage from '../modules/auth/pages/ResetPasswordPage';
import KitchenDashboard from '../modules/kitchen/pages/KitchenDashboard';

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
      <Route 
        path="/kitchen" 
        element={
          <ProtectedRoute allowedRoles={['cook']}>
            <KitchenDashboard />
          </ProtectedRoute>
        } 
      />
    </Routes>
  );
}
