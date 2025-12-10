import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CompanySetup from './pages/CompanySetup';
import NotFound from './pages/NotFound';
import ForgotPassword from './pages/ForgotPassword';
import EmailVerified from './pages/EmailVerified'; // ✅ NEW

// Utils
import { setUser } from './store/slices/authSlice';
import Cookies from 'js-cookie';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// Public Route Component (redirect if authenticated)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  
  if (isAuthenticated) {
    // Check if company setup is complete
    if (!user?.hasCompany) {
      return <Navigate to="/company-setup" replace />;
    }
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
};

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    // Check for existing session
    const token = Cookies.get('token');
    const storedUser = localStorage.getItem('user');
    
    if (token && storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        dispatch(setUser({ user: userData, token }));
      } catch (error) {
        console.error('Failed to restore session:', error);
        Cookies.remove('token');
        localStorage.removeItem('user');
      }
    }
  }, [dispatch]);

  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        }
      />
      <Route
        path="/forgot-password"
        element={
          <PublicRoute>
            <ForgotPassword />
          </PublicRoute>
        }
      />

      {/* ✅ NEW: Email Verification Route (Public) */}
      <Route path="/verify-email" element={<EmailVerified />} />
      <Route path="/email-verified" element={<EmailVerified />} />

      {/* Protected Routes */}
      <Route
        path="/company-setup"
        element={
          <ProtectedRoute>
            <CompanySetup />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/*"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      {/* Redirects */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;