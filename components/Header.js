"use client";

import Link from "next/link";
import { useState } from "react";
import LanguageToggle from "@/components/LanguageToggle";
import { useStore } from "@/lib/store";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";
import { Menu, ShoppingCart, User } from "lucide-react";
import { motion } from "framer-motion";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
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
    <header
      className="fixed top-0 left-0 w-full z-50 bg-gradient-to-r from-[var(--header-gradient-start)] to-[var(--header-gradient-end)] border-b border-primary/20 shadow-lg"
      style={{
        background:
          "linear-gradient(to right, var(--header-gradient-start), var(--header-gradient-end))",
      }}
    >
      <div className="container mx-auto flex items-center justify-between py-4 px-6">
        <motion.div
          className="text-3xl font-bold text-primary-foreground"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link href="/" className="hover:text-accent transition-colors">
            {t.title}
          </Link>
        </motion.div>

        {/* Navigation Links on the left side */}
        <NavigationMenu className="hidden md:block ml-10">
          <NavigationMenuList className="space-x-4">
            <NavigationMenuItem>
              <NavigationMenuLink
                href="/shop"
                className="text-primary-foreground hover:text-accent transition-colors text-lg font-medium px-4 py-2"
              >
                {t.shop}
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink
                href="/"
                className="text-primary-foreground hover:text-accent transition-colors text-lg font-medium px-4 py-2"
              >
                {t.home}
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        {/* Right Section (Cart/User/Language) */}
        <div className="flex items-center gap-6">
          <Link
            href="/cart"
            className="text-primary-foreground hover:text-accent transition-colors text-lg flex items-center gap-1"
          >
            <ShoppingCart size={20} />
            {t.cart.replace("{count}", cart.length)}
          </Link>
          {user ? (
            <Button
              variant="ghost"
              onClick={handleLogout}
              className="text-primary-foreground hover:text-accent text-lg flex items-center gap-2"
            >
              <User size={20} />
              {t.signOut}
            </Button>
          ) : (
            <Link
              href="/auth/signin"
              className="text-primary-foreground hover:text-accent transition-colors text-lg flex items-center gap-2"
            >
              <User size={20} />
              {t.signIn}
            </Link>
          )}
          <LanguageToggle />
        </div>

        {/* Mobile Menu Trigger */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              className="md:hidden text-primary-foreground flex items-center"
            >
              <Menu size={24} />
            </Button>
          </SheetTrigger>
          <SheetContent
            side="right"
            className="bg-[var(--header-gradient-start)] text-primary-foreground w-[280px]"
          >
            <nav className="flex flex-col gap-6 mt-8">
              <Link
                href="/"
                className="hover:text-accent transition-colors text-lg"
                onClick={() => setIsOpen(false)}
              >
                {t.home}
              </Link>
              <Link
                href="/shop"
                className="hover:text-accent transition-colors text-lg"
                onClick={() => setIsOpen(false)}
              >
                {t.shop}
              </Link>
              <Link
                href="/cart"
                className="hover:text-accent transition-colors text-lg flex items-center gap-2"
                onClick={() => setIsOpen(false)}
              >
                <ShoppingCart size={20} />
                {t.cart.replace("{count}", cart.length)}
              </Link>
              {user ? (
                <Button
                  variant="ghost"
                  onClick={handleLogout}
                  className="hover:text-accent text-lg flex items-center gap-2"
                >
                  <User size={20} />
                  {t.signOut}
                </Button>
              ) : (
                <Link
                  href="/auth/signin"
                  className="hover:text-accent transition-colors text-lg flex items-center gap-2"
                  onClick={() => setIsOpen(false)}
                >
                  <User size={20} />
                  {t.signIn}
                </Link>
              )}
              <LanguageToggle />
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
