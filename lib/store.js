import { create } from "zustand";
import { supabase } from "./supabase";

export const useStore = create((set, get) => ({
  cart: [],
  user: null,
  searchQuery: "",
  category: "all",
  language: "ar",
  priceRange: [0, 100],
  searchHistory: [],
  isTyping: false,

  syncCartFromLocalStorage: () => {
    if (typeof window === "undefined") return;
    const raw = localStorage.getItem("cart");
    if (!raw) return;

    let parsed = [];
    try {
      parsed = JSON.parse(raw);
    } catch (e) {
      localStorage.removeItem("cart");
      return;
    }

    const valid = parsed.filter((i) => typeof i.book_id === "string");
    set({ cart: valid });
    localStorage.setItem("cart", JSON.stringify(valid));
  },
  addToCart: async (book) => {
    const { user, cart: currentCart } = get();
    const bookId = book.book_id;
    const qty = book.quantity || 1;

    const cartItem = {
      book_id: bookId,
      title: book.title,
      price: book.price,
      image: book.image,
      quantity: qty,
    };

    if (!user?.id) {
      const existing = currentCart.find((i) => i.book_id === bookId);
      const updated = existing
        ? currentCart.map((i) => (i.book_id === bookId ? { ...i, quantity: i.quantity + qty } : i))
        : [...currentCart, cartItem];

      set({ cart: updated });
      localStorage.setItem("cart", JSON.stringify(updated));
      return;
    }

    try {
      const { data: cartRow, error: fetchErr } = await supabase
        .from("carts")
        .select("id, items")
        .eq("user_id", user.id)
        .single();

      let items = [];
      if (fetchErr && fetchErr.code !== "PGRST116") throw fetchErr;
      if (cartRow) items = cartRow.items || [];

      const idx = items.findIndex((i) => i.book_id === bookId);
      if (idx >= 0) {
        items[idx].quantity += qty;
      } else {
        items.push(cartItem);
      }

      if (cartRow) {
        await supabase.from("carts").update({ items }).eq("id", cartRow.id);
      } else {
        await supabase.from("carts").insert({ user_id: user.id, items: [cartItem] });
      }

      const newLocal =
        idx >= 0
          ? currentCart.map((i) =>
              i.book_id === bookId ? { ...i, quantity: i.quantity + qty } : i,
            )
          : [...currentCart, cartItem];

      set({ cart: newLocal });
    } catch (error) {
      alert(`Error adding to cart: ${error.message}`);
    }
  },
  removeFromCart: async (bookId) => {
    const { user, cart: currentCart } = get();

    const updatedLocal = currentCart.filter((i) => i.book_id !== bookId);
    set({ cart: updatedLocal });
    if (!user?.id) {
      localStorage.setItem("cart", JSON.stringify(updatedLocal));
      return;
    }

    try {
      const { data: cartRow, error } = await supabase
        .from("carts")
        .select("id, items")
        .eq("user_id", user.id)
        .single();

      if (error && error.code !== "PGRST116") throw error;
      if (!cartRow) return;

      const newItems = (cartRow.items || []).filter((i) => i.book_id !== bookId);
      await supabase.from("carts").update({ items: newItems }).eq("id", cartRow.id);
    } catch (error) {
      console.error("Remove error:", error.message);
    }
  },
  syncCartWithSupabase: async () => {
    const { user } = get();
    if (!user?.id) return;

    try {
      const { data, error } = await supabase
        .from("carts")
        .select("items")
        .eq("user_id", user.id)
        .single();

      if (error && error.code !== "PGRST116") throw error;
      set({ cart: data?.items || [] });
    } catch (error) {
      console.error("Sync error:", error.message);
    }
  },

  setUser: async (newUser) => {
    if (!newUser) {
      set({ user: null });
      return;
    }

    // Get the REAL Supabase UUID from user.user_metadata
    const supabaseUserId = newUser.user_metadata?.supabase_id;

    if (!supabaseUserId) {
      console.error("No supabase_id found in user metadata!", newUser);
      return;
    }

    // Save both: original + supabase UUID
    set({
      user: {
        ...newUser,
        supabase_id: supabaseUserId, // this is the UUID we need
      },
    });

    // Sync local cart
    const localCart = JSON.parse(localStorage.getItem("cart") || "[]");
    for (const item of localCart) {
      await get().addToCart(item);
    }
    localStorage.removeItem("cart");

    // Sync from DB
    await get().syncCartWithSupabase();
    await get().loadSearchHistory();
  },

  logout: async () => {
    try {
      await fetch("/api/auth/signout", { method: "POST" });
      set({ user: null, cart: [], searchHistory: [] });
      localStorage.removeItem("cart");
      const user = get().user;
      if (user?.id) {
        await supabase.from("search_history").delete().eq("user_id", user.id);
      }
    } catch (error) {
      console.error("Logout error:", error.message);
    }
  },

  addToWishlist: async ({
    bookId,
    notifyPriceDrop,
    notifyStockAvailable,
    notifyEmail,
    notifyInApp,
  }) => {
    const { user } = get();
    if (!user?.id) {
      alert("Please log in to add to wishlist");
      return;
    }

    try {
      const { error } = await supabase.from("wishlist").insert({
        user_id: user.id,
        book_id: bookId,
        notify_price_drop: notifyPriceDrop,
        notify_stock_available: notifyStockAvailable,
        notify_email: notifyEmail,
        notify_in_app: notifyInApp,
      });

      if (error) throw error;

      alert("Added to wishlist!");

      if ((notifyPriceDrop || notifyStockAvailable) && (notifyEmail || notifyInApp)) {
        const message = notifyPriceDrop ? "Price dropped!" : "Back in stock!";
        await supabase.functions.invoke("send-notification", {
          body: { userId: user?.supabase_id, bookId, notifyEmail, notifyInApp, message },
        });
      }
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  },

  isAdmin: () => {
    const { user } = get();
    return user?.user_metadata?.role === "admin";
  },

  setSearchQuery: (query) => {
    const { user } = get();
    set({ searchQuery: query, isTyping: !!query.trim() });
    if (user?.id && query.trim()) {
      supabase
        .from("search_history")
        .insert({ user_id: user.id, query, timestamp: new Date() })
        .then(({ error }) => {
          if (error) console.error("Search history error:", error);
        });
    }
  },

  setCategory: (cat) => set({ category: cat }),
  setPriceRange: (range) => set({ priceRange: range }),
  setLanguage: (lang) => set({ language: lang }),
  setIsTyping: (val) => set({ isTyping: val }),

  loadSearchHistory: async () => {
    const { user } = get();
    if (!user?.id) return;
    const { data, error } = await supabase
      .from("search_history")
      .select("query")
      .eq("user_id", user.id)
      .order("timestamp", { ascending: false })
      .limit(10);
    if (error) {
      console.error("Load history error:", error);
      return;
    }
    set({ searchHistory: data.map((i) => i.query) });
  },

  submitTestimonial: async (text, rating) => {
    const { user, language } = get();
    const name = user?.user_metadata?.name || "Anonymous";
    const avatar = user?.user_metadata?.avatar_url || null;

    try {
      const { error } = await supabase
        .from("testimonials")
        .insert([{ user_id: user?.id, name, avatar, text, rating }]);

      if (error) throw error;

      const msg = language === "ar" ? "تم إرسال الشهادة!" : "Testimonial sent!";
      if (window.toast) window.toast.success(msg);
      return true;
    } catch (error) {
      const msg = language === "ar" ? `فشل: ${error.message}` : `Failed: ${error.message}`;
      if (window.toast) window.toast.error(msg);
      return false;
    }
  },
}));
