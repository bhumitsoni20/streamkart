import { Navigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import Spinner from '../components/ui/Spinner';

const RoleRoute = ({ children, roles = [] }) => {
  const { user, isAuthenticated, loading } = useAuthStore();

  if (loading) return <Spinner fullScreen />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (roles.length > 0 && !roles.includes(user?.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default RoleRoute;
