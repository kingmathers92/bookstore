"use client";

import dynamic from "next/dynamic";

export default function CartPage() {
  const Cart = dynamic(() => import("@/components/Cart"), { ssr: false });
  return <Cart />;
}
