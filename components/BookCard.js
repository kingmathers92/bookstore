"use client";

import { useState, useEffect, memo } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useStore } from "@/lib/store";
import { ShoppingCart, Star } from "lucide-react";
import Image from "next/image";
import translations from "@/lib/translations";

const BookCard = ({
  id,
  title_en,
  title_ar,
  category_en,
  category_ar,
  price,
  image,
  inStock,
}) => {
  const addToCart = useStore((state) => state.addToCart);
  const { language } = useStore();
  const [imgSrc, setImgSrc] = useState(image || "/images/placeholder.png");
  const t = translations[language];

  const displayBook = {
    book_id: id,
    title: language === "ar" ? title_ar || title_en : title_en || title_ar,
    price,
    image: imgSrc,
    inStock: inStock !== undefined ? inStock : true,
    category:
      language === "ar"
        ? category_ar || category_en
        : category_en || category_ar,
  };

  if (!displayBook) return <Skeleton className="w-full h-56" />;

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
  const safeCategory = displayBook.category?.toLowerCase();
  const mappedCategory =
    categoryMap[safeCategory] || safeCategory || "uncategorized";
  const badgeColor = categoryColors[mappedCategory] || categoryColors.default;

  const stockText =
    language === "ar"
      ? inStock
        ? "متوفر"
        : "غير متوفر"
      : inStock
      ? "In Stock"
      : "Sold Out";
  const stockColor = inStock ? "bg-green-600" : "bg-red-600";
  const stockTextColor = "text-white";

  return (
    <motion.div
      initial={{ scale: 1 }}
      whileHover={{
        scale: 1.03,
        boxShadow: "0 8px 16px rgba(212, 190, 131, 0.2)",
      }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="group relative"
      aria-label={`${t.bookCardPrice.replace("{price}", displayBook.price)} - ${
        displayBook.title
      }`}
      style={{ height: "100%", minHeight: "400px" }}
    >
      <Card className="border-t-4 border-primary overflow-hidden transition-all duration-200 hover:border-accent hover:shadow-md h-full flex flex-col">
        <CardHeader
          className="p-0 relative flex-shrink-0 overflow-hidden"
          style={{ height: "224px", position: "relative" }}
        >
          <Image
            src={imgSrc.trimEnd()}
            alt={`${displayBook.title} book cover`}
            width={300}
            height={224}
            className="w-full h-full object-cover rounded-t-lg"
            loading="lazy"
            onError={() => setImgSrc("/images/placeholder.png")}
          />
          <div
            className={`absolute top-2 left-2 px-3 py-1 text-xs font-semibold text-white rounded-full ${badgeColor} shadow-md transition-all duration-200 group-hover:scale-105`}
            style={{ zIndex: 10, maxWidth: "calc(100% - 16px)" }}
          >
            {displayBook.category || "Uncategorized"}
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-primary/20 via-transparent to-transparent opacity-0 group-hover:opacity-80 transition-opacity duration-200" />
        </CardHeader>
        <CardContent
          className="p-4 bg-card/95 flex-grow flex flex-col justify-between overflow-hidden relative"
          style={{ height: "176px" }}
        >
          <div>
            <CardTitle className="text-xl font-bold text-foreground mb-2 line-clamp-2 drop-shadow-sm">
              {displayBook.title}
            </CardTitle>
            <p className="text-lg text-muted-foreground mb-4 font-medium">
              {t.bookCardPrice.replace("{price}", displayBook.price || 0)}
            </p>
          </div>
          <div>
            <Button
              className="bg-primary text-primary-foreground hover:bg-accent hover:shadow-sm w-full flex items-center gap-2 mb-8 transition-all duration-200 rounded-lg"
              onClick={() => addToCart(displayBook)}
              disabled={!displayBook.inStock}
            >
              <ShoppingCart size={18} /> {t.bookCardAddToCart}
            </Button>
            {displayBook.reviews && displayBook.reviews.length > 0 && (
              <div className="flex items-center gap-2 text-yellow-500 mt-2">
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
          </div>
          <div
            className={`absolute bottom-2 right-2 px-3 py-1 text-xs font-semibold rounded-full ${stockColor} ${stockTextColor} shadow-md transition-all duration-200`}
            style={{ zIndex: 10, maxWidth: "calc(100% - 16px)" }}
          >
            {stockText}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default memo(BookCard);
