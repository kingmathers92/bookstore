"use client";

import Hero from "@/components/Hero";
import BookCard from "@/components/BookCard";
import SearchBar from "@/components/SearchBar";
import CategoryFilter from "@/components/CategoryFilter";
import { useStore } from "@/lib/store";

export default function Home() {
  const { searchQuery, category, priceRange } = useStore();
  const books = [
    {
      id: 1,
      title: "كتاب إسلامي 1",
      price: 50,
      category: "quran",
      image: "/images/book1.jpg",
      alt: "غلاف كتاب إسلامي 1",
    },
    {
      id: 2,
      title: "كتاب إسلامي 2",
      price: 60,
      category: "hadith",
      image: "/images/book2.jpg",
      alt: "غلاف كتاب إسلامي 2",
    },
    {
      id: 3,
      title: "كتاب إسلامي 3",
      price: 40,
      category: "tafsir",
      image: "/images/book3.jpg",
      alt: "غلاف كتاب إسلامي 3",
    },
  ].filter(
    (book) =>
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (category === "all" || book.category === category) &&
      book.price >= priceRange[0] &&
      book.price <= priceRange[1]
  );

  return (
    <div className="min-h-screen">
      <Hero />
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
          {books.map((book) => (
            <BookCard
              key={book.id}
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
