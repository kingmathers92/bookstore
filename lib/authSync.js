"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useStore } from "@/lib/store";

export default function AuthSync() {
  const { data: session, status } = useSession();
  const { setUser, logout } = useStore();

  useEffect(() => {
    if (status === "loading") return;
    if (window.location.pathname.startsWith("/admin")) return;

    if (status === "authenticated" && session?.user) {
      setUser({
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        user_metadata: session.user.user_metadata || { role: "user" },
      });
    } else if (status === "unauthenticated") {
      logout();
    }
  }, [session, status, setUser, logout]);

  return null;
}
