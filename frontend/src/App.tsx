import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '@contexts/AuthContext';
import { ToastProvider } from '@components/ui/ToastContainer';
import AppLayout from '@layouts/AppLayout';
import DashboardPage from '@pages/dashboard';
import CampaignsPage from '@pages/CampaignsPage';
import TemplateGalleryPage from '@pages/templates';
import TemplateEditorPage from '@pages/templates/EditorPage';
import SettingsPage from '@pages/SettingsPage';
import LoginPage from '@pages/LoginPage';
import RegisterPage from '@pages/RegisterPage';

const Protected: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-950">
        <div className="text-center">
          <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center mx-auto mb-4 animate-pulse">
            <span className="text-white text-xl">✨</span>
          </div>
          <p className="text-neutral-600 dark:text-neutral-400">Loading your workspace...</p>
        </div>
      </div>
    );
  }
  
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

export const App: React.FC = () => {
  return (
    <ToastProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/" element={<Protected><AppLayout /></Protected>}>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="campaigns" element={<CampaignsPage />} />
              <Route path="templates" element={<TemplateGalleryPage />} />
              <Route path="templates/:templateId" element={<TemplateEditorPage />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ToastProvider>
  );
};

export default App;