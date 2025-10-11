"use client";

import React, { useMemo } from "react";
import BookOfTheDay from "@/components/BookOfTheDay";
import SearchBar from "@/components/SearchBar";
import CategoryFilter from "@/components/CategoryFilter";
import PriceRangeFilter from "@/components/PriceRangeFilter";
import { useStore } from "@/lib/store";
import { supabase } from "@/lib/supabase";
import LoadingSpinner from "@/components/LoadingSpinner";
import translations from "@/lib/translations";
import useSWR from "swr";
const BookCard = React.lazy(() => import("@/components/BookCard"));

const fetcher = async () => {
  const { data, error, status } = await supabase
    .from("books")
    .select("*")
    .order("book_id", { ascending: true })
    .limit(50);
  if (error) throw new Error(`Error fetching books: ${error.message}, Status: ${status}`);
  return data || [];
};

export default function Shop() {
  const { searchQuery, category, priceRange, language } = useStore();
  const {
    data: books,
    error,
    isLoading,
  } = useSWR("books", fetcher, {
    refreshInterval: 300000,
  });
  const t = translations[language];

  const filteredBooks = useMemo(() => {
    return (books || []).filter((book) => {
      const title =
        language === "ar" ? book.title_ar || book.title_en : book.title_en || book.title_ar;
      return (
        title?.toLowerCase().includes(searchQuery.toLowerCase()) &&
        (category === "all" || book.category_en === category) &&
        (book.price == null || (book.price >= priceRange[0] && book.price <= priceRange[1]))
      );
    });
  }, [books, searchQuery, category, priceRange, language]);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div>Error loading books: {error.message}</div>;

  return (
    <div>
      <BookOfTheDay />
      <section className="container mx-auto py-12 px-4 overflow-hidden" aria-label={t.title}>
        <h2 className="text-4xl font-bold text-center mb-8 text-primary hover:text-accent md:text-5xl transition-colors">
          {t.title}
        </h2>
        <div className="flex flex-col sm:flex-row gap-4 mb-8 md:gap-6">
          <SearchBar />
          <CategoryFilter />
          <PriceRangeFilter />
        </div>
        <React.Suspense fallback={<div>Loading books...</div>}>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6 overflow-hidden">
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
                  image={book.image}
                  inStock={book.inStock}
                />
              ))
            ) : (
              <div className="text-center py-12 text-foreground">{t.noBooksFound}</div>
            )}
          </div>
        </React.Suspense>
      </section>
    </div>
  );
}
