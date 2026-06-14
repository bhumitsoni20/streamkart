import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      // If we have persisted state, don't show full loading screen initially
      loading: true, 

      setUser: (user) =>
        set({
          user,
          isAuthenticated: !!user,
          loading: false,
        }),

      setToken: (token) => set({ token }),

      setLoading: (loading) => set({ loading }),

      logout: () =>
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          loading: false,
        }),
    }),
    {
      name: 'auth-storage',
      // Only persist user, token, and auth state. Do not persist 'loading' state.
      partialize: (state) => ({ 
        user: state.user, 
        token: state.token, 
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
);

export default useAuthStore;
