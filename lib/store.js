import { create } from "zustand";
import { supabase } from "./supabase";

export const useStore = create((set, get) => {
  const savedCart =
    typeof window !== "undefined" ? localStorage.getItem("cart") : null;
  const initialCart = savedCart ? JSON.parse(savedCart) : [];

  return {
    cart: initialCart,
    user: null,
    searchQuery: "",
    category: "all",
    language: "ar",
    priceRange: [0, 100],
    setUser: (user) => {
      set({ user });
      if (user?.id) {
        const localCart = get().cart;
        if (localCart.length > 0) {
          localCart.forEach(async (book) => {
            try {
              const { data, error } = await supabase
                .from("carts")
                .select("*")
                .eq("user_id", user.id)
                .eq("book_id", book.book_id)
                .single();

              if (error && error.code !== "PGRST116") {
                console.error("Error checking cart:", error);
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
            } catch (syncError) {
              console.error("Sync error:", syncError);
            }
          });
          set({ cart: [] });
          localStorage.removeItem("cart");
        }
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
            console.error("Error checking cart:", error);
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
            const existingCart = state.cart.find(
              (item) => item.book_id === book.book_id
            );
            return {
              cart: existingCart
                ? state.cart.map((item) =>
                    item.book_id === book.book_id
                      ? { ...item, quantity: item.quantity + 1 }
                      : item
                  )
                : [...state.cart, { ...book, quantity: 1 }],
            };
          });
        } catch (error) {
          console.error("Add to cart error:", error);
        }
      } else {
        // not signed user: store locally in zustand and localStorage
        const existingCart = currentCart.find(
          (item) => item.book_id === book.book_id
        );
        const updatedCart = existingCart
          ? currentCart.map((item) =>
              item.book_id === book.book_id
                ? { ...item, quantity: item.quantity + 1 }
                : item
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
          await supabase
            .from("carts")
            .delete()
            .eq("user_id", user.id)
            .eq("book_id", bookId);
        } catch (error) {
          console.error("Remove from cart error:", error);
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
        const { data, error } = await supabase
          .from("carts")
          .select("*")
          .eq("user_id", user.id);
        if (error) {
          console.error("Sync error:", error);
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
        console.error("Cart sync failed:", error.message);
      }
    },
    setSearchQuery: (query) => set({ searchQuery: query }),
    setCategory: (cat) => set({ category: cat }),
    setPriceRange: (range) => set({ priceRange: range }),
    setLanguage: (lang) => set({ language: lang }),
  };
});
