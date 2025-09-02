import { create } from "zustand";

export const useStore = create((set) => ({
  searchQuery: "",
  category: "all",
  priceRange: [0, 100],
  setSearchQuery: (query) => set({ searchQuery: query }),
  setCategory: (category) => set({ category }),
  setPriceRange: (range) => set({ priceRange: range }),
}));
