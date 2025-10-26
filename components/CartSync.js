"use client";

import { useEffect } from "react";
import { useStore } from "@/lib/store";

export default function CartSync() {
  const { syncCartFromLocalStorage, syncCartWithSupabase } = useStore();

  useEffect(() => {
    syncCartFromLocalStorage();
    syncCartWithSupabase();
  }, [syncCartFromLocalStorage, syncCartWithSupabase]);

  return null;
}
