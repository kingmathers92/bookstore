"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { useStore } from "@/lib/store";
import { supabase } from "@/lib/supabase";
import Image from "next/image";

export default function BookOfTheDay() {
  const { language } = useStore();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const { data } = await supabase.from("books").select("*");
        const inStock = data?.filter((b) => b.inStock !== false) || [];
        if (!inStock.length) return setBook(null);

        const seed = new Date().getDate() % inStock.length;
        const selected = inStock[seed];

        setBook({
          id: selected.book_id,
          title:
            language === "ar"
              ? selected.title_ar || selected.title_en
              : selected.title_en || selected.title_ar,
          price: selected.price || 0,
          oldPrice: selected.priceBeforeDiscount || 0,
          image: selected.image || "/placeholder.jpg",
          category: language === "ar" ? selected.category_ar : selected.category_en,
          inStock: selected.inStock !== false,
        });
      } catch (err) {
        console.error("BookOfTheDay error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBook();
  }, [language]);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <span className="text-gray-400 text-sm">...</span>
      </div>
    );
  }
  if (!book) return null;

  return (
    <div className="relative w-full h-full">
      <Image
        src={book.image}
        alt={book.title}
        fill
        sizes="(max-width: 768px) 100vw, 400px"
        className="object-cover object-center"
        priority
      />

      <div className="absolute top-3 left-3 bg-burgundy text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-md">
        {book.category || (language === "ar" ? "غير مصنف" : "Uncategorized")}
      </div>
      <div
        className={`absolute top-3 right-3 px-2.5 py-1 text-xs font-bold rounded-full text-white shadow-md ${
          book.inStock ? "bg-green-600" : "bg-red-600"
        }`}
      >
        {language === "ar" ? (book.inStock ? "متوفر" : "نفد") : book.inStock ? "In Stock" : "Out"}
      </div>
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 text-white">
        <h4 className="font-bold text-base line-clamp-2 leading-tight mb-1">{book.title}</h4>
        <div className="flex items-center gap-2">
          <span className="text-base font-bold">{book.price} د.ت</span>
          {book.oldPrice > book.price && (
            <span className="text-xs line-through opacity-75">{book.oldPrice} د.ت</span>
          )}
        </div>
        <Button
          asChild
          size="sm"
          className="mt-2 w-full bg-white text-burgundy hover:bg-gray-100 rounded-lg text-xs font-medium py-4 hover:cursor-pointer"
        >
          <Link href={`/book/${book.id}`} className="flex items-center justify-center gap-1.5">
            <Eye size={14} />
            {language === "ar" ? "عرض" : "View"}
          </Link>
        </Button>
      </div>
    </div>
  );
}
