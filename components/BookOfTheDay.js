"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Eye } from "lucide-react";
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
    const fetchAndSetBookOfTheDay = async () => {
      setLoading(true);
      try {
        const { data: books, error } = await supabase
          .from("books")
          .select("*")
          .order("book_id", { ascending: true });

        if (error) {
          console.error("Error fetching books:", error.message);
          setLoading(false);
          return;
        }

        if (books && books.length > 0) {
          // if book not in stock it cant be book of the day
          const availableBooks = books.filter((book) => book.inStock !== false);
          if (availableBooks.length === 0) {
            setBookOfTheDay(null);
            setLoading(false);
            return;
          }

          const today = new Date().toDateString();
          const seed =
            today.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) %
            availableBooks.length;
          const randomBook = availableBooks[seed] || availableBooks[0];
          setBookOfTheDay({
            title:
              language === "ar"
                ? randomBook.title_ar || randomBook.title_en
                : randomBook.title_en || randomBook.title_ar,
            price: randomBook.price || 0,
            category_en: randomBook.category_en,
            category_ar: randomBook.category_ar,
            image: randomBook.image || "/images/placeholder.png",
            inStock: randomBook.inStock !== undefined ? randomBook.inStock : true,
          });
        }
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAndSetBookOfTheDay();
  }, [language]);

  const bookOfTheDayPrice = t.bookOfTheDayPrice || "Price: {price}";
  const formattedPrice = bookOfTheDayPrice.replace("{price}", `${bookOfTheDay?.price || 0}`);

  const categoryColors = {
    tafsir: "bg-primary",
    hadith: "bg-green-500",
    fiqh: "bg-yellow-500",
    biography: "bg-blue-600",
    uncategorized: "bg-gray-300",
    history: "bg-purple-500",
    default: "bg-gray-200",
  };
  const categoryMap = {
    تفسير: "tafsir",
    حديث: "hadith",
    فقه: "fiqh",
    سيرة: "biography",
  };
  const safeCategory =
    (language === "ar" ? bookOfTheDay?.category_ar : bookOfTheDay?.category_en)?.toLowerCase() ||
    "uncategorized";
  const mappedCategory = categoryMap[safeCategory] || safeCategory || "uncategorized";
  const badgeColor = categoryColors[mappedCategory] || categoryColors.default;

  const stockText =
    language === "ar"
      ? bookOfTheDay?.inStock
        ? "متوفر"
        : "غير متوفر"
      : bookOfTheDay?.inStock
        ? "In Stock"
        : "Sold Out";
  const stockColor = bookOfTheDay?.inStock ? "bg-green-600" : "bg-red-600";
  const stockTextColor = "text-white";

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (!bookOfTheDay)
    return <div className="text-center py-8 text-foreground">No books available today.</div>;

  return (
    <div className="container mx-auto py-8 text-center relative overflow-hidden">
      <motion.h3
        className="text-2xl font-bold text-primary mb-4 hover:text-accent transition-colors tracking-wide"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        aria-label={t.bookOfTheDay || "Book of the Day"}
      >
        {t.bookOfTheDay || "Book of the Day"}
      </motion.h3>
      <motion.div
        className="relative max-w-md mx-auto"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        <Card
          className="border-t-4 border-primary overflow-hidden shadow-2xl hover:shadow-3xl transition-shadow duration-300"
          style={{
            background:
              "linear-gradient(135deg, var(--header-gradient-start), var(--header-gradient-end))",
          }}
        >
          <CardHeader className="p-0 relative overflow-hidden">
            <div className="relative w-full h-48">
              <Image
                src={bookOfTheDay?.image}
                alt={bookOfTheDay?.title || t.bookOfTheDay || "Book of the Day"}
                width={400}
                height={192}
                className="w-full h-full object-cover rounded-t-lg"
                loading="lazy"
                placeholder="blur"
                blurDataURL="/images/placeholder.png"
              />
              <div
                className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,215,0,0.2),transparent_50%)] opacity-70"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at top, rgba(255,215,0,0.2), transparent 50%)",
                  width: "100%",
                  height: "100%",
                }}
              />
              <div
                className="absolute inset-0 border-4 border-primary/50 rounded-t-lg animate-pulse-slow"
                style={{ width: "100%", height: "100%" }}
              />
              <div
                className={`absolute top-2 left-2 px-2 py-1 text-xs font-semibold text-white rounded-full ${badgeColor} shadow-md transition-all duration-200 hover:scale-105`}
                style={{ zIndex: 10, maxWidth: "calc(100% - 16px)" }}
              >
                {language === "ar"
                  ? bookOfTheDay?.category_ar || bookOfTheDay?.category_en || "Uncategorized"
                  : bookOfTheDay?.category_en || bookOfTheDay?.category_ar || "Uncategorized"}
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6 text-left bg-card/80 backdrop-blur-sm relative flex flex-col justify-between h-full">
            <div>
              <CardTitle className="text-xl md:text-2xl font-extrabold text-primary-foreground mb-3 drop-shadow-md">
                {bookOfTheDay?.title || "تفسير الجلالين"}
              </CardTitle>
              <p className="text-lg text-primary-foreground mb-4">{formattedPrice}</p>
              <div className="flex items-center gap-2 text-muted-foreground mb-4">
                <Clock size={18} />
                <span className="text-sm">
                  {t.bookOfTheDayCheckLater || "Check later for details"}
                </span>
              </div>
              <Button
                className="bg-primary text-primary-foreground hover:bg-accent hover:text-accent-foreground hover:shadow-md transition-all duration-300 flex items-center gap-2 w-full md:w-auto mb-4"
                asChild
              >
                <Link href="/shop">
                  <Eye size={18} /> {t.bookOfTheDayViewDetails || "View Details"}
                </Link>
              </Button>
              <div
                className={`absolute bottom-2 right-2 px-3 py-1 text-xs font-semibold rounded-full ${stockColor} ${stockTextColor} shadow-md transition-all duration-200`}
              >
                {stockText}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
