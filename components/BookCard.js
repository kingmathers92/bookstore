"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useStore } from "@/lib/store";
import { ShoppingCart, Star } from "lucide-react";
import { supabase } from "@/lib/supabase";
import translations from "@/lib/translations";

export default function BookCard({ id, title, price, image, alt, category }) {
  const addToCart = useStore((state) => state.addToCart);
  const { language } = useStore();
  const [book, setBook] = useState(null);
  const t = translations[language];

  useEffect(() => {
    const fetchBook = async () => {
      if (!id) {
        console.error("ID is undefined");
        return;
      }
      const { data, error } = await supabase
        .from("books")
        .select("*")
        .eq("id", id)
        .single();
      if (error) {
        console.error("Error fetching book:", error);
      } else {
        console.log("Fetched book data:", data);
        setBook(data);
      }
    };
    fetchBook();
  }, [id]);

  const displayBook = book || {
    title,
    price,
    image,
    alt,
    category: category || "uncategorized",
  };

  if (!displayBook) return <Skeleton className="w-full h-56" />;

  const categoryColors = {
    tafsir: "bg-primary",
    hadith: "bg-accent",
    fiqh: "bg-muted",
    biography: "bg-secondary",
    uncategorized: "bg-primary/50",
    default: "bg-primary/50",
  };
  const safeCategory = displayBook.category
    ? displayBook.category.toLowerCase()
    : "uncategorized";
  const badgeColor = categoryColors[safeCategory] || categoryColors.default;

  return (
    <motion.div
      whileHover={{
        scale: 1.05,
        boxShadow: "0 12px 24px rgba(212, 190, 131, 0.3)",
      }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="group"
      aria-label={`${t.bookCardPrice.replace("{price}", displayBook.price)} - ${
        displayBook.title
      }`}
    >
      <Card className="border-t-4 border-primary overflow-hidden transition-all duration-300 hover:border-accent hover:shadow-xl">
        <CardHeader className="p-0 relative">
          <img
            src={displayBook.image}
            alt={displayBook.alt}
            className="w-full h-56 object-cover rounded-t-lg"
            loading="lazy"
            onError={(e) => {
              e.target.src = "/images/placeholder.png";
            }}
          />
          <div
            className={`absolute top-2 left-2 px-3 py-1 text-xs font-semibold text-primary-foreground rounded-full ${badgeColor} shadow-lg transition-all duration-300 group-hover:scale-110`}
          >
            {displayBook.category || "Uncategorized"}
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-primary/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="absolute inset-0 border-2 border-primary/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse-slow" />
        </CardHeader>
        <CardContent className="p-4 bg-card/95 backdrop-blur-sm">
          <CardTitle className="text-xl font-bold text-foreground mb-2 line-clamp-2 drop-shadow-sm">
            {displayBook.title}
          </CardTitle>
          <p className="text-lg text-muted-foreground mb-4 font-medium">
            {t.bookCardPrice.replace("{price}", displayBook.price || 0)} ر.س
          </p>
          <Button
            className="bg-primary text-primary-foreground hover:bg-accent hover:shadow-md w-full flex items-center gap-2 mb-2 transition-all duration-300 rounded-lg"
            onClick={() => addToCart(displayBook)}
          >
            <ShoppingCart size={18} /> {t.bookCardAddToCart}
          </Button>
          {displayBook.reviews && displayBook.reviews.length > 0 && (
            <div className="flex items-center gap-2 text-yellow-500 mt-3">
              <Star size={18} />
              <span className="text-sm font-medium">
                {t.bookCardReviewRating.replace(
                  "{rating}",
                  displayBook.reviews[0].rating.toFixed(1)
                )}
              </span>
              <span className="text-muted-foreground text-xs line-clamp-1">
                {t.bookCardReviewComment.replace(
                  "{comment}",
                  displayBook.reviews[0].comment
                )}
              </span>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
