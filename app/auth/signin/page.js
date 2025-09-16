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
      setUser({ id: 1, name: "User", email });
    }
  };

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
              className="bg-emerald-700 text-cream-100 w-full"
            >
              {t.signInButton}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
