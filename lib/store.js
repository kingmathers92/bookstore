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
    const savedCart = typeof window !== "undefined" ? localStorage.getItem("cart") : null;
    if (savedCart && JSON.parse(savedCart).length > 0) {
      set({ cart: JSON.parse(savedCart) });
    }
  },

  setUser: async (user) => {
    set({ user });
    if (user?.id) {
      const localCart = JSON.parse(localStorage.getItem("cart") || "[]");
      if (localCart.length > 0) {
        try {
          for (const book of localCart) {
            const { data, error } = await supabase
              .from("carts")
              .select("*")
              .eq("user_id", user.id)
              .eq("book_id", book.book_id)
              .single();

            if (error && error.code !== "PGRST116") {
              alert(`Error syncing cart: ${error.message}`);
              return;
            }

            if (data) {
              await supabase
                .from("carts")
                .update({ quantity: data.quantity + book.quantity })
                .eq("id", data.id);
            } else {
              await supabase.from("carts").insert({
                user_id: user.id,
                book_id: book.book_id,
                quantity: book.quantity,
              });
            }
          }
          set({ cart: [] });
          localStorage.removeItem("cart");
        } catch (syncError) {
          alert(`Failed to sync cart with server: ${syncError.message}`);
        }
      }
    }
  },

  logout: async () => {
    try {
      await fetch("/api/auth/signout", { method: "POST" });
      set({ user: null, cart: [], searchHistory: [] });
      localStorage.removeItem("cart");
      await supabase.from("search_history").delete().eq("user_id", get().user?.id);
    } catch (error) {
      alert(`Logout failed: ${error.message}`);
    }
  },

  addToCart: async (book) => {
    const { user } = get();
    const currentCart = get().cart;

    if (user?.id) {
      try {
        const { data, error } = await supabase
          .from("carts")
          .select("*")
          .eq("user_id", user.id)
          .eq("book_id", book.book_id)
          .single();

        if (error && error.code !== "PGRST116") {
          alert(`Error adding to cart: ${error.message}`);
          return;
        }

        if (data) {
          await supabase
            .from("carts")
            .update({ quantity: data.quantity + 1 })
            .eq("id", data.id);
        } else {
          await supabase
            .from("carts")
            .insert({ user_id: user.id, book_id: book.book_id, quantity: 1 });
        }

        set((state) => {
          const existingCart = state.cart.find((item) => item.book_id === book.book_id);
          return {
            cart: existingCart
              ? state.cart.map((item) =>
                  item.book_id === book.book_id ? { ...item, quantity: item.quantity + 1 } : item,
                )
              : [...state.cart, { ...book, quantity: 1 }],
          };
        });
      } catch (error) {
        alert(`Failed to add item to cart: ${error.message}`);
      }
    } else {
      const existingCart = currentCart.find((item) => item.book_id === book.book_id);
      const updatedCart = existingCart
        ? currentCart.map((item) =>
            item.book_id === book.book_id ? { ...item, quantity: item.quantity + 1 } : item,
          )
        : [...currentCart, { ...book, quantity: 1 }];
      set({ cart: updatedCart });
      localStorage.setItem("cart", JSON.stringify(updatedCart));
    }

    await get().syncCartWithSupabase();
  },

  removeFromCart: async (bookId) => {
    const { user } = get();
    if (user?.id) {
      try {
        await supabase.from("carts").delete().eq("user_id", user.id).eq("book_id", bookId);
      } catch (error) {
        alert(`Failed to remove item from cart: ${error.message}`);
      }
    }
    const updatedCart = get().cart.filter((item) => item.book_id !== bookId);
    set({ cart: updatedCart });
    if (!user?.id) localStorage.setItem("cart", JSON.stringify(updatedCart));
  },

  syncCartWithSupabase: async () => {
    const { user, cart } = get();
    if (!user?.id) return;
    try {
      const { data, error } = await supabase.from("carts").select("*").eq("user_id", user.id);
      if (error) {
        alert(`Error syncing cart: ${error.message}`);
        return;
      }
      if (data) {
        set({
          cart: data.map((item) => {
            const book = cart.find((b) => b.book_id === item.book_id);
            return {
              ...book,
              quantity: item.quantity,
              book_id: item.book_id,
            };
          }),
        });
      }
    } catch (error) {
      alert(`Cart sync failed: ${error.message}`);
    }
  },

  setSearchQuery: (query) => {
    const { user } = get();
    set({ searchQuery: query, isTyping: !!query });
    if (user?.id && query.trim()) {
      supabase
        .from("search_history")
        .insert({ user_id: user.id, query, timestamp: new Date() })
        .then(({ error }) => {
          if (error) console.error("Failed to save search history:", error);
        });
    }
  },
  setCategory: (cat) => set({ category: cat }),
  setPriceRange: (range) => set({ priceRange: range }),
  setLanguage: (lang) => set({ language: lang }),
  setIsTyping: (isTyping) => set({ isTyping }),

  loadSearchHistory: async () => {
    const { user } = get();
    if (user?.id) {
      const { data, error } = await supabase
        .from("search_history")
        .select("query")
        .eq("user_id", user.id)
        .order("timestamp", { ascending: false })
        .limit(10);
      if (error) {
        console.error("Failed to load search history:", error);
        return [];
      }
      set({ searchHistory: data.map((item) => item.query) });
    }
  },
  submitTestimonial: async (text, rating) => {
    const { user } = get();
    const testimonialData = {
      user_id: user?.id || null,
      name: user?.user_metadata?.name || "Anonymous",
      avatar: user?.user_metadata?.avatar_url || null,
      text,
      rating,
    };
    try {
      const { data, error } = await supabase
        .from("testimonials")
        .insert([testimonialData])
        .single();
      if (error) throw error;
      toast.success(
        get().language === "ar" ? "تم إرسال الشهادة بنجاح!" : "Testimonial submitted successfully!",
      );
      return data;
    } catch (error) {
      toast.error(
        get().language === "ar"
          ? `فشل إرسال الشهادة: ${error.message}`
          : `Failed to submit testimonial: ${error.message}`,
      );
      console.error("Testimonial submission error:", error);
      return null;
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
        const message = notifyPriceDrop ? "Price drop detected!" : "Book is now available!";
        await supabase.functions.invoke("send-notification", {
          body: { userId: user.id, bookId, notifyEmail, notifyInApp, message },
        });
      }
    } catch (error) {
      alert(`Error adding to wishlist: ${error.message}`);
    }
  },

  isAdmin: () => {
    const { user } = get();
    return user?.user_metadata?.role === "admin";
  },
}));
