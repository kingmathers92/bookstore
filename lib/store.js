import { create } from "zustand";
import { supabase } from "./supabase";

export const useStore = create((set, get) => ({
  cart: [],
  wishlist: [],
  user: null,
  searchHistory: [],
  language: "ar",
  searchQuery: "",
  isTyping: false,
  category: "all",
  priceRange: [0, 1000],

  setUser: async (user) => {
    const currentCart = get().cart;

    set({ user });

    if (user?.id) {
      await Promise.all([get().loadCartFromSupabase(), get().loadWishlistFromSupabase()]);

      if (currentCart.length > 0) {
        await get().syncCartToSupabase(currentCart);
      }
    } else {
      set({ wishlist: [], searchHistory: [] });
    }
  },

  logout: async () => {
    await supabase.auth.signOut();
    set({ user: null, wishlist: [], searchHistory: [] });
    localStorage.removeItem("cart");
    set({ cart: [] });
  },

  addToCart: async (book, qty = 1) => {
    const { user, cart } = get();
    const item = {
      book_id: book.book_id,
      title: book.title_ar || book.title_en,
      image: book.image,
      price: book.price,
      quantity: qty,
    };

    const existing = cart.find((i) => i.book_id === item.book_id);
    const updated = existing
      ? cart.map((i) => (i.book_id === item.book_id ? { ...i, quantity: i.quantity + qty } : i))
      : [...cart, item];

    set({ cart: updated });
    localStorage.setItem("cart", JSON.stringify(updated));

    if (user?.id) {
      await get().syncCartToSupabase(updated);
    }
  },

  removeFromCart: async (bookId) => {
    const { cart, user } = get();
    const updated = cart.filter((i) => i.book_id !== bookId);
    set({ cart: updated });
    localStorage.setItem("cart", JSON.stringify(updated));

    if (user?.id) {
      await get().syncCartToSupabase(updated);
    }
  },

  syncCartToSupabase: async (items) => {
    const { user } = get();
    if (!user?.id) return;

    const { data: existing } = await supabase.from("carts").select("id").eq("user_id", user.id);

    if (existing?.length > 0) {
      await supabase.from("carts").update({ items }).eq("id", existing[0].id);
    } else {
      await supabase.from("carts").insert({ user_id: user.id, items });
    }
  },

  syncCartFromLocalStorage: () => {
    if (typeof window === "undefined") return;
    const raw = localStorage.getItem("cart");
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw);
      const valid = Array.isArray(parsed)
        ? parsed.filter((i) => i.book_id && typeof i.book_id === "string")
        : [];
      set({ cart: valid });
    } catch (e) {
      console.error("Failed to parse cart", e);
      localStorage.removeItem("cart");
    }
  },

  loadCartFromSupabase: async () => {
    const { user, cart: localCart } = get();
    if (!user?.id) return;

    const { data, error } = await supabase.from("carts").select("items").eq("user_id", user.id);

    if (error && error.code !== "PGRST116") return;
    const serverItems = data?.[0]?.items || [];
    const merged = serverItems.map((s) => {
      const l = localCart.find((i) => i.book_id === s.book_id);
      return l ? { ...s, quantity: l.quantity } : s;
    });
    const final = [
      ...merged,
      ...localCart.filter((l) => !serverItems.some((s) => s.book_id === l.book_id)),
    ];

    set({ cart: final });
    localStorage.setItem("cart", JSON.stringify(final));
  },

  addToWishlist: async (bookId, options = {}) => {
    let { user, wishlist } = get();

    if (!user?.id) {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      user = session?.user;
      if (!user?.id) return { success: false, error: "Please log in" };
    }

    if (wishlist.some((i) => i.book_id === bookId)) {
      return { success: false, error: "Already in wishlist" };
    }

    const newItem = { book_id: bookId, ...options };
    const updated = [...wishlist, newItem];
    set({ wishlist: updated });

    try {
      await supabase.from("wishlist").insert({
        user_id: user.id,
        book_id: bookId,
        notify_price_drop: options.notify_price_drop || false,
        notify_stock_available: options.notify_stock_available || false,
        notify_email: options.notify_email || false,
        notify_in_app: options.notify_in_app || false,
      });
      return { success: true };
    } catch (error) {
      console.error("Failed to add to wishlist:", error);
      set({ wishlist });
      return { success: false, error: "Failed to save" };
    }
  },

  removeFromWishlist: async (bookId) => {
    const { user, wishlist } = get();
    if (!user?.id) return { success: false, error: "Not logged in" };

    const updated = wishlist.filter((i) => i.book_id !== bookId);
    set({ wishlist: updated });

    try {
      const { error } = await supabase
        .from("wishlist")
        .delete()
        .eq("user_id", user.id)
        .eq("book_id", bookId);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error("Remove failed:", error);
      set({ wishlist: get().wishlist });
      return { success: false, error: "Failed to remove" };
    }
  },

  loadWishlistFromSupabase: async () => {
    const { user } = get();
    if (!user?.id) return;

    const { data, error } = await supabase
      .from("wishlist")
      .select("book_id, notify_price_drop, notify_stock_available, notify_email, notify_in_app")
      .eq("user_id", user.id);

    if (error) {
      console.error("Wishlist load error:", error);
      return;
    }

    set({ wishlist: data || [] });
  },

  setSearchQuery: async (query) => {
    const { user } = get();
    set({ searchQuery: query, isTyping: true });
    setTimeout(() => set({ isTyping: false }), 1000);

    if (user?.id && query.trim()) {
      await supabase.from("search_history").insert({
        user_id: user.id,
        query,
      });
      get().loadSearchHistoryFromSupabase();
    }
  },

  loadSearchHistoryFromSupabase: async () => {
    const { user } = get();
    if (!user?.id) return;

    const { data } = await supabase
      .from("search_history")
      .select("query")
      .eq("user_id", user.id)
      .order("timestamp", { ascending: false })
      .limit(10);

    set({ searchHistory: data?.map((d) => d.query) || [] });
  },

  setPriceRange: (range) => set({ priceRange: range }),
  setCategory: (cat) => set({ category: cat }),

  checkout: async (total) => {
    const { user, cart } = get();
    if (!user?.id || cart.length === 0) return;

    const { error } = await supabase.from("orders").insert({
      user_id: user.id,
      items: cart,
      total_amount: total,
    });

    if (error) throw error;

    set({ cart: [] });
    localStorage.removeItem("cart");
    await supabase.from("carts").delete().eq("user_id", user.id);
  },

  setLanguage: (lang) => set({ language: lang }),
}));
