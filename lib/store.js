import { create } from "zustand";

export const useStore = create((set) => ({
  searchQuery: "",
  category: "all",
  priceRange: [0, 100],
  cart: [],
  user: null,
  setSearchQuery: (query) => set({ searchQuery: query }),
  setCategory: (category) => set({ category }),
  setPriceRange: (range) => set({ priceRange: range }),
  addToCart: (book) => set((state) => ({ cart: [...state.cart, book] })),
  removeFromCart: (id) =>
    set((state) => ({ cart: state.cart.filter((item) => item.id !== id) })),
  setUser: (user) => set({ user }),
  logout: () => set({ user: null }),
}));
