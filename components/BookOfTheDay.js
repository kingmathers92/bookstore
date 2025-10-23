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

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (!bookOfTheDay)
    return <div className="text-center py-8 text-foreground">No books available today.</div>;

  const stockText =
    language === "ar"
      ? bookOfTheDay.inStock
        ? "متوفر"
        : "غير متوفر"
      : bookOfTheDay.inStock
        ? "In Stock"
        : "Sold Out";

  return (
    <div className="container mx-auto py-12 text-center">
      <motion.h3
        className="text-3xl font-bold text-burgundy mb-8 tracking-wide font-serif"
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        كتاب اليوم
      </motion.h3>

      <motion.div
        className="flex justify-center"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
      >
        <Card className="w-64 md:w-72 bg-white shadow-lg hover:shadow-2xl transition-all duration-300 rounded-xl overflow-hidden relative group">
          <div className="relative w-full h-80 bg-gray-100">
            <img
              src={bookOfTheDay.image || "/images/placeholder.png"}
              alt={bookOfTheDay.title_ar || bookOfTheDay.title_en}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute top-2 left-2 bg-burgundy text-white text-xs font-semibold px-2 py-1 rounded-full shadow">
              {bookOfTheDay.category_ar || bookOfTheDay.category_en || "غير مصنف"}
            </div>
            <div
              className={`absolute top-2 right-2 px-2 py-1 text-xs font-bold rounded-full ${
                bookOfTheDay.inStock ? "bg-green-600" : "bg-red-600"
              } text-white`}
            >
              {bookOfTheDay.inStock ? "متوفر" : "غير متوفر"}
            </div>
          </div>

          <CardContent className="p-4 text-center">
            <h4 className="font-semibold text-lg text-gray-900 truncate font-serif">
              {bookOfTheDay.title_ar || bookOfTheDay.title_en}
            </h4>
            <p className="text-sm text-gray-600 mb-3">السعر: {bookOfTheDay.price} ر.س</p>

            <Button className="w-full bg-burgundy text-white hover:bg-burgundy-dark transition-all">
              <Eye size={16} className="mr-2" />
              عرض التفاصيل
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
