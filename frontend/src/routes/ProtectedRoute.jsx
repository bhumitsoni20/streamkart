import { Navigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import Spinner from '../components/ui/Spinner';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuthStore();

  if (loading) return <Spinner fullScreen />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return children;
};

export default ProtectedRoute;
