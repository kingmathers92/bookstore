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
    console.log("Book added to cart:", book);
    const { user, cart } = get();
    const item = {
      book_id: book.book_id,
      title_ar: book.title_ar || book.title_en || "",
      title_en: book.title_en || book.title_ar || "",
      author_ar: book.author_ar || book.author_en || "",
      author_en: book.author_en || book.author_ar || "",
      publishing_house_ar: book.publishing_house_ar || book.publishing_house_en || "",
      publishing_house_en: book.publishing_house_en || book.publishing_house_ar || "",
      image: book.image,
      price: book.price,
      quantity: qty,
    };

    // Add or update existing cart item
    const existingItem = cart.find((i) => i.book_id === book.book_id);
    if (existingItem) {
      set({
        cart: cart.map((i) =>
          i.book_id === book.book_id ? { ...i, quantity: i.quantity + qty } : i,
        ),
      });
    } else {
      set({ cart: [...cart, item] });
    }

    localStorage.setItem("cart", JSON.stringify(get().cart));
  },

  updateQuantity: async (bookId, newQty) => {
    const { cart, user } = get();
    if (newQty <= 0) {
      const updated = cart.filter((i) => i.book_id !== bookId);
      set({ cart: updated });
      localStorage.setItem("cart", JSON.stringify(updated));
      if (user?.id) await get().syncCartToSupabase(updated);
      return;
    }
    const updated = cart.map((i) => (i.book_id === bookId ? { ...i, quantity: newQty } : i));
    set({ cart: updated });
    localStorage.setItem("cart", JSON.stringify(updated));
    if (user?.id) await get().syncCartToSupabase(updated);
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

  clearCart: async () => {
    set({ cart: [] });
    localStorage.removeItem("cart");
    const { user } = get();
    if (user?.id) {
      await supabase.from("carts").delete().eq("user_id", user.id);
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
        ? parsed
            .filter((i) => i.book_id && typeof i.book_id === "string")
            .map((i) => ({
              // normalize shape
              book_id: i.book_id,
              title_ar: i.title_ar ?? i.title ?? i.title_en ?? "",
              title_en: i.title_en ?? i.title ?? i.title_ar ?? "",
              author_ar: i.author_ar ?? i.author ?? i.author_en ?? "",
              author_en: i.author_en ?? i.author ?? i.author_ar ?? "",
              publishing_house_ar:
                i.publishing_house_ar ?? i.publishing_house ?? i.publishing_house_en ?? "",
              publishing_house_en:
                i.publishing_house_en ?? i.publishing_house ?? i.publishing_house_ar ?? "",
              image: i.image ?? "/placeholder.jpg",
              price: Number(i.price) || 0,
              quantity: Number(i.quantity) || 1,
            }))
        : [];
      set({ cart: valid });
      localStorage.setItem("cart", JSON.stringify(valid));
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

  setLanguage: (lang) => set({ language: lang }),
}));
