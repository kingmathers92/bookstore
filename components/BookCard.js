"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useStore } from "@/lib/store";
import { ShoppingCart, Star } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function BookCard({ id }) {
  const addToCart = useStore((state) => state.addToCart);
  const [book, setBook] = useState(null);

  useEffect(() => {
    const fetchBook = async () => {
      const { data, error } = await supabase
        .from("books")
        .select("*")
        .eq("id", id)
        .single();
      if (error) console.error(error);
      else setBook(data);
    };
    fetchBook();
  }, [id]);

  if (!book) return <Skeleton className="w-full h-56" />;

  return (
    <motion.div
      whileHover={{ scale: 1.05, rotate: 0.5 }}
      transition={{ duration: 0.4 }}
      aria-label={`كتاب ${book.title} بسعر ${book.price} ر.س`}
    >
      <Card className="border-t-4 border-gold-300 overflow-hidden">
        <CardHeader>
          <img
            src={book.image}
            alt={book.alt}
            className="w-full h-56 object-cover rounded-t-lg"
            loading="lazy"
            onError={(e) => {
              e.target.src = "/images/placeholder.png";
            }}
          />
        </CardHeader>
        <CardContent className="p-4">
          <CardTitle className="text-xl font-semibold text-gray-800 mb-2">
            {book.title}
          </CardTitle>
          <p className="text-gray-600 mb-4">{`${book.price} ر.س`}</p>
          <Button
            className="bg-emerald-700 text-cream-100 hover:bg-green-900 w-full flex items-center gap-2 mb-2"
            onClick={() => addToCart(book)}
          >
            <ShoppingCart size={16} /> أضف إلى السلة
          </Button>
          {book.reviews && book.reviews.length > 0 && (
            <div className="flex items-center gap-1 text-yellow-500">
              <Star size={16} />
              <span>{book.reviews[0].rating.toFixed(1)}</span>
              <span className="text-gray-600 text-sm ml-1">
                ({book.reviews[0].comment})
              </span>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
