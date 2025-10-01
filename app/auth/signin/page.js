"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useStore } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import translations from "@/lib/translations";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const setUser = useStore((state) => state.setUser);
  const logout = useStore((state) => state.logout);
  const { language } = useStore();
  const t = translations[language];

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });
    if (result?.error) {
      alert(t.signInError);
    } else {
      const user = {
        id: result.user.id,
        name: result.user.name,
        email: result.user.email,
      };
      setUser(user);
    }
  };

  const handleGoogleSignIn = async () => {
    await signIn("google", { callbackUrl: "/" });
  };

  return (
    <div className="container mx-auto py-12 mt-25">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-green-900 flex items-center gap-2">
            <User size={24} /> {t.signInTitle}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t.signInEmailPlaceholder}
              className="w-full"
            />
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t.signInPasswordPlaceholder}
              className="w-full"
            />
            <Button
              type="submit"
              className="bg-emerald-700 text-cream-100 w-full hover:cursor-pointer"
            >
              {t.signInButton}
            </Button>
          </form>
          <div className="mt-4 text-center">
            <p className="text-muted-foreground mb-2">{t.or}</p>
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
          </div>
          <div className="mt-4 text-center">
            <p className="text-muted-foreground">{t.noAccount}</p>
            <Button
              variant="link"
              onClick={() =>
                signIn("credentials", { callbackUrl: "/auth/register" })
              }
              className="text-emerald-700"
            >
              {t.register}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
