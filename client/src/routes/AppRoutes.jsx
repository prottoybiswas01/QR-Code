import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import { LandingPage } from '../pages/LandingPage';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { ForgotPasswordPage } from '../pages/ForgotPasswordPage';

import { DashboardLayout } from '../layouts/DashboardLayout';
import { DashboardPage } from '../pages/DashboardPage';
import { CreateQRPage } from '../pages/CreateQRPage';
import { EditQRPage } from '../pages/EditQRPage';
import { MyQRCodesPage } from '../pages/MyQRCodesPage';
import { AnalyticsPage } from '../pages/AnalyticsPage';
import { ProfilePage } from '../pages/ProfilePage';
import { SettingsPage } from '../pages/SettingsPage';

import { PublicQRViewPage } from '../pages/PublicQRViewPage';
import { DisabledQRPage } from '../pages/DisabledQRPage';
import { NotFoundPage } from '../pages/NotFoundPage';

import { ProtectedRoute } from './ProtectedRoute';
import { ErrorBoundary } from '../components/common/ErrorBoundary';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Landing & Marketing */}
      <Route
        path="/"
        element={
          <ErrorBoundary title="Landing Page Error">
            <LandingPage />
          </ErrorBoundary>
        }
      />

      {/* Public Authentication */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />

      {/* Public Dynamic QR Viewer Endpoints */}
      <Route path="/view/:slug" element={<PublicQRViewPage />} />
      <Route path="/view/disabled" element={<DisabledQRPage />} />
      <Route path="/view/not-found" element={<NotFoundPage />} />

      {/* Protected Dashboard Routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="create" element={<CreateQRPage />} />
        <Route path="edit/:id" element={<EditQRPage />} />
        <Route path="my-qrs" element={<MyQRCodesPage />} />
        <Route path="analytics" element={<AnalyticsPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>

      {/* Fallback 404 Route */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};
