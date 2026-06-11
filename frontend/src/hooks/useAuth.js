import { useEffect } from 'react';
import useAuthStore from '../store/authStore';
import { onAuthChange, getIdToken } from '../firebase/auth';
import { loginUser } from '../services/auth.service';

const useAuth = () => {
  const { user, isAuthenticated, loading, setUser, setToken, setLoading, logout } = useAuthStore();

  useEffect(() => {
    const unsubscribe = onAuthChange(async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const token = await getIdToken();
          setToken(token);
          const response = await loginUser();
          setUser(response.data);
        } catch (error) {
          console.error('Auth sync error:', error);
          setLoading(false);
        }
      } else {
        logout();
      }
    });

    return () => unsubscribe();
  }, []);

  return { user, isAuthenticated, loading };
};

export default useAuth;
