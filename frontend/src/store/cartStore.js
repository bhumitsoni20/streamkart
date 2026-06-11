import { create } from 'zustand';

const useCartStore = create((set, get) => ({
  items: [],

  addItem: (product) => {
    const items = get().items;
    const exists = items.find((item) => item._id === product._id);
    if (!exists) {
      set({ items: [...items, { ...product, quantity: 1 }] });
    }
  },

  removeItem: (productId) => {
    set({ items: get().items.filter((item) => item._id !== productId) });
  },

  clearCart: () => set({ items: [] }),

  getTotal: () => {
    return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
  },

  getItemCount: () => get().items.length,
}));

export default useCartStore;
