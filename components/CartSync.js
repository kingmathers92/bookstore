"use client";

import { useEffect } from "react";
import { useStore } from "@/lib/store";

export default function CartSync() {
  const { syncCartWithSupabase } = useStore();

  useEffect(() => {
    const sync = async () => {
      try {
        await syncCartWithSupabase();
      } catch (error) {
        console.error("Cart sync failed:", error.message);
      }
    };
    sync();
  }, [syncCartWithSupabase]);

  return null;
}
