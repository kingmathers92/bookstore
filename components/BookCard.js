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

export default function BookCard({ id, title, price, image, alt }) {
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

  const addBook = async () => {
    const { error } = await supabase.from("books").insert({
      title: "كتاب إسلامي جديد",
      price: 40,
      category: "tafsir",
      image: "/images/book3.jpg",
      alt: "غلاف كتاب إسلامي 3",
    });
    if (error) console.error("Error adding book:", error);
    else alert(t.bookCardAddNewBook);
  };

  const displayBook = book || { title, price, image, alt };

  if (!displayBook) return <Skeleton className="w-full h-56" />;

  return (
    <motion.div
      whileHover={{ scale: 1.05, rotate: 0.5 }}
      transition={{ duration: 0.4 }}
      aria-label={`${t.bookCardPrice.replace("{price", displayBook.price)} - ${
        displayBook.title
      }`}
    >
      <Card className="border-t-4 border-primary overflow-hidden hover:shadow-xl transition-shadow">
        <CardHeader>
          <img
            src={displayBook.image}
            alt={displayBook.alt}
            className="w-full h-56 object-cover rounded-t-lg"
            loading="lazy"
            onError={(e) => {
              e.target.src = "/images/placeholder.png";
            }}
          />
        </CardHeader>
        <CardContent className="p-4">
          <CardTitle className="text-xl font-semibold text-foreground mb-2">
            {displayBook.title}
          </CardTitle>
          <p className="text-muted-foreground mb-4">
            {t.bookCardPrice.replace("{price}", displayBook.price)}
          </p>
          <Button
            className="bg-primary text-primary-foreground hover:bg-accent w-full flex items-center gap-2 mb-2"
            onClick={() => addToCart(displayBook)}
          >
            <ShoppingCart size={16} /> {t.bookCardAddToCart}
          </Button>
          <Button
            className="bg-muted text-muted-foreground hover:bg-accent w-full mt-2"
            onClick={addBook}
          >
            {t.bookCardAddNewBook}
          </Button>
          {displayBook.reviews && displayBook.reviews.length > 0 && (
            <div className="flex items-center gap-1 text-yellow-500 mt-2">
              <Star size={16} />
              <span>
                {t.bookCardReviewRating.replace(
                  "{rating}",
                  displayBook.reviews[0].rating.toFixed(1)
                )}
              </span>
              <span className="text-muted-foreground text-sm ml-1">
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
