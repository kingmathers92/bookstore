"use client";

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
import Link from "next/link";
import Image from "next/image";

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
          <Link href="/" className="block md:hidden hover:cursor-pointer">
            <Image
              src="/images/logo.jpg"
              alt="Thamarat Al-Awraq Logo"
              width={60}
              height={60}
              className="rounded-full hover:opacity-80 transition-opacity duration-300"
            />
          </Link>
          <Link
            href="/"
            className="hidden md:block hover:text-accent transition-colors hover:cursor-pointer"
          >
            {t.title}
          </Link>
        </motion.div>

        {/* Navigation Links on the left side */}
        <NavigationMenu className="hidden md:block ml-10">
          <NavigationMenuList className="space-x-4">
            <NavigationMenuItem>
              <NavigationMenuLink
                href="/shop"
                className="text-primary-foreground hover:bg-gradient-to-r hover:from-[var(--accent-start)] hover:to-[var(--accent-end)] hover:text-primary-foreground transition-all duration-300 text-lg font-medium px-4 py-2 rounded-md"
              >
                {t.shop || "Shop"}
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink
                href="/"
                className="text-primary-foreground hover:bg-gradient-to-r hover:from-[var(--accent-start)] hover:to-[var(--accent-end)] hover:text-primary-foreground transition-all duration-300 text-lg font-medium px-4 py-2 rounded-md"
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
            className="text-primary-foreground hover:bg-gradient-to-r hover:from-[var(--accent-start)] hover:to-[var(--accent-end)] hover:text-primary-foreground transition-all duration-300 text-lg flex items-center gap-1 px-4 py-2 rounded-md"
          >
            <ShoppingCart size={20} />
            {t.cart.replace("{count}", cart.length)}
          </Link>
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
            className="bg-gradient-to-r from-[var(--header-gradient-start)] to-[var(--header-gradient-end)] text-primary-foreground w-[280px] p-6 rounded-l-xl shadow-2xl"
          >
            <motion.nav
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col gap-6 mt-4"
            >
              <Link
                href="/"
                className="hover:bg-gradient-to-r hover:from-[var(--accent-start)] hover:to-[var(--accent-end)] hover:text-primary-foreground transition-all duration-300 text-lg font-medium px-4 py-2 rounded-md"
                onClick={() => setIsOpen(false)}
              >
                {t.home}
              </Link>
              <Link
                href="/shop"
                className="hover:bg-gradient-to-r hover:from-[var(--accent-start)] hover:to-[var(--accent-end)] hover:text-primary-foreground transition-all duration-300 text-lg font-medium px-4 py-2 rounded-md"
                onClick={() => setIsOpen(false)}
              >
                {t.shop}
              </Link>
              <Link
                href="/cart"
                className="hover:bg-gradient-to-r hover:from-[var(--accent-start)] hover:to-[var(--accent-end)] hover:text-primary-foreground transition-all duration-300 text-lg font-medium flex items-center gap-2 px-4 py-2 rounded-md"
                onClick={() => setIsOpen(false)}
              >
                <ShoppingCart size={20} />
                {t.cart.replace("{count}", cart.length)}
              </Link>
              {user ? (
                <Button
                  variant="ghost"
                  onClick={handleLogout}
                  className="hover:bg-gradient-to-r hover:from-[var(--accent-start)] hover:to-[var(--accent-end)] hover:text-primary-foreground transition-all duration-300 text-lg font-medium flex items-center gap-2 px-4 py-2 rounded-md"
                >
                  <User size={20} />
                  {t.signOut}
                </Button>
              ) : (
                <Link
                  href="/auth/signin"
                  className="hover:bg-gradient-to-r hover:from-[var(--accent-start)] hover:to-[var(--accent-end)] hover:text-primary-foreground transition-all duration-300 text-lg font-medium flex items-center gap-2 px-4 py-2 rounded-md"
                  onClick={() => setIsOpen(false)}
                >
                  <User size={20} />
                  {t.signIn}
                </Link>
              )}
            </motion.nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
