import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '@contexts/AuthContext';
import AppLayout from '@layouts/AppLayout';
import DashboardPage from '@pages/dashboard';
import CampaignsPage from '@pages/CampaignsPage';
import TemplateGalleryPage from '@pages/templates';
import TemplateEditorPage from '@pages/templates/EditorPage';
import SettingsPage from '@pages/SettingsPage';
import LoginPage from '@pages/LoginPage';
import RegisterPage from '@pages/RegisterPage';
import { Toaster } from 'react-hot-toast';

const Protected: React.FC<{children: React.ReactNode}> = ({children}) => {
  const { user, loading } = useAuth();
  if(loading) return <div className="p-8">Loading...</div>;
  if(!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

export const App: React.FC = () => {
  return (
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
      <Toaster position="top-right" />
    </AuthProvider>
  );
};

export default App;
