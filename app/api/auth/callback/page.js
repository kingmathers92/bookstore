"use client";

import { useEffect } from "react";
import { useStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function Callback() {
  const { data: session, status } = useSession();
  const setUser = useStore((state) => state.setUser);
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated" && session) {
      setUser({
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        user_metadata: session.user.user_metadata || { role: "user" },
      });
      router.push(session.user.user_metadata.role === "admin" ? "/admin" : "/");
    }
  }, [session, status, setUser, router]);

  if (status === "loading") return <LoadingSpinner />;
  return <LoadingSpinner />;
}
