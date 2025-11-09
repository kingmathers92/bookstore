"use client";

import { useEffect, useState } from "react";
import { useStore } from "@/lib/store";
import BookCard from "@/components/BookCard";
import { Skeleton } from "@/components/ui/skeleton";

export default function Wishlist() {
  const wishlist = useStore((state) => state.wishlist);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">My Wishlist</h1>

      {loading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-96 w-full" />
          ))}
        </div>
      ) : wishlist.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {wishlist.map((book) => (
            <BookCard key={book.book_id} {...book} />
          ))}
        </div>
      ) : (
        <p className="text-center py-12 text-gray-500">Your wishlist is empty</p>
      )}
    </div>
  );
}
