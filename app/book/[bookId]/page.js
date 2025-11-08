"use client";

import { useState, useEffect } from "react";
import { useStore } from "@/lib/store";
import { useParams, useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingCart, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/lib/supabase";
import useSWR from "swr";
import Image from "next/image";
import translations from "@/lib/translations";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import CategoryBadge from "@/components/CategoryBadge";
import MarketingHighlights from "@/components/MarketingHighlights";

const fetchBook = async (bookId) => {
  const { data, error } = await supabase.from("books").select("*").eq("book_id", bookId).single();
  if (error) throw new Error(`Error fetching book: ${error.message}`);
  return data;
};

const fetchAverageRating = async (bookId) => {
  const { data, error } = await supabase
    .from("testimonials")
    .select("rating")
    .eq("book_id", bookId)
    .limit(50);
  if (error) return 0;
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
      <div className="min-h-screen bg-gradient-cream py-4 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Skeleton className="h-96 w-full rounded-xl" />
            <div className="space-y-4">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (bookError || ratingError || !book) {
    return (
      <div className="min-h-screen bg-gradient-cream flex items-center justify-center">
        <Card className="bg-white shadow-lg rounded-xl p-6 text-center">
          <div className="text-red-500 text-2xl mb-3">Book Not Found</div>
          <h2 className="text-lg font-semibold text-burgundy mb-3">
            {t.errorLoadingBook || "Error loading book details"}
          </h2>
        </Card>
      </div>
    );
  }

  const title = language === "ar" ? book.title_ar || book.title_en : book.title_en || book.title_ar;
  const category =
    language === "ar" ? book.category_ar || book.category_en : book.category_en || book.category_ar;
  const description =
    language === "ar"
      ? book.description_ar || book.description_en || "لا يوجد وصف متاح"
      : book.description_en || book.description_ar || "No description available";

  const price = book.price;
  const priceBeforeDiscount = book.priceBeforeDiscount;
  const currentPrice = price || priceBeforeDiscount;
  const hasDiscount = price && priceBeforeDiscount && priceBeforeDiscount > price;
  const discountPercentage = hasDiscount
    ? Math.round(((priceBeforeDiscount - price) / priceBeforeDiscount) * 100)
    : null;

  return (
    <div className="min-h-svh bg-gradient-cream py-8 px-4 mt-8">
      <MarketingHighlights />
      <div className="container mx-auto max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-10 items-start mt-6">
        <motion.div
          initial={{ opacity: 0, x: language === "ar" ? 20 : -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="relative"
        >
          <Card className="bg-white rounded-2xl shadow-xl overflow-hidden w-120 h-120">
            <div className="relative aspect-[3/4] ">
              <Image
                src={book.image || "/placeholder.jpg"}
                alt={title}
                fill
                className="object-contain"
                onError={(e) => (e.target.src = "/placeholder.jpg")}
              />
              <div className="absolute top-3 left-3">
                <CategoryBadge category={category} />
              </div>
              {discountPercentage && (
                <div className="absolute bottom-3 right-3 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                  -{discountPercentage}%
                </div>
              )}
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: language === "ar" ? -20 : 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          <div>
            <h1 className="text-3xl font-bold text-burgundy mb-3 font-serif">{title}</h1>
            <p className="text-gray-700 leading-relaxed text-sm sm:text-base">{description}</p>
          </div>

          <Card className="bg-white rounded-xl shadow p-4 space-y-3">
            <div className="flex items-center gap-3">
              {discountPercentage && (
                <span className="text-sm text-gray-400 line-through">{priceBeforeDiscount}</span>
              )}
              <span className="text-2xl font-bold text-burgundy">{currentPrice || "Free"}</span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600">{t.inStock || "Availability"}:</span>
              <span className={`font-semibold ${book.inStock ? "text-green-600" : "text-red-600"}`}>
                {book.inStock ? "Available" : "Out of stock"}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <label className="text-xs font-semibold text-burgundy">
                {t.quantity || "Quantity"}:
              </label>
              <Input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-20 text-center border border-gray-300 rounded-lg focus:border-burgundy"
              />
              <Button
                onClick={() => addToCart(book, quantity)}
                disabled={!book.inStock}
                className="flex-1 bg-burgundy text-white hover:bg-burgundy-dark text-sm flex items-center justify-center gap-2"
              >
                <ShoppingCart size={16} />
                {t.addToCart || "Add to Cart"}
              </Button>
            </div>
          </Card>

          <Card className="bg-white rounded-xl shadow p-4">
            <h3 className="text-sm font-semibold text-burgundy mb-3">
              {t.notificationPreferences || "Notification Preferences"}
            </h3>
            {[
              {
                id: "notify-price-drop",
                label: t.notifyPriceDrop || "Notify on Price Drop",
                state: notifyPriceDrop,
                setter: setNotifyPriceDrop,
              },
              {
                id: "notify-stock",
                label: t.notifyStockAvailable || "Notify on Availability",
                state: notifyStockAvailable,
                setter: setNotifyStockAvailable,
              },
              {
                id: "notify-email",
                label: t.notifyByEmail || "Notify by Email",
                state: notifyEmail,
                setter: setNotifyEmail,
              },
              {
                id: "notify-app",
                label: t.notifyInApp || "Notify In-App",
                state: notifyInApp,
                setter: setNotifyInApp,
              },
            ].map(({ id, label, state, setter }) => (
              <div key={id} className="flex items-center gap-2 mb-2">
                <Checkbox id={id} checked={state} onCheckedChange={setter} />
                <label htmlFor={id} className="text-xs text-burgundy">
                  {label}
                </label>
              </div>
            ))}

            <Button
              onClick={() => addToWishlist(book.book_id)}
              className="w-full bg-burgundy/10 text-burgundy border border-burgundy hover:bg-burgundy hover:text-white mt-3 flex items-center justify-center gap-2"
            >
              <Heart size={16} />
              {t.addToWishlist || "Add to Wishlist"}
            </Button>
          </Card>

          <Button
            variant="outline"
            onClick={() => router.back()}
            className="w-full border border-burgundy text-burgundy hover:bg-burgundy hover:text-white mt-4 flex items-center justify-center gap-2"
          >
            <ArrowRight size={16} />
            {t.backToShop || "Back to Shop"}
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
