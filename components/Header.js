"use client";

import { useState, useEffect } from "react";
import LanguageToggle from "@/components/LanguageToggle";
import { useStore } from "@/lib/store";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";
import { Menu, ShoppingCart, User, BookOpen, Heart } from "lucide-react";
import { motion } from "framer-motion";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import translations from "@/lib/translations";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const { cart, user, logout, language } = useStore();
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();

  const handleLogout = async () => {
    await signOut({ redirect: false });
    useStore.getState().logout();
    router.push("/auth/signin");
  };

  const t = translations[language] || translations.ar;
  const isActive = (path) => pathname === path;

  useEffect(() => {
    if (status === "authenticated" && session?.user && !user) {
      const { id, name, email, user_metadata } = session.user;
      useStore.getState().setUser({
        id: id || null,
        name: name || "",
        email: email || "",
        user_metadata: user_metadata || { role: "user" },
      });
    }
  }, [session, status, user]);

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 elegant-shadow">
      <div className="container mx-auto flex items-center justify-between py-4 px-6">
        <motion.div
          className="flex items-center gap-3"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="relative">
              <Image
                src="/images/logo.jpg"
                alt="Thamarat Al-Awraq Logo"
                width={50}
                height={50}
                className="rounded-full elegant-shadow"
              />
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-burgundy rounded-full flex items-center justify-center">
                <BookOpen size={10} className="text-white" />
              </div>
            </div>
            <div className="hidden md:block">
              <h1 className="text-2xl font-bold text-burgundy font-serif">{t.title}</h1>
              <p className="text-xs text-gray-600 -mt-1">
                {language === "ar" ? "متجر الكتب الإسلامية" : "Islamic Books Store"}
              </p>
            </div>
          </Link>
        </motion.div>

        <NavigationMenu className="hidden md:block">
          <NavigationMenuList className="flex items-center gap-2">
            <NavigationMenuItem>
              <NavigationMenuLink
                href="/"
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                  isActive("/")
                    ? "bg-burgundy text-white elegant-shadow"
                    : "text-gray-700 hover:bg-warm-gray hover:text-burgundy"
                }`}
              >
                {t.home}
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink
                href="/shop"
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                  isActive("/shop")
                    ? "bg-burgundy text-white elegant-shadow"
                    : "text-gray-700 hover:bg-warm-gray hover:text-burgundy"
                }`}
              >
                {t.shop || "Shop"}
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              {status === "authenticated" ? (
                <Button
                  variant="ghost"
                  onClick={handleLogout}
                  className="px-4 py-2 rounded-lg font-medium text-gray-700 hover:bg-warm-gray hover:text-burgundy transition-all duration-300 hover:cursor-pointer"
                >
                  {t.signOut}
                </Button>
              ) : (
                <NavigationMenuLink
                  href="/auth/signin"
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:cursor-pointer ${
                    isActive("/auth/signin")
                      ? "bg-burgundy text-white elegant-shadow"
                      : "text-gray-700 hover:bg-warm-gray hover:text-burgundy"
                  }`}
                >
                  {t.signIn}
                </NavigationMenuLink>
              )}
            </NavigationMenuItem>
            {status === "authenticated" && (
              <NavigationMenuLink
                href="/wishlist"
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                  isActive("/wishlist")
                    ? "bg-burgundy text-white elegant-shadow"
                    : "text-gray-700 hover:bg-warm-gray hover:text-burgundy"
                }`}
              >
                <Heart className="inline-block w-5 h-5 mr-1" />
                {t.wishlist || "Wishlist"}
              </NavigationMenuLink>
            )}
          </NavigationMenuList>
        </NavigationMenu>

        <div className="flex items-center gap-4">
          <Link
            href="/cart"
            className={`relative flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-all duration-300 ${
              isActive("/cart")
                ? "bg-burgundy text-white elegant-shadow"
                : "text-gray-700 hover:bg-warm-gray hover:text-burgundy"
            }`}
          >
            <div className="relative">
              <ShoppingCart size={20} />
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-burgundy text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {cart.length}
                </span>
              )}
            </div>
          </Link>

          {status === "authenticated" && (
            <div className="relative">
              <div className="w-8 h-8 bg-burgundy rounded-full flex items-center justify-center">
                <User size={16} className="text-white" />
              </div>
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
            </div>
          )}

          <LanguageToggle />

          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                className="md:hidden p-2 text-gray-700 hover:bg-warm-gray hover:text-burgundy rounded-lg hover:cursor-pointer"
              >
                <Menu size={24} />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-white w-[280px] p-6 elegant-shadow-lg">
              <motion.nav
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col gap-4 mt-8"
              >
                <Link
                  href="/"
                  className={`px-4 py-3 rounded-lg font-medium transition-all duration-300 ${
                    isActive("/")
                      ? "bg-burgundy text-white elegant-shadow"
                      : "text-gray-700 hover:bg-warm-gray hover:text-burgundy"
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {t.home}
                </Link>
              <Link
                href="/about"
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                  isActive("/about")
                    ? "bg-burgundy text-white elegant-shadow"
                    : "text-gray-700 hover:bg-warm-gray hover:text-burgundy"
                }`}
                onClick={() => setIsOpen(false)}
              >
                {t.aboutUs || "من نحن"}
              </Link>

                <Link
                  href="/shop"
                  className={`px-4 py-3 rounded-lg font-medium transition-all duration-300 ${
                    isActive("/shop")
                      ? "bg-burgundy text-white elegant-shadow"
                      : "text-gray-700 hover:bg-warm-gray hover:text-burgundy"
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {t.shop}
                </Link>
                <Link
                  href="/cart"
                  className={`px-4 py-3 rounded-lg font-medium flex items-center gap-2 transition-all duration-300 ${
                    isActive("/cart")
                      ? "bg-burgundy text-white elegant-shadow"
                      : "text-gray-700 hover:bg-warm-gray hover:text-burgundy"
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  <ShoppingCart size={20} />
                  {t.cart?.replace("{count}", cart.length) || `Cart (${cart.length})`}
                </Link>
              <Link
                href="/contact"
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                  isActive("/contact")
                    ? "bg-burgundy text-white elegant-shadow"
                    : "text-gray-700 hover:bg-warm-gray hover:text-burgundy"
                }`}
                onClick={() => setIsOpen(false)}
              >
                {t.contactUs || "اتصل بنا"}
              </Link>
                {status === "authenticated" ? (
                  <Button
                    variant="ghost"
                    onClick={handleLogout}
                    className="px-4 py-3 rounded-lg font-medium text-gray-700 hover:bg-warm-gray hover:text-burgundy transition-all duration-300 justify-start hover:cursor-pointer"
                  >
                    {t.signOut}
                  </Button>
                ) : (
                  <Link
                    href="/auth/signin"
                    className={`px-4 py-3 rounded-lg font-medium transition-all duration-300 hover:cursor-pointer ${
                      isActive("/auth/signin")
                        ? "bg-burgundy text-white elegant-shadow"
                        : "text-gray-700 hover:bg-warm-gray hover:text-burgundy"
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    {t.signIn}
                  </Link>
                )}
              </motion.nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
