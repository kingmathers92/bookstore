"use client";

import Link from "next/link";
import { useState } from "react";
import { useStore } from "@/lib/store";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";
import { Menu, ShoppingCart } from "lucide-react";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const { cart, user, logout } = useStore();

  const handleLogout = async () => {
    await signOut({ redirect: false });
    logout();
  };

  return (
    <header className="bg-green-900 text-cream-100 py-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center px-4">
        <h1 className="text-3xl font-bold text-gold-300">ثمرات الأوراق</h1>
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
              <Link
                href="/"
                className="hover:text-gold-300 transition-colors text-lg"
                onClick={() => setIsOpen(false)}
              >
                الرئيسية
              </Link>
              <Link
                href="/shop"
                className="hover:text-gold-300 transition-colors text-lg"
                onClick={() => setIsOpen(false)}
              >
                المتجر
              </Link>
              <Link
                href="/cart"
                className="hover:text-gold-300 transition-colors text-lg flex items-center gap-2"
                onClick={() => setIsOpen(false)}
              >
                <ShoppingCart size={16} /> السلة ({cart.length})
              </Link>
              {user ? (
                <Button
                  variant="ghost"
                  onClick={handleLogout}
                  className="hover:text-gold-300 text-lg"
                >
                  تسجيل الخروج
                </Button>
              ) : (
                <Link
                  href="/auth/signin"
                  className="hover:text-gold-300 transition-colors text-lg"
                  onClick={() => setIsOpen(false)}
                >
                  تسجيل الدخول
                </Link>
              )}
            </nav>
          </SheetContent>
        </Sheet>
        <nav className="hidden sm:flex gap-6">
          <Link
            href="/"
            className="hover:text-gold-300 transition-colors text-lg"
          >
            الرئيسية
          </Link>
          <Link
            href="/shop"
            className="hover:text-gold-300 transition-colors text-lg"
          >
            المتجر
          </Link>
          <Link
            href="/cart"
            className="hover:text-gold-300 transition-colors text-lg flex items-center gap-2"
          >
            <ShoppingCart size={16} /> السلة ({cart.length})
          </Link>
          {user ? (
            <Button
              variant="ghost"
              onClick={handleLogout}
              className="hover:text-gold-300 text-lg"
            >
              تسجيل الخروج
            </Button>
          ) : (
            <Link
              href="/auth/signin"
              className="hover:text-gold-300 transition-colors text-lg"
            >
              تسجيل الدخول
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
