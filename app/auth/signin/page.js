"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { useState } from "react";
import { useStore } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import GoogleSignIn from "@/components/GoogleSignIn";
import { User } from "lucide-react";
import translations from "@/lib/translations";
import Link from "next/link";

export default function SignIn() {
  const { data: session, status } = useSession();
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
      const { user } = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });
      if (user) {
        setUser({
          id: user.id,
          name: user.name || user.email,
          email: user.email,
        });
      }
    }
  };

  if (status === "authenticated" && session) {
    return (
      <div className="container mx-auto py-12">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-green-900 flex items-center gap-2">
              <User size={24} /> {t.welcome}{" "}
              {session.user.name || session.user.email}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground">{t.loggedInAs}</p>
            <Button
              onClick={() => signOut({ redirect: "/auth/signin" })}
              className="bg-red-600 text-white w-full"
            >
              {t.logout}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12">
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
            <p className="text-muted-foreground mb-2 hover:cursor-pointer">
              {t.or}
            </p>
            <GoogleSignIn language={language} />
          </div>
          <div className="mt-4 text-center">
            <p className="text-muted-foreground">{t.noAccount}</p>
            <Link href="/auth/register">
              <Button
                variant="link"
                className="text-emerald-700 hover:cursor-pointer"
              >
                {t.register}
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
