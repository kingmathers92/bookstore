"use client";

import { signIn, useSession, signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import { useStore } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import GoogleSignIn from "@/components/GoogleSignIn";
import { User, BookOpen, Star, Sparkles, Mail, Lock, LogIn } from "lucide-react";
import { motion } from "framer-motion";
import translations from "@/lib/translations";
import Link from "next/link";
import { useRouter } from "next/navigation";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function SignIn() {
  const { data: session, status } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
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
      router.push(session.user.user_metadata.role === "admin" ? "/admin" : "/");
    }
  }, [session, status, setUser, router]);

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

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cream via-cream-light to-warm-gray-50">
        <LoadingSpinner />
      </div>
    );
  }

  if (status === "authenticated" && session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cream via-cream-light to-warm-gray-50 p-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-20 w-32 h-32 border-2 border-burgundy rounded-full"></div>
          <div className="absolute bottom-32 right-32 w-24 h-24 border-2 border-burgundy-light rounded-full"></div>
          <div className="absolute top-1/2 left-1/4 w-16 h-16 border border-burgundy rotate-45"></div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md relative z-10"
        >
          <Card className="bg-white rounded-3xl elegant-shadow-lg border border-burgundy/10 overflow-hidden">
            <CardHeader className="bg-gradient-burgundy text-center p-8 relative">
              <div className="absolute top-0 left-0 w-full h-full opacity-10">
                <div className="absolute top-4 right-4 w-16 h-16 border-2 border-white rounded-full"></div>
                <div className="absolute bottom-4 left-4 w-12 h-12 border border-white rotate-45"></div>
              </div>

              <div className="relative z-10">
                <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4 elegant-shadow">
                  <BookOpen className="w-10 h-10 text-white" />
                </div>

                <CardTitle className="text-2xl font-bold text-white mb-2 font-serif flex items-center justify-center gap-2">
                  <Star className="w-6 h-6 fill-current" />
                  أهلاً وسهلاً
                  <Star className="w-6 h-6 fill-current" />
                </CardTitle>

                <p className="text-cream-light">{session.user.name || session.user.email}</p>
              </div>
            </CardHeader>

            <CardContent className="text-center space-y-6 p-8 bg-gradient-cream">
              <div className="flex justify-center gap-1 py-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                ))}
              </div>

              <p className="text-warm-gray-600 font-serif">
                {t.loggedInAs || "مرحباً بك في مكتبة الكتب الإسلامية"}
              </p>

              <Button
                onClick={() => signOut({ callbackUrl: "/auth/signin" })}
                className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white w-full py-3 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 elegant-shadow"
              >
                {t.logout || "تسجيل الخروج"}
              </Button>

              {/* Islamic Quote */}
              <div className="bg-white rounded-xl p-4 border border-burgundy/10 elegant-shadow">
                <p className="text-xs text-warm-gray-600 italic font-serif">"وَقُل رَّبِّ زِدْنِي عِلْمًا"</p>
                <p className="text-xs text-burgundy mt-1">سورة طه</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cream via-cream-light to-warm-gray-50 p-4 relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-32 h-32 border-2 border-burgundy rounded-full"></div>
        <div className="absolute bottom-32 right-32 w-24 h-24 border-2 border-burgundy-light rounded-full"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 border border-burgundy rotate-45"></div>
        <div className="absolute top-1/4 right-1/3 w-20 h-20 border border-burgundy-light rotate-12"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg relative z-10"
      >
        <Card className="bg-white rounded-3xl elegant-shadow-lg overflow-hidden border border-burgundy/10">
          <CardHeader className="bg-gradient-burgundy text-center p-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full opacity-10">
              <div className="absolute top-4 right-4 w-16 h-16 border-2 border-white rounded-full"></div>
              <div className="absolute bottom-4 left-4 w-12 h-12 border border-white rotate-45"></div>
            </div>

            <div className="relative z-10">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-6 elegant-shadow">
                <BookOpen className="w-10 h-10 text-white" />
              </div>

              <CardTitle className="text-3xl font-bold text-white mb-2 font-serif flex items-center justify-center gap-3">
                <Sparkles className="w-6 h-6" />
                مكتبة الكتب الإسلامية
                <Sparkles className="w-6 h-6" />
              </CardTitle>

              <p className="text-cream-light text-lg">
                {t.signInTitle || "ادخل إلى عالم المعرفة الإسلامية"}
              </p>
              <div className="flex justify-center gap-2 mt-4">
                <Sparkles className="w-4 h-4 text-cream-light animate-pulse" />
                <Sparkles className="w-4 h-4 text-cream-light animate-pulse delay-300" />
                <Sparkles className="w-4 h-4 text-cream-light animate-pulse delay-700" />
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-8 bg-gradient-cream">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-3">
                <label className="text-sm font-semibold text-burgundy flex items-center gap-2 font-serif">
                  <div className="p-1 bg-burgundy/10 rounded-lg">
                    <Mail className="w-4 h-4 text-burgundy" />
                  </div>
                  {t.signInEmailPlaceholder || "البريد الإلكتروني"}
                </label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t.signInEmailPlaceholder || "أدخل بريدك الإلكتروني"}
                  className="w-full px-4 py-4 rounded-2xl bg-white border-2 border-burgundy/20 focus:border-burgundy focus:ring-2 focus:ring-burgundy/20 outline-none transition-all shadow-sm hover:shadow-md text-right"
                  disabled={loading}
                />
              </div>
              <div className="space-y-3">
                <label className="text-sm font-semibold text-burgundy flex items-center gap-2 font-serif">
                  <div className="p-1 bg-burgundy/10 rounded-lg">
                    <Lock className="w-4 h-4 text-burgundy" />
                  </div>
                  {t.signInPasswordPlaceholder || "كلمة المرور"}
                </label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t.signInPasswordPlaceholder || "أدخل كلمة المرور"}
                  className="w-full px-4 py-4 rounded-2xl bg-white border-2 border-burgundy/20 focus:border-burgundy focus:ring-2 focus:ring-burgundy/20 outline-none transition-all shadow-sm hover:shadow-md text-right"
                  disabled={loading}
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-burgundy hover:bg-burgundy-dark text-white font-bold py-4 px-6 rounded-2xl transition-all duration-300 transform hover:scale-105 elegant-shadow hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span className="text-lg">{t.signingIn || "جاري تسجيل الدخول..."}</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-3">
                    <LogIn className="w-5 h-5" />
                    <span className="text-lg font-serif">{t.signInButton || "تسجيل الدخول"}</span>
                    <Sparkles className="w-5 h-5" />
                  </div>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center space-y-4">
              <div className="w-full h-px bg-gradient-to-r from-transparent via-burgundy/30 to-transparent"></div>

              <p className="text-warm-gray-600 mb-2 font-serif">{t.or || "أو"}</p>
              <GoogleSignIn language={language} />
            </div>

            <div className="mt-6 text-center space-y-4">
              <div className="w-full h-px bg-gradient-to-r from-transparent via-burgundy/30 to-transparent"></div>

              <p className="text-warm-gray-600">{t.noAccount || "ليس لديك حساب؟"}</p>
              <Link href="/auth/register">
                <Button
                  variant="link"
                  className="text-burgundy font-semibold hover:underline transition-all duration-200 hover:cursor-pointer"
                >
                  {t.register || "إنشاء حساب جديد"}
                </Button>
              </Link>
              <div className="bg-white rounded-xl p-4 border border-burgundy/10 elegant-shadow">
                <p className="text-xs text-warm-gray-600 italic font-serif">
                  "اقْرَأْ بِاسْمِ رَبِّكَ الَّذِي خَلَقَ"
                </p>
                <p className="text-xs text-burgundy mt-1">سورة العلق</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
