import Hero from "@/components/Hero";
import BookCard from "@/components/BookCard";
import SearchBar from "@/components/SearchBar";
import CategoryFilter from "@/components/CategoryFilter";

export default function Home() {
  const books = [
    {
      id: 1,
      title: "كتاب إسلامي 1",
      price: "50",
      image: "/images/book1.jpg",
      alt: "غلاف كتاب إسلامي 1",
    },
    {
      id: 2,
      title: "كتاب إسلامي 2",
      price: "60",
      image: "/images/book2.jpg",
      alt: "غلاف كتاب إسلامي 2",
    },
    {
      id: 3,
      title: "كتاب إسلامي 3",
      price: "40",
      image: "/images/book3.jpg",
      alt: "غلاف كتاب إسلامي 3",
    },
  ];

  return (
    <div className="min-h-screen">
      <Hero />
      <section
        className="container mx-auto py-12 px-4"
        aria-label="قسم الكتب المميزة"
      >
        <h2 className="text-4xl font-bold text-center mb-8 text-green-900">
          الكتب المميزة
        </h2>
        <div className="flex flex-col sm:flex-row gap-6 mb-8">
          <SearchBar />
          <CategoryFilter />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
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
