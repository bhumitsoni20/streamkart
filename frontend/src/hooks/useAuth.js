import { useEffect } from 'react';
import useAuthStore from '../store/authStore';
import { onAuthChange, getIdToken } from '../firebase/auth';
import { loginUser } from '../services/auth.service';

const useAuth = () => {
  const { user, isAuthenticated, loading, setUser, setToken, setLoading, logout } = useAuthStore();

  useEffect(() => {
    // Instant loading if we already have cached user data
    if (useAuthStore.getState().user) {
      setLoading(false);
    }

    const unsubscribe = onAuthChange(async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const token = await getIdToken();
          setToken(token);
          
          // Fetch updated user data (silently in background if already cached)
          const response = await loginUser();
          setUser(response.data);
        } catch (error) {
          console.error('Auth sync error:', error);
          setLoading(false); // Stop loading if background sync fails
        }
      } else {
        logout(); // Only logout if Firebase says we are definitely not logged in
      }
    });

    return () => unsubscribe();
  }, [setUser, setToken, setLoading, logout]);

  return { user, isAuthenticated, loading };
};

export default useAuth;
