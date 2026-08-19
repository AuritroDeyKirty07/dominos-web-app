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

// Customer Provider & Layout Imports
import { CustomerProvider } from '../modules/home/store/CustomerContext.jsx';
import { CartProvider } from '../modules/home/store/CartContext.jsx';
import { OrderProvider } from '../modules/home/store/OrderContext.jsx';
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

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Customer Routes */}
      <Route
        element={
          <ProtectedRoute allowedRoles={['customer']}>
            <CustomerProvider>
              <CartProvider>
                <OrderProvider>
                  <CustomerLayout />
                </OrderProvider>
              </CartProvider>
            </CustomerProvider>
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
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
