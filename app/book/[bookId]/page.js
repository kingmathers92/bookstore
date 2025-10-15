"use client";

import { useState, useEffect } from "react";
import { useStore } from "@/lib/store";
import { useParams, useRouter } from "next/navigation";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { supabase } from "@/lib/supabase";
import useSWR from "swr";
import Image from "next/image";
import translations from "@/lib/translations";
import LoadingSpinner from "@/components/LoadingSpinner";

const fetchBook = async (bookId) => {
  const { data, error } = await supabase.from("books").select("*").eq("book_id", bookId).single();
  if (error) throw new Error(`Error fetching book: ${error.message}`);
  return data;
};

const fetchAverageRating = async (bookId) => {
  const { data, error } = await supabase
    .from("testimonials")
    .select("rating")
    .eq("text", (q) => q.ilike(`%${bookId}%`))
    .limit(10);
  if (error) throw new Error(`Error fetching ratings: ${error.message}`);
  return data.length > 0 ? data.reduce((sum, t) => sum + t.rating, 0) / data.length : 0;
};

export default function BookDetail() {
  const { bookId } = useParams();
  const { language, addToCart } = useStore();
  const router = useRouter();
  const t = translations[language];
  const [quantity, setQuantity] = useState(1);

  const {
    data: book,
    error: bookError,
    isLoading: bookLoading,
  } = useSWR(bookId ? `book-${bookId}` : null, () => fetchBook(bookId));
  const {
    data: avgRating,
    error: ratingError,
    isLoading: ratingLoading,
  } = useSWR(bookId ? `rating-${bookId}` : null, () => fetchAverageRating(bookId));

  useEffect(() => {
    if (!bookId) router.push("/shop");
  }, [bookId, router]);

  if (bookLoading || ratingLoading) return <LoadingSpinner />;
  if (bookError || ratingError)
    return <div>{t.errorLoadingBook || "Error loading book details"}</div>;
  if (!book) return null;

  const title = language === "ar" ? book.title_ar || book.title_en : book.title_en || book.title_ar;
  const category =
    language === "ar" ? book.category_ar || book.category_en : book.category_en || book.category_ar;
  const description =
    book.description || (language === "ar" ? "لا يوجد وصف متاح" : "No description available");

  return (
    <div className="container mx-auto py-12 px-4" dir={language === "ar" ? "rtl" : "ltr"}>
      <Card className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300">
        <CardHeader className="p-6">
          <h2 className="text-3xl font-bold text-primary mb-2">{title}</h2>
          <p className="text-muted-foreground text-lg">{category}</p>
        </CardHeader>
        <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="relative w-full h-96">
            <Image
              src={book.image || "/placeholder.jpg"}
              alt={title}
              fill
              className="object-cover rounded-md"
              onError={(e) => (e.target.style.display = "none")}
            />
          </div>
          <div className="space-y-4">
            <p className="text-foreground text-base leading-relaxed">{description}</p>
            <div className="flex items-center gap-2">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${i < Math.round(avgRating) ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                />
              ))}
              <span className="text-muted-foreground text-sm">
                ({avgRating.toFixed(1)} {t.rating || "Rating"})
              </span>
            </div>
            <p className="text-xl font-semibold text-green-700">
              {book.price ? `${book.price} ر.س` : t.free || "Free"}
            </p>
            <p className="text-foreground">
              {t.inStock || "In Stock"}: {book.inStock ? t.yes : t.no}
            </p>
            <div className="flex items-center gap-4">
              <Input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-20 p-2 border border-gray-300 rounded-md"
              />
              <Button
                onClick={() => addToCart({ ...book, quantity })}
                disabled={!book.inStock}
                className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 disabled:bg-gray-400"
              >
                {t.addToCart || "Add to Cart"}
              </Button>
            </div>
          </div>
        </CardContent>
        <CardFooter className="p-6 flex justify-end">
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="bg-secondary text-foreground hover:bg-secondary/90"
          >
            {t.backToShop || "Back to Shop"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
