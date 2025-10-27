"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useStore } from "@/lib/store";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function Callback() {
  const { data: session, status } = useSession();
  const setUser = useStore((state) => state.setUser);
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      setUser({
        id: session.user.id,
        supabase_id: session.user.supabase_id,
        name: session.user.name,
        email: session.user.email,
        user_metadata: session.user.user_metadata || { role: "user" },
      });

      const role = session.user.user_metadata?.role || "user";
      router.replace(role === "admin" ? "/admin" : "/");
    }
  }, [session, status, setUser, router]);

  return <LoadingSpinner />;
}
