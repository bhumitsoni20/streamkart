import { create } from 'zustand';

const useAuthStore = create((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
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
}));

export default useAuthStore;
