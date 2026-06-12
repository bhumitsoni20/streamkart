import { Navigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import Spinner from '../components/ui/Spinner';
import { auth } from '../firebase/config';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuthStore();

  if (loading) return <Spinner fullScreen />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  
  if (auth.currentUser && !auth.currentUser.emailVerified) {
    return <Navigate to="/verify-email" replace />;
  }

  return children;
};

export default ProtectedRoute;
