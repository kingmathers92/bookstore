import { create } from "zustand";
import { supabase } from "./supabase";

export const useStore = create((set, get) => ({
  cart: [],
  user: null,
  searchQuery: "",
  category: "all",
  priceRange: [0, 100],
  setUser: (user) => set({ user }),
  addToCart: async (book) => {
    const { user } = get();
    if (!user?.id) {
      alert("يرجى تسجيل الدخول أولاً");
      return;
    }

    const { data, error } = await supabase
      .from("carts")
      .select("*")
      .eq("user_id", user.id)
      .eq("book_id", book.id)
      .single();

    if (error && error.code !== "PGRST116") {
      console.error("Error checking cart:", error);
      return;
    }

    if (data) {
      const { error: updateError } = await supabase
        .from("carts")
        .update({ quantity: data.quantity + 1 })
        .eq("id", data.id);
      if (updateError) console.error("Error updating cart:", updateError);
    } else {
      const { error: insertError } = await supabase
        .from("carts")
        .insert({ user_id: user.id, book_id: book.id, quantity: 1 });
      if (insertError) console.error("Error adding to cart:", insertError);
    }

    set((state) => {
      const existingCart = state.cart.find((item) => item.id === book.id);
      if (existingCart) {
        return {
          cart: state.cart.map((item) =>
            item.id === book.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
      }
      return { cart: [...state.cart, { ...book, quantity: 1 }] };
    });

    await syncCartWithSupabase();
  },
  removeFromCart: async (bookId) => {
    const { user } = get();
    if (!user?.id) return;

    const { error } = await supabase
      .from("carts")
      .delete()
      .eq("user_id", user.id)
      .eq("book_id", bookId);
    if (error) console.error("Error removing from cart:", error);

    set((state) => ({ cart: state.cart.filter((item) => item.id !== bookId) }));
  },
  syncCartWithSupabase: async () => {
    const { user, cart } = get();
    if (!user?.id) return;

    const { data } = await supabase
      .from("carts")
      .select("*")
      .eq("user_id", user.id);
    if (data) {
      const updatedCart = data.map((item) => {
        const book = cart.find((b) => b.id === item.book_id);
        return { ...book, quantity: item.quantity, id: item.book_id };
      });
      set({ cart: updatedCart });
    }
  },
  setSearchQuery: (query) => set({ searchQuery: query }),
  setCategory: (cat) => set({ category: cat }),
  setPriceRange: (range) => set({ priceRange: range }),
}));
