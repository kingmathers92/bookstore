"use client";

import { useEffect } from "react";
import { useStore } from "@/lib/store";

export default function DataSync() {
  const { user, syncCartFromLocalStorage, loadCartFromSupabase } = useStore();

  useEffect(() => {
    syncCartFromLocalStorage();

    if (user?.id) {
      loadCartFromSupabase();
    }
  }, [user, syncCartFromLocalStorage, loadCartFromSupabase]);

  return null;
}
