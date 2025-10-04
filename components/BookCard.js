"use client";

import { useState, memo } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useStore } from "@/lib/store";
import { ShoppingCart } from "lucide-react";
import Image from "next/image";
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
          <CategoryBadge category={displayBook.category} />
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
              className="bg-primary text-primary-foreground hover:bg-accent hover:text-accent-foreground hover:shadow-sm hover:cursor-pointer w-full flex items-center gap-2 mb-8 transition-all duration-200 rounded-lg"
              onClick={() => addToCart(displayBook)}
              disabled={!displayBook.inStock}
            >
              <ShoppingCart size={18} /> {t.bookCardAddToCart}
            </Button>
          </div>
          <StockStatus inStock={displayBook.inStock} language={language} />
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default memo(BookCard);
