"use client";

import { signIn, useSession } from "next-auth/react";
import { useState, useEffect } from "react";
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
  const [loading, setLoading] = useState(false);
  const setUser = useStore((state) => state.setUser);
  const { language } = useStore();
  const t = translations[language];

  useEffect(() => {
    if (status === "authenticated" && session) {
      setUser({
        id: session.user.id,
        name: session.user.name || session.user.email,
        email: session.user.email,
        user_metadata: { name: session.user.name, avatar_url: session.user.picture },
      });
    }
  }, [session, status, setUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });
      if (result?.error) {
        alert(
          t.signInError ||
            `Sign-in failed: ${result.error}. Please check your credentials and try again.`,
        );
      } else {
      }
    } catch (error) {
      alert(
        t.signInError ||
          `An error occurred during sign-in: ${error.message}. Please try again later.`,
      );
    } finally {
      setLoading(false);
    }
  };

  if (status === "authenticated" && session) {
    return (
      <div className="container mx-auto py-12" style={{ paddingTop: "80px" }}>
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-green-900 flex items-center gap-2">
              <User size={24} /> {t.welcome} {session.user.name || session.user.email}
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
    <div className="container mx-auto py-12 justify-center" style={{ paddingTop: "80px" }}>
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
              disabled={loading}
            />
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t.signInPasswordPlaceholder}
              className="w-full"
              disabled={loading}
            />
            <Button
              type="submit"
              disabled={loading}
              className="bg-emerald-700 text-cream-100 w-full hover:cursor-pointer"
            >
              {loading ? t.signingIn || "Signing In..." : t.signInButton}
            </Button>
          </form>
          <div className="mt-4 text-center">
            <p className="text-muted-foreground mb-2">{t.or}</p>
            <GoogleSignIn language={language} />
          </div>
          <div className="mt-4 text-center">
            <p className="text-muted-foreground">{t.noAccount}</p>
            <Link href="/auth/register">
              <Button variant="link" className="text-emerald-700">
                {t.register}
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
