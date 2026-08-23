import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from '../shared/components/layout/AdminLayout';
import RoleGuard from '../shared/components/rbac/RoleGuard';

// Lazy loading admin modules for performance
const Dashboard = lazy(() => import('../dashboard'));
const Products = lazy(() => import('../products'));
const Categories = lazy(() => import('../categories'));
const Orders = lazy(() => import('../orders'));
const Inventory = lazy(() => import('../inventory'));
const Customers = lazy(() => import('../customers'));
const Coupons = lazy(() => import('../coupons'));
const Reports = lazy(() => import('../reports'));
const Settings = lazy(() => import('../settings'));
const Roles = lazy(() => import('../roles'));

// Placeholder for unauthorized fallback
const UnauthorizedFallback = () => (
  <div className="flex flex-col items-center justify-center h-full">
    <h2 className="text-2xl font-bold text-gray-800">Access Denied</h2>
    <p className="text-gray-500 mt-2">You do not have permission to view this page.</p>
  </div>
);

// Loading fallback
const LoadingFallback = () => (
  <div className="flex items-center justify-center h-full p-8">
    <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
  </div>
);

export default function AdminRoutes() {
  return (
    <RoleGuard allowedRoles={['ADMIN', 'SUPER_ADMIN']} fallback={<Navigate to="/unauthorized" replace />}>
      <Routes>
        <Route element={<AdminLayout />}>
          <Route index element={
            <Suspense fallback={<LoadingFallback />}>
              <Dashboard />
            </Suspense>
          } />
          
          <Route path="products" element={
            <Suspense fallback={<LoadingFallback />}>
              <Products />
            </Suspense>
          } />
          
          <Route path="categories" element={
            <Suspense fallback={<LoadingFallback />}>
              <Categories />
            </Suspense>
          } />

          <Route path="orders" element={
            <Suspense fallback={<LoadingFallback />}>
              <Orders />
            </Suspense>
          } />

          <Route path="inventory" element={
            <Suspense fallback={<LoadingFallback />}>
              <Inventory />
            </Suspense>
          } />

          <Route path="customers" element={
            <Suspense fallback={<LoadingFallback />}>
              <Customers />
            </Suspense>
          } />

          <Route path="coupons" element={
            <Suspense fallback={<LoadingFallback />}>
              <Coupons />
            </Suspense>
          } />

          <Route path="reports" element={
            <RoleGuard allowedRoles={['SUPER_ADMIN']} fallback={<UnauthorizedFallback />}>
              <Suspense fallback={<LoadingFallback />}>
                <Reports />
              </Suspense>
            </RoleGuard>
          } />

          <Route path="settings" element={
            <RoleGuard allowedRoles={['SUPER_ADMIN']} fallback={<UnauthorizedFallback />}>
              <Suspense fallback={<LoadingFallback />}>
                <Settings />
              </Suspense>
            </RoleGuard>
          } />

          <Route path="roles" element={
            <RoleGuard allowedRoles={['SUPER_ADMIN']} fallback={<UnauthorizedFallback />}>
              <Suspense fallback={<LoadingFallback />}>
                <Roles />
              </Suspense>
            </RoleGuard>
          } />

          {/* Fallback for unknown admin routes */}
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Route>
      </Routes>
    </RoleGuard>
  );
}
