"use client";

import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import translations from "@/lib/translations";

export default function GoogleSignIn({ language }) {
  const t = translations[language];
  const router = useRouter();

  const handleGoogleSignIn = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      console.error("Google sign-in error:", error.message);
      alert("Sign-in failed. Please try again.");
    } else {
      router.refresh();
    }
  };

  return (
    <Button
      onClick={handleGoogleSignIn}
      className="bg-emerald-700 text-white w-full flex items-center justify-center gap-2 hover:cursor-pointer"
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 18 18"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M17.64 9.2045C17.64 8.5665 17.5827 7.9525 17.476 7.3645H9V10.925H13.8433C13.635 12.315 13.0007 13.5755 12.024 14.3995V16.6785H14.9987C16.7473 15.0035 17.64 12.5415 17.64 9.2045Z"
          fill="#4285F4"
        />
        <path
          d="M9 18C11.43 18 13.4673 17.194 14.9987 16.6785L12.024 14.3995C11.1127 14.9355 9.924 15.2503 9 15.2503C6.612 15.2503 4.61333 13.9345 3.84667 12.0515L1.82667 14.3645C3.49333 16.8585 6.18 18 9 18Z"
          fill="#34A853"
        />
        <path
          d="M3.84666 12.0515C3.58966 11.4635 3.43866 10.8245 3.43866 10.125C3.43866 9.4255 3.58966 8.7865 3.84666 8.1985V5.8855L1.82333 3.5715C0.684333 5.2605 0 7.2945 0 9.125C0 10.9555 0.684333 12.9895 1.82333 14.6785L3.84666 12.0515Z"
          fill="#FBBC04"
        />
        <path
          d="M9 3.74975C10.606 3.74975 11.9967 4.18475 13.1347 5.12525L15.0213 3.23875C13.46 1.73875 11.422 0.74975 9 0.74975C6.18 0.74975 3.49333 2.04175 1.82667 4.57525L3.84667 6.88875C4.61333 5.00575 6.612 3.74975 9 3.74975Z"
          fill="#EA4335"
        />
      </svg>
      {t.googleLogin}
    </Button>
  );
}
