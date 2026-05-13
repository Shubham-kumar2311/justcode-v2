import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { ProtectedRoute } from '../components/ProtectedRoute';

// Lazy load pages for better performance
const LandingPage = React.lazy(() => import('../pages/LandingPage'));
const LoginPage = React.lazy(() => import('../features/auth/pages/LoginPage'));
const SignupPage = React.lazy(() => import('../features/auth/pages/SignupPage'));
const ProblemsPage = React.lazy(() => import('../features/problems/pages/ProblemsPage'));
const ProblemDetailPage = React.lazy(() => import('../features/problems/pages/ProblemDetailPage'));
const ProfilePage = React.lazy(() => import('../features/users/pages/ProfilePage'));

// Placeholder components until pages are built
const Placeholder = ({ name }: { name: string }) => (
  <div className="container animate-fade-in" style={{ paddingTop: '4rem', textAlign: 'center' }}>
    <h1 className="gradient-text">{name} Page</h1>
    <p style={{ color: 'var(--text-secondary)', marginTop: '1rem' }}>Coming soon in Phase 3</p>
  </div>
);

export const AppRouter: React.FC = () => {
  return (
    <React.Suspense fallback={<div className="flex-center" style={{ minHeight: '100vh' }}>Loading...</div>}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<LandingPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="signup" element={<SignupPage />} />
          <Route path="problems" element={<ProblemsPage />} />
          <Route 
            path="problems/:id" 
            element={
              <ProtectedRoute>
                <ProblemDetailPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="profile" 
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            } 
          />
        </Route>
      </Routes>
    </React.Suspense>
  );
};
