"use client";

import { useState, memo, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useStore } from "@/lib/store";
import { ShoppingCart, Heart, Eye } from "lucide-react";
import { showSuccess, showError } from "@/components/Toast";
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
  const { addToWishlist, wishlist } = useStore();
  const [isLiked, setIsLiked] = useState(false);
  const [quantity, setQuantity] = useState(1);

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

  if (!displayBook) return <Skeleton className="w-full h-96" />;

  const priceValue = price === null || price === undefined || price === 0 ? null : price;
  const priceBeforeValue =
    priceBeforeDiscount === null || priceBeforeDiscount === undefined || priceBeforeDiscount === 0
      ? null
      : priceBeforeDiscount;

  const currentPrice = priceValue ?? priceBeforeValue;

  const hasDiscount =
    priceValue !== null && priceBeforeValue !== null && priceBeforeValue > priceValue;

  const discountPercentage = hasDiscount
    ? Math.round(((priceBeforeValue - priceValue) / priceBeforeValue) * 100)
    : null;

  const handleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const result = await addToWishlist(id);

    if (result.success) {
      setIsLiked(true);
      showSuccess("تمت الإضافة إلى قائمة الأمنيات");
    } else {
      showError(result.error || "فشل في الإضافة");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="group relative"
    >
      <Card className="overflow-hidden bg-white elegant-border hover:elegant-shadow-lg transition-all duration-300 h-full flex flex-col p-0">
        <div className="relative h-90 bg-white">
          <Link href={`/book/${id}`} prefetch>
            <Image
              src={imgSrc}
              alt={displayBook.title}
              fill
              className="object-top"
              sizes="(max-width: 768px) 100vw, 300px"
              onError={() => setImgSrc("/images/placeholder.png")}
            />
          </Link>

          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

          <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-auto">
            <Button
              size="sm"
              variant="secondary"
              className="w-10 h-10 rounded-full bg-white/90 hover:bg-white shadow-lg"
              onClick={handleWishlist}
            >
              <Heart
                size={16}
                className={`${isLiked ? "text-red-500 fill-current" : "text-gray-600"}`}
              />
            </Button>
            <Button
              size="sm"
              variant="secondary"
              className="w-10 h-10 rounded-full bg-white/90 hover:bg-white shadow-lg"
            >
              <Eye size={16} className="text-gray-600" />
            </Button>
          </div>
          <div className="absolute bottom-4 left-4">
            <CategoryBadge category={displayBook.category} />
          </div>
        </div>

        <CardContent className="flex flex-col flex-grow p-6 space-y-4">
          <div className="space-y-2">
            <Link href={`/book/${id}`} prefetch>
              <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 hover:text-burgundy transition-colors font-serif">
                {displayBook.title}
              </h3>
            </Link>

            {displayBook.author && (
              <p className="text-sm text-gray-600">
                {t.bookCardAuthor || t.Author}: {displayBook.author}
              </p>
            )}

            {displayBook.publishingHouse && (
              <p className="text-xs text-gray-500">
                {t.bookCardPublisher || t.Publisher}: {displayBook.publishingHouse}
              </p>
            )}
          </div>

          <div className="space-y-2 mt-auto">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                {hasDiscount && (
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400 line-through text-sm">
                      {t.bookCardPrice.replace("{price}", displayBook.priceBeforeDiscount)}
                    </span>
                    <span className="bg-green-100 text-green-700 text-xs font-semibold px-2 py-0.5 rounded-md">
                      -{discountPercentage}%
                    </span>
                  </div>
                )}
                {currentPrice && (
                  <p className="text-xl font-bold text-burgundy font-serif">{currentPrice} د.ت</p>
                )}
              </div>
              <StockStatus inStock={displayBook.inStock} language={language} />
            </div>

            <Button
              className="w-full bg-burgundy hover:bg-burgundy-dark text-white rounded-xl py-3 font-semibold elegant-shadow hover-lift transition-all duration-300 flex items-center justify-center gap-2"
              onClick={() => addToCart({ ...displayBook, quantity })}
              disabled={!displayBook.inStock}
            >
              <ShoppingCart size={18} />
              {t.bookCardAddToCart}
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default memo(BookCard);
