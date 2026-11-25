import { Navigate, Outlet } from 'react-router-dom';
import { useAuthContext } from '../context/AuthProvider';

const ProtectedRoute = ({ allowedRoles }) => {
  const { isAuthenticated, user } = useAuthContext();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
