"use client";

import { useEffect } from "react";
import { useStore } from "@/lib/store";

export default function CartSync() {
  const { syncCartWithSupabase } = useStore();

  useEffect(() => {
    syncCartWithSupabase();
  }, [syncCartWithSupabase]);

  return null;
}
