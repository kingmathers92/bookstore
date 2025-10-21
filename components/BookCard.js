"use client";

import { useState, memo } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useStore } from "@/lib/store";
import { ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import translations from "@/lib/translations";
import CategoryBadge from "./CategoryBadge";
import StockStatus from "./StockStatus";

const BookCard = ({
  id,
  title_en,
  title_ar,
  category_en,
  category_ar,
  price,
  priceBeforeDiscount,
  image,
  inStock,
  author_ar,
  author_en,
  publishing_house_ar,
  publishing_house_en,
}) => {
  const addToCart = useStore((state) => state.addToCart);
  const { language } = useStore();
  const [imgSrc, setImgSrc] = useState(image || "/images/placeholder.png");
  const t = translations[language];

  const displayBook = {
    book_id: id,
    title: language === "ar" ? title_ar || title_en : title_en || title_ar,
    price,
    priceBeforeDiscount,
    image: imgSrc,
    inStock: inStock !== undefined ? inStock : true,
    category: language === "ar" ? category_ar || category_en : category_en || category_ar,
    author: language === "ar" ? author_ar || author_en : author_en || author_ar,
    publishingHouse:
      language === "ar"
        ? publishing_house_ar || publishing_house_en
        : publishing_house_en || publishing_house_ar,
  };

  if (!displayBook) return <Skeleton className="w-full h-56" />;

  const discountPercentage =
    displayBook.priceBeforeDiscount && displayBook.priceBeforeDiscount > displayBook.price
      ? Math.round(
          ((displayBook.priceBeforeDiscount - displayBook.price) /
            displayBook.priceBeforeDiscount) *
            100,
        )
      : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{
        scale: 1.02,
        boxShadow: "0 8px 20px rgba(0, 0, 0, 0.08)",
      }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="group relative"
      aria-label={`${t.bookCardPrice.replace("{price}", displayBook.price)} - ${displayBook.title}`}
    >
      <Link href={`/book/${id}`} prefetch>
        <Card className="overflow-hidden border border-gray-200 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 flex flex-col cursor-pointer">
          <div className="relative w-full h-[260px] overflow-hidden rounded-t-xl">
            <Image
              src={imgSrc.trimEnd()}
              alt={`${displayBook.title} book cover`}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 300px"
              onError={() => setImgSrc("/images/placeholder.png")}
            />
            <CategoryBadge category={displayBook.category} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-80 transition-opacity duration-200" />
          </div>

          <CardContent className="flex flex-col justify-between p-4 flex-grow">
            <div>
              <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-1 line-clamp-1">
                {displayBook.title}
              </h3>
              <p className="text-sm text-gray-600 mb-1">
                {displayBook.author && `${t.bookCardAuthor || t.Author}: ${displayBook.author}`}
              </p>
              <p className="text-sm text-gray-600 mb-3">
                {displayBook.publishingHouse &&
                  `${t.bookCardPublisher || t.Publisher}: ${displayBook.publishingHouse}`}
              </p>
            </div>
            <div className="flex items-center justify-between mt-auto">
              <div className="space-y-1">
                {discountPercentage && (
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400 line-through text-sm">
                      {t.bookCardPrice.replace("{price}", displayBook.priceBeforeDiscount)}
                    </span>
                    <span className="bg-green-100 text-green-700 text-xs font-semibold px-2 py-0.5 rounded-md">
                      -{discountPercentage}%
                    </span>
                  </div>
                )}
                <p className="text-lg font-bold text-[#c0555f]">
                  {t.bookCardPrice.replace("{price}", displayBook.price || 0)}
                </p>
                <StockStatus inStock={displayBook.inStock} language={language} />
              </div>

              <Button
                className="bg-[#c0555f] hover:bg-[#a64852] text-white rounded-md px-4 py-2 flex items-center gap-2 transition-all duration-200"
                onClick={() => addToCart(displayBook)}
                disabled={!displayBook.inStock}
              >
                <ShoppingCart size={18} />
                {t.bookCardAddToCart}
              </Button>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
};

export default memo(BookCard);
