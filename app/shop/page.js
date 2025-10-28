"use client";

import React, { useMemo } from "react";
import BookCard from "@/components/BookCard";
import SearchBar from "@/components/SearchBar";
import CategoryFilter from "@/components/CategoryFilter";
import PriceRangeFilter from "@/components/PriceRangeFilter";
import { useStore } from "@/lib/store";
import { supabase } from "@/lib/supabase";
import LoadingSpinner from "@/components/LoadingSpinner";
import translations from "@/lib/translations";
import useSWR from "swr";

const fetcher = async () => {
  const { data, error } = await supabase
    .from("books")
    .select(`
      book_id,
      title_en,
      title_ar,
      category_en,
      category_ar,
      price,
      priceBeforeDiscount,
      image,
      inStock,
      author_en,
      author_ar,
      publishing_house_en,
      publishing_house_ar
    `)
    .order("book_id", { ascending: true })
    .limit(50);

  if (error) throw new Error(`Error fetching books: ${error.message}`);
  return data || [];
};

export default function Shop() {
  const {
    searchQuery = "",
    category = "all",
    priceRange = [0, 1000],
    language,
    isTyping = false,
  } = useStore();
  const {
    data: books,
    error,
    isLoading,
  } = useSWR("books", fetcher, {
    refreshInterval: 300000,
  });
  const t = translations[language] || translations.ar;

  const filteredBooks = useMemo(() => {
    if (!books) return [];

    const query = (searchQuery || "").toLowerCase().trim();
    const titleField = language === "ar" ? "title_ar" : "title_en";
    const categoryField = language === "ar" ? "category_ar" : "category_en";

    return books.filter((book) => {
      const title = (book[titleField] || "").toString().toLowerCase();
      const bookCategory = book[categoryField] || "";

      return (
        title.includes(query) &&
        (category === "all" || bookCategory === category) &&
        (book.price == null || (book.price >= priceRange[0] && book.price <= priceRange[1]))
      );
    });
  }, [books, searchQuery, category, priceRange, language]);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div className="text-center py-12 text-red-500">Error: {error.message}</div>;

  return (
    <div dir={language === "ar" ? "rtl" : "ltr"} className="mt-8">
      <section className="container mx-auto py-12 px-4" aria-label={t.title}>
        <h2 className="text-4xl font-bold text-center mb-8 text-burgundy md:text-5xl font-serif">
          {t.title}
        </h2>

        <div className="flex flex-col sm:flex-row gap-4 mb-8 md:gap-6">
          <SearchBar />
          <CategoryFilter />
          <PriceRangeFilter />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
          {filteredBooks.length > 0 ? (
            filteredBooks.map((book) => (
              <BookCard
                key={book.book_id}
                id={book.book_id}
                title_en={book.title_en}
                title_ar={book.title_ar}
                category_en={book.category_en}
                category_ar={book.category_ar}
                price={book.price || 0}
                priceBeforeDiscount={book.priceBeforeDiscount || 0}
                image={book.image}
                inStock={book.inStock}
                author_en={book.author_en}
                author_ar={book.author_ar}
                publishing_house_en={book.publishing_house_en}
                publishing_house_ar={book.publishing_house_ar}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-12 text-warm-gray-600 font-serif">
              {t.noBooksFound || "لا توجد كتب تطابق بحثك"}
            </div>
          )}
        </div>

        {isTyping && (
          <div className="text-center text-muted-foreground mt-6 flex items-center justify-center">
            <span className="dot-flashing"></span>
            <span className="dot-flashing" style={{ animationDelay: "0.2s" }}></span>
            <span className="dot-flashing" style={{ animationDelay: "0.4s" }}></span>
            <span className="ml-2">{language === "ar" ? "جاري الكتابة..." : "Typing..."}</span>
          </div>
        )}
      </section>
    </div>
  );
}
