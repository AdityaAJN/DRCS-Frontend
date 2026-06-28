import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/layout/Navbar';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import CitizenDashboard from './pages/citizen/CitizenDashboard';
import LodgeHelpRequest from './pages/citizen/LodgeHelpRequest';
import VolunteerDashboard from './pages/volunteer/VolunteerDashboard';
import NgoDashboard from './pages/ngo/NgoDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }
  return children;
};

const RoleRedirect = () => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  switch (user.role) {
    case 'ROLE_CITIZEN':
      return <Navigate to="/citizen/dashboard" replace />;
    case 'ROLE_VOLUNTEER':
      return <Navigate to="/volunteer/dashboard" replace />;
    case 'ROLE_NGO':
      return <Navigate to="/ngo/dashboard" replace />;
    case 'ROLE_ADMIN':
      return <Navigate to="/admin/dashboard" replace />;
    default:
      return <Navigate to="/login" replace />;
  }
};

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/" element={<RoleRedirect />} />

              <Route path="/citizen/dashboard" element={<ProtectedRoute allowedRoles={['ROLE_CITIZEN', 'ROLE_ADMIN']}><CitizenDashboard /></ProtectedRoute>} />
              <Route path="/citizen/lodge-request" element={<ProtectedRoute allowedRoles={['ROLE_CITIZEN', 'ROLE_ADMIN']}><LodgeHelpRequest /></ProtectedRoute>} />
              <Route path="/volunteer/dashboard" element={<ProtectedRoute allowedRoles={['ROLE_VOLUNTEER', 'ROLE_ADMIN']}><VolunteerDashboard /></ProtectedRoute>} />
              <Route path="/ngo/dashboard" element={<ProtectedRoute allowedRoles={['ROLE_NGO', 'ROLE_ADMIN']}><NgoDashboard /></ProtectedRoute>} />
              <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={['ROLE_ADMIN']}><AdminDashboard /></ProtectedRoute>} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}