import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useWishlistStore = create(
  persist(
    (set, get) => ({
      items: [],

      toggleItem: (product) => {
        const items = get().items;
        const exists = items.find((item) => item._id === product._id);
        if (exists) {
          set({ items: items.filter((item) => item._id !== product._id) });
        } else {
          set({ items: [...items, product] });
        }
      },

      removeItem: (productId) => {
        set({ items: get().items.filter((item) => item._id !== productId) });
      },

      clearWishlist: () => set({ items: [] }),

      isInWishlist: (productId) => {
        return get().items.some((item) => item._id === productId);
      },
    }),
    {
      name: 'wishlist-storage',
    }
  )
);

export default useWishlistStore;
