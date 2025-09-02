"use client";

import Link from "next/link";
import { useState } from "react";
import { useStore } from "@/lib/store";
import Cart from "@/components/Cart";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const { cart } = useStore();

  return (
    <header className="bg-green-900 text-cream-100 py-4 shadow-md">
      <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center px-4 gap-4 sm:gap-0">
        <h1 className="text-3xl font-bold text-gold-300">ثمرات الأوراق</h1>
        <button
          className="sm:hidden text-cream-100"
          onClick={() => setIsOpen(!isOpen)}
        >
          ☰
        </button>
        <nav
          className={`${
            isOpen ? "flex" : "hidden"
          } sm:flex flex-col sm:flex-row flex-wrap justify-center gap-4 sm:gap-6`}
        >
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
            className="hover:text-gold-300 transition-colors text-lg"
            onClick={() => setIsOpen(false)}
          >
            السلة ({cart.length})
          </Link>
          <Cart />
        </nav>
      </div>
    </header>
  );
}
