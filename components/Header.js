"use client";

import Link from "next/link";
import { useState } from "react";
import LanguageToggle from "@/components/LanguageToggle";
import { useStore } from "@/lib/store";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";
import { Menu, ShoppingCart } from "lucide-react";
import translations from "@/lib/translations";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const { cart, user, logout, language } = useStore();

  const handleLogout = async () => {
    await signOut({ redirect: false });
    logout();
  };

  const t = translations[language];

  return (
    <header className="bg-green-900 text-cream-100 py-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center px-4">
        <h1 className="text-3xl font-bold text-gold-300">{t.title}</h1>
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              className="sm:hidden text-cream-100 flex items-center"
            >
              <Menu size={24} />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="bg-green-900 text-cream-100">
            <nav className="flex flex-col gap-4 mt-4">
              <LanguageToggle />
              <Link
                href="/"
                className="hover:text-gold-300 transition-colors text-lg"
                onClick={() => setIsOpen(false)}
              >
                {t.home}
              </Link>
              <Link
                href="/shop"
                className="hover:text-gold-300 transition-colors text-lg"
                onClick={() => setIsOpen(false)}
              >
                {t.shop}
              </Link>
              <Link
                href="/cart"
                className="hover:text-gold-300 transition-colors text-lg flex items-center gap-2"
                onClick={() => setIsOpen(false)}
              >
                <ShoppingCart size={16} />{" "}
                {t.cart.replace("{count}", cart.length)}
              </Link>
              {user ? (
                <Button
                  variant="ghost"
                  onClick={handleLogout}
                  className="hover:text-gold-300 text-lg"
                >
                  {t.signOut}
                </Button>
              ) : (
                <Link
                  href="/auth/signin"
                  className="hover:text-gold-300 transition-colors text-lg"
                  onClick={() => setIsOpen(false)}
                >
                  {t.signIn}
                </Link>
              )}
            </nav>
          </SheetContent>
        </Sheet>
        <nav className="hidden sm:flex gap-6">
          <LanguageToggle />
          <Link
            href="/"
            className="hover:text-gold-300 transition-colors text-lg"
          >
            {t.home}
          </Link>
          <Link
            href="/shop"
            className="hover:text-gold-300 transition-colors text-lg"
          >
            {t.shop}
          </Link>
          <Link
            href="/cart"
            className="hover:text-gold-300 transition-colors text-lg flex items-center gap-2"
          >
            <ShoppingCart size={16} /> {t.cart.replace("{count}", cart.length)}
          </Link>
          {user ? (
            <Button
              variant="ghost"
              onClick={handleLogout}
              className="hover:text-gold-300 text-lg"
            >
              {t.signOut}
            </Button>
          ) : (
            <Link
              href="/auth/signin"
              className="hover:text-gold-300 transition-colors text-lg"
            >
              {t.signIn}
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
