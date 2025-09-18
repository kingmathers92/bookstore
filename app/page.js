"use client";

import Hero from "@/components/Hero";
import BookCard from "@/components/BookCard";
import SearchBar from "@/components/SearchBar";
import CategoryFilter from "@/components/CategoryFilter";
import BookOfTheDay from "@/components/BookOfTheDay";
import { useStore } from "@/lib/store";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import LoadingSpinner from "@/components/LoadingSpinner";
import translations from "@/lib/translations";

export default function Home() {
  const { searchQuery, category, priceRange, language } = useStore();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const t = translations[language];

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      const { data, error, status } = await supabase
        .from("books")
        .select("*")
        .order("book_id", { ascending: true });
      console.log("Fetch response:", { data, error, status }); // logged api status to debug why books weren't being displayed
      if (error) {
        console.error(
          "Error fetching books:",
          error.message,
          "Status:",
          status
        );
      } else {
        console.log("Fetched books:", data);
        setBooks(data || []);
      }
      setLoading(false);
    };
    fetchBooks();
  }, []);

  console.log("Filter conditions:", { searchQuery, category, priceRange });
  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (category === "all" || book.category === category) &&
      (book.price == null ||
        (book.price >= priceRange[0] && book.price <= priceRange[1]))
  );

  console.log("Filtered books:", filteredBooks);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen">
      <Hero />
      <BookOfTheDay />
      <section className="container mx-auto py-12 px-4" aria-label={t.title}>
        <h2 className="text-4xl font-bold text-center mb-8 text-primary hover:text-accent md:text-5xl transition-colors">
          {t.title}
        </h2>
        <div className="flex flex-col sm:flex-row gap-4 mb-8 md:gap-6">
          <SearchBar />
          <CategoryFilter />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
          {filteredBooks.length > 0 ? (
            filteredBooks.map((book) => (
              <BookCard
                key={book.book_id}
                id={book.book_id}
                title={book.title}
                price={book.price || 0}
                image={book.image}
                inStock={book.inStock}
              />
            ))
          ) : (
            <div className="text-center py-12 text-foreground">
              {t.noBooksFound}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
