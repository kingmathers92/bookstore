"use client";

import { useEffect } from "react";
import { useStore } from "@/lib/store";

export default function DataSync() {
  const { user, syncCartFromLocalStorage, loadCartFromSupabase, loadWishlistFromSupabase } =
    useStore();

  useEffect(() => {
    syncCartFromLocalStorage();

    if (user?.id) {
      loadCartFromSupabase();
      loadWishlistFromSupabase();
    }
  }, [user]);

  return null;
}
