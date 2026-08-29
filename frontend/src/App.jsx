import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import AppLayout from './layouts/AppLayout';

const Landing = lazy(() => import('./pages/Landing')),
      Login = lazy(() => import('./pages/Login')),
      Dashboard = lazy(() => import('./pages/Dashboard')),
      Clients = lazy(() => import('./pages/Clients')),
      Audit = lazy(() => import('./pages/AuditLogs'));

function Guard({ children, admin = false }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center">
        Loading secure session…
      </div>
    );
  }
  
  return user && (!admin || user.role === 'admin') ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <Suspense fallback={<div className="p-8">Loading…</div>}>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route element={<Guard><AppLayout /></Guard>}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/clients" element={<Clients />} />
          <Route path="/audit-logs" element={<Guard admin><Audit /></Guard>} />
        </Route>
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Suspense>
  );
}