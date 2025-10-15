"use client";

import { useState, useEffect } from "react";
import { useStore } from "@/lib/store";
import { useParams, useRouter } from "next/navigation";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/lib/supabase";
import useSWR from "swr";
import Image from "next/image";
import translations from "@/lib/translations";
import { Skeleton } from "@/components/ui/skeleton";
import NotificationToast from "@/components/NotificationToast";

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
  const { language, addToCart, user, addToWishlist } = useStore();
  const router = useRouter();
  const t = translations[language];
  const [quantity, setQuantity] = useState(1);
  const [notifyPriceDrop, setNotifyPriceDrop] = useState(false);
  const [notifyStockAvailable, setNotifyStockAvailable] = useState(false);
  const [notifyEmail, setNotifyEmail] = useState(false);
  const [notifyInApp, setNotifyInApp] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

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

  if (bookLoading || ratingLoading) {
    return (
      <div className="container mx-auto py-12 px-4" dir={language === "ar" ? "rtl" : "ltr"}>
        <Card className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg border border-gray-200">
          <CardHeader className="p-6">
            <Skeleton className="h-8 w-3/4 mb-2" />
            <Skeleton className="h-6 w-1/2" />
          </CardHeader>
          <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <Skeleton className="h-96 w-full" />
            <div className="space-y-4">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-6 w-1/3" />
              <Skeleton className="h-6 w-1/4" />
              <Skeleton className="h-10 w-1/2" />
            </div>
          </CardContent>
          <CardFooter className="p-6 flex justify-end">
            <Skeleton className="h-10 w-1/3" />
          </CardFooter>
        </Card>
      </div>
    );
  }
  if (bookError || ratingError)
    return <div>{t.errorLoadingBook || "Error loading book details"}</div>;
  if (!book) return null;

  const title = language === "ar" ? book.title_ar || book.title_en : book.title_en || book.title_ar;
  const category =
    language === "ar" ? book.category_ar || book.category_en : book.category_en || book.category_ar;
  const description =
    book.description || (language === "ar" ? "لا يوجد وصف متاح" : "No description available");

  const handleAddToWishlist = () => {
    if (!user?.id) {
      alert(t.pleaseLogin || "Please log in to add to wishlist");
      return;
    }
    addToWishlist({
      bookId: book.book_id,
      notifyPriceDrop,
      notifyStockAvailable,
      notifyEmail,
      notifyInApp,
    });
    if (notifyInApp) {
      setToastMessage(notifyPriceDrop ? "Price drop alert set!" : "Stock alert set!");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 6000); // Match toast duration
    }
    // Reset notification preferences
    setNotifyPriceDrop(false);
    setNotifyStockAvailable(false);
    setNotifyEmail(false);
    setNotifyInApp(false);
  };

  return (
    <div className="container mx-auto py-12 px-4" dir={language === "ar" ? "rtl" : "ltr"}>
      <Card className="max-w-4xl mx-auto bg-gradient-to-br from-white via-gray-50 to-white shadow-2xl rounded-xl border border-gray-100 hover:shadow-xl transition-all duration-300">
        <CardHeader className="p-8 bg-primary/5 border-b border-gray-100">
          <h2 className="text-4xl font-extrabold text-primary mb-3 gradient-text animate-pulse-once">
            {title}
          </h2>
          <p className="text-lg text-muted-foreground font-medium">{category}</p>
        </CardHeader>
        <CardContent className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          <div className="relative w-full h-[400px] rounded-lg overflow-hidden border-2 border-gray-200 shadow-inner">
            <Image
              src={book.image || "/placeholder.jpg"}
              alt={title}
              fill
              className="object-cover transition-transform duration-300 hover:scale-105"
              onError={(e) => (e.target.style.display = "none")}
            />
          </div>
          <div className="space-y-6">
            <p className="text-gray-700 text-lg leading-relaxed border-l-4 border-primary/50 pl-4">
              {description}
            </p>
            <div className="flex items-center gap-3">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-6 h-6 ${i < Math.round(avgRating) ? "text-yellow-500 fill-current" : "text-gray-300"} transition-colors duration-200 hover:text-yellow-600`}
                />
              ))}
              <span className="text-gray-600 text-sm font-semibold">
                ({avgRating.toFixed(1)} {t.rating || "Rating"})
              </span>
            </div>
            <p className="text-2xl font-bold text-green-600">
              {book.price ? `${book.price}` : t.free || "Free"}
            </p>
            <p className="text-gray-700">
              {t.inStock || "In Stock"}:{" "}
              <span className="font-medium">{book.inStock ? t.yes : t.no}</span>
            </p>
            <div className="flex items-center gap-6">
              <Input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-24 p-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              />
              <Button
                onClick={() => addToCart({ ...book, quantity })}
                disabled={!book.inStock}
                className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all"
              >
                {t.addToCart || "Add to Cart"}
              </Button>
            </div>
            <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                {t.notificationPreferences || "Notification Preferences"}
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="notify-price-drop"
                    checked={notifyPriceDrop}
                    onCheckedChange={setNotifyPriceDrop}
                    disabled={!book.price || book.inStock}
                  />
                  <label htmlFor="notify-price-drop" className="text-sm text-gray-700">
                    {t.notifyPriceDrop || "Notify me if price drops"}
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="notify-stock-available"
                    checked={notifyStockAvailable}
                    onCheckedChange={setNotifyStockAvailable}
                    disabled={book.inStock}
                  />
                  <label htmlFor="notify-stock-available" className="text-sm text-gray-700">
                    {t.notifyStockAvailable || "Notify me when available"}
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="notify-email"
                    checked={notifyEmail}
                    onCheckedChange={setNotifyEmail}
                  />
                  <label htmlFor="notify-email" className="text-sm text-gray-700">
                    {t.notifyByEmail || "Notify me by email"}
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="notify-in-app"
                    checked={notifyInApp}
                    onCheckedChange={setNotifyInApp}
                  />
                  <label htmlFor="notify-in-app" className="text-sm text-gray-700">
                    {t.notifyInApp || "Notify me in-app"}
                  </label>
                </div>
              </div>
            </div>
            <Button
              onClick={handleAddToWishlist}
              className="bg-secondary text-foreground px-6 py-3 rounded-lg hover:bg-secondary/80 transition-all mt-4 w-full"
            >
              {t.addToWishlist || "Add to Wishlist"}
            </Button>
          </div>
        </CardContent>
        <CardFooter className="p-8 bg-gray-50 border-t border-gray-100">
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="bg-secondary text-foreground px-6 py-3 rounded-lg hover:bg-secondary/90 transition-all"
          >
            {t.backToShop || "Back to Shop"}
          </Button>
        </CardFooter>
      </Card>
      <NotificationToast message={toastMessage} open={showToast} />
    </div>
  );
}
