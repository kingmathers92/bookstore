"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { useStore } from "@/lib/store";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import translations from "@/lib/translations";
import Image from "next/image";

export default function BookOfTheDay() {
  const { language } = useStore();
  const t = translations[language] || {};
  const [bookOfTheDay, setBookOfTheDay] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const { data: books, error } = await supabase.from("books").select("*");
        if (error) throw error;

        const availableBooks = books.filter((b) => b.inStock !== false);
        if (!availableBooks.length) return setBookOfTheDay(null);

        const today = new Date().toDateString();
        const seed =
          today.split("").reduce((a, c) => a + c.charCodeAt(0), 0) % availableBooks.length;
        const book = availableBooks[seed];

        setBookOfTheDay({
          title:
            language === "ar" ? book.title_ar || book.title_en : book.title_en || book.title_ar,
          price: book.price || 0,
          category_en: book.category_en,
          category_ar: book.category_ar,
          image: book.image || "/images/placeholder.png",
          inStock: book.inStock !== undefined ? book.inStock : true,
        });
      } catch (err) {
        console.error("Error fetching book:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [language]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-64 text-gray-500 text-sm sm:text-base">
        Loading...
      </div>
    );

  if (!bookOfTheDay)
    return (
      <div className="flex justify-center items-center h-64 text-gray-500 text-sm sm:text-base">
        No books available today.
      </div>
    );

  const stockText =
    language === "ar"
      ? bookOfTheDay.inStock
        ? "متوفر"
        : "غير متوفر"
      : bookOfTheDay.inStock
        ? "In Stock"
        : "Sold Out";

  return (
    <motion.div
      className="w-full flex justify-center items-center px-2 sm:px-0"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
    >
      <Card className="w-full max-w-[260px] sm:max-w-[300px] bg-white shadow-lg hover:shadow-2xl transition-all duration-300 rounded-xl overflow-hidden relative group">
        <div className="relative w-full aspect-[3/4] bg-muted">
          <Image
            src={bookOfTheDay.image}
            alt={bookOfTheDay.title}
            fill
            sizes="(max-width: 640px) 100vw, 300px"
            className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-2 left-2 bg-burgundy text-white text-xs font-semibold px-2 py-1 rounded-full shadow">
            {language === "ar"
              ? bookOfTheDay.category_ar || "غير مصنف"
              : bookOfTheDay.category_en || "Uncategorized"}
          </div>
        </div>

        <CardContent className="p-3 sm:p-4 text-center space-y-2">
          <h4 className="font-semibold text-base sm:text-lg text-gray-900 truncate">
            {bookOfTheDay.title}
          </h4>
          <p className="text-xs sm:text-sm text-gray-600 mb-2">
            {t.price || "Price"}: {bookOfTheDay.price} د.ت
          </p>
          <Button
            asChild
            className="w-full bg-burgundy text-white hover:bg-burgundy-dark transition-all text-xs sm:text-sm py-2 sm:py-3"
          >
            <Link href="/shop">
              <Eye size={14} className="mr-1" />
              {t.bookOfTheDayViewDetails || "View Details"}
            </Link>
          </Button>
          <div
            className={`absolute top-2 right-2 px-2 py-1 text-[10px] sm:text-xs font-bold rounded-full ${
              bookOfTheDay.inStock ? "bg-green-600" : "bg-red-600"
            } text-white`}
          >
            {stockText}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
