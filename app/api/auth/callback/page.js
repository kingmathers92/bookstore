"use client";

import { useEffect } from "react";
import { useStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function Callback() {
  const { data: session } = useSession();
  const setUser = useStore((state) => state.setUser);
  const router = useRouter();

  useEffect(() => {
    if (session) {
      setUser({
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
      });
      router.push("/");
    }
  }, [session, setUser, router]);

  return (
    <div>
      <LoadingSpinner />
    </div>
  );
}
