"use client";

import Hero from "@/components/Hero";
import BookCard from "@/components/BookCard";
import SearchBar from "@/components/SearchBar";
import CategoryFilter from "@/components/CategoryFilter";
import BookOfTheDay from "@/components/BookOfTheDay";
import { useStore } from "@/lib/store";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function Home() {
  const { searchQuery, category, priceRange } = useStore();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      const { data, error } = await supabase.from("books").select("*");
      if (error) {
        console.error("Error fetching books:", error);
      } else {
        setBooks(data || []);
      }
      setLoading(false);
    };
    fetchBooks();
  }, []);

  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (category === "all" || book.category === category) &&
      book.price >= priceRange[0] &&
      book.price <= priceRange[1]
  );

  if (loading) return <div className="text-center py-12">Loading...</div>;

  return (
    <div className="min-h-screen">
      <Hero />
      <BookOfTheDay />
      <section
        className="container mx-auto py-12 px-4"
        aria-label="قسم الكتب المميزة"
      >
        <h2 className="text-4xl font-bold text-center mb-8 text-green-900 md:text-5xl">
          الكتب المميزة
        </h2>
        <div className="flex flex-col sm:flex-row gap-4 mb-8 md:gap-6">
          <SearchBar />
          <CategoryFilter />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredBooks.map((book) => (
            <BookCard
              key={book.id}
              id={book.id}
              title={book.title}
              price={book.price}
              image={book.image}
              alt={book.alt}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
