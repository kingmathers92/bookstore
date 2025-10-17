"use client";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useStore } from "@/lib/store";

export default function AuthSync() {
  const { data: session, status } = useSession();
  const setUser = useStore((state) => state.setUser);

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      setUser({
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        user_metadata: session.user.user_metadata || { role: "user" },
      });
    }
  }, [status, session, setUser]);

  return null;
}
