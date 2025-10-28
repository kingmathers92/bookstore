"use client";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useStore } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import GoogleSignIn from "@/components/GoogleSignIn";
import { BookOpen, Star, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import translations from "@/lib/translations";
import { useRouter } from "next/navigation";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function SignIn() {
  const { data: session, status } = useSession();
  const setUser = useStore((state) => state.setUser);
  const { language } = useStore();
  const router = useRouter();
  const t = translations[language];

  useEffect(() => {
    if (status === "authenticated" && session) {
      console.log("Session on load:", session);
      setUser({
        id: session.user.id,
        name: session.user.name || session.user.email,
        email: session.user.email,
        user_metadata: session.user.user_metadata || { role: "user" },
      });
      router.push(session.user.user_metadata?.role === "admin" ? "/admin" : "/");
    }
  }, [session, status, setUser, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cream via-cream-light to-warm-gray-50">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cream via-cream-light to-warm-gray-50 p-4 relative overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg relative z-10"
      >
        <Card className="bg-white rounded-3xl elegant-shadow-lg overflow-hidden border border-burgundy/10">
          <CardHeader className="bg-gradient-burgundy text-center p-8 relative overflow-hidden">
            <div className="relative z-10">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-6 elegant-shadow">
                <BookOpen className="w-10 h-10 text-burgundy" />
              </div>
              <CardTitle className="text-3xl font-bold  text-burgundy mb-2 font-serif flex items-center justify-center gap-3">
                <Sparkles className="w-6 h-6 text-burgundy" />
                مكتبة الكتب الإسلامية
                <Sparkles className="w-6 h-6" />
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-8 bg-gradient-cream">
            <div className="text-center space-y-4">
              <GoogleSignIn language={language} />
            </div>
            <div className="mt-6 bg-white rounded-xl text-center p-4 border border-burgundy/10 elegant-shadow">
              <p className="text-xs text-warm-gray-600 italic font-serif">
                "اقْرَأْ بِاسْمِ رَبِّكَ الَّذِي خَلَقَ"
              </p>
              <p className="text-xs text-burgundy mt-1">سورة العلق</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
