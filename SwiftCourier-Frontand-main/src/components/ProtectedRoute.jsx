import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const ProtectedRoute = ({ allowedRoles }) => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="loading loading-spinner loading-lg text-emerald-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    // Redirect to user's permitted dashboard
    if (user?.role === 'admin') return <Navigate to="/admin/dashboard" replace />;
    if (user?.role === 'agent') return <Navigate to="/agent/dashboard" replace />;
    return <Navigate to="/customer/dashboard" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
