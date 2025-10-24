"use client";

import { useState, useEffect } from "react";
import { useStore } from "@/lib/store";
import { useParams, useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, Heart, ShoppingCart, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/lib/supabase";
import useSWR from "swr";
import Image from "next/image";
import translations from "@/lib/translations";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import CategoryBadge from "@/components/CategoryBadge";

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
      <div className="min-h-screen bg-gradient-cream py-8 px-4" dir="rtl">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <Skeleton className="h-96 w-full rounded-xl" />
            </div>
            <div className="space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-6 w-1/3" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (bookError || ratingError) {
    return (
      <div
        className="min-h-screen bg-gradient-cream py-8 px-4 flex items-center justify-center"
        dir="rtl"
      >
        <Card className="bg-white shadow-lg rounded-xl p-8 text-center">
          <div className="text-red-500 text-6xl mb-4">📚</div>
          <h2 className="text-2xl font-semibold text-burgundy mb-4 font-serif">
            {t.errorLoadingBook || "Error loading book details"}
          </h2>
        </Card>
      </div>
    );
  }

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
      setToastMessage(notifyPriceDrop ? "تم تعيين تنبيه انخفاض السعر!" : "تم تعيين تنبيه التوفر!");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 6000);
    }
    setNotifyPriceDrop(false);
    setNotifyStockAvailable(false);
    setNotifyEmail(false);
    setNotifyInApp(false);
  };

  const discountPercentage =
    book.priceBeforeDiscount && book.priceBeforeDiscount > book.price
      ? Math.round(((book.priceBeforeDiscount - book.price) / book.priceBeforeDiscount) * 100)
      : null;

  return (
    <div className="min-h-screen bg-gradient-cream py-8 px-4" dir="rtl">
      <div className="container mx-auto max-w-6xl">
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-4 right-4 bg-burgundy text-white px-6 py-3 rounded-lg shadow-lg z-50"
          >
            {toastMessage}
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          {/* Book Image */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="bg-white shadow-lg rounded-xl overflow-hidden elegant-shadow">
              <div className="relative w-full h-96 lg:h-[500px] bg-gray-100">
                <Image
                  src={book.image || "/placeholder.jpg"}
                  alt={title}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-500"
                  onError={(e) => (e.target.style.display = "none")}
                />
                <div className="absolute top-4 right-4">
                  <CategoryBadge category={category} />
                </div>
                <div className="absolute top-4 left-4">
                  <div
                    className={`px-3 py-1 text-sm font-bold rounded-full ${
                      book.inStock ? "bg-green-600" : "bg-red-600"
                    } text-white shadow-lg`}
                  >
                    {book.inStock ? "متوفر" : "غير متوفر"}
                  </div>
                </div>
                {discountPercentage && (
                  <div className="absolute bottom-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                    خصم {discountPercentage}%
                  </div>
                )}
              </div>
            </Card>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-6"
          >
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-burgundy mb-4 font-serif leading-tight">
                {title}
              </h1>

              <div className="flex items-center gap-2 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.round(avgRating) ? "text-yellow-500 fill-current" : "text-gray-300"
                    } transition-colors duration-200`}
                  />
                ))}
                <span className="text-sm text-warm-gray-600 mr-2">
                  ({avgRating.toFixed(1)} {t.rating || "تقييم"})
                </span>
              </div>

              <p className="text-warm-gray-700 leading-relaxed mb-6">{description}</p>
            </div>
            <Card className="bg-white shadow-md rounded-xl p-6 elegant-shadow">
              <div className="flex items-center gap-4 mb-4">
                {discountPercentage && (
                  <span className="text-lg text-gray-500 line-through">
                    {book.priceBeforeDiscount} ر.س
                  </span>
                )}
                <span className="text-3xl font-bold text-burgundy font-serif">
                  {book.price ? `${book.price} ر.س` : "مجاني"}
                </span>
              </div>

              <div className="flex items-center gap-4 mb-6">
                <span className="text-sm text-warm-gray-600">{t.inStock || "حالة التوفر"}:</span>
                <span
                  className={`font-semibold ${book.inStock ? "text-green-600" : "text-red-600"}`}
                >
                  {book.inStock ? "متوفر" : "غير متوفر"}
                </span>
              </div>
              <div className="flex items-center gap-4 mb-6">
                <label className="text-sm font-semibold text-burgundy">الكمية:</label>
                <Input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-20 text-center border-2 border-gray-200 rounded-lg focus:border-burgundy focus:ring-2 focus:ring-burgundy/20 transition-all"
                />
                <Button
                  onClick={() => addToCart({ ...book, quantity })}
                  disabled={!book.inStock}
                  className="flex-1 bg-burgundy text-white hover:bg-burgundy-dark disabled:bg-gray-400 disabled:cursor-not-allowed px-6 py-3 rounded-lg font-semibold transition-all flex items-center gap-2"
                >
                  <ShoppingCart size={18} />
                  {t.addToCart || "أضف للسلة"}
                </Button>
              </div>
            </Card>
            <Card className="bg-white shadow-md rounded-xl p-6 elegant-shadow">
              <h3 className="text-lg font-bold text-burgundy mb-4 font-serif">
                {t.notificationPreferences || "تفضيلات التنبيهات"}
              </h3>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3">
                  <Checkbox
                    id="notify-price-drop"
                    checked={notifyPriceDrop}
                    onCheckedChange={setNotifyPriceDrop}
                    disabled={!book.price || book.inStock}
                  />
                  <label htmlFor="notify-price-drop" className="text-sm text-burgundy">
                    {t.notifyPriceDrop || "أعلمني عند انخفاض السعر"}
                  </label>
                </div>

                <div className="flex items-center gap-3">
                  <Checkbox
                    id="notify-stock"
                    checked={notifyStockAvailable}
                    onCheckedChange={setNotifyStockAvailable}
                    disabled={book.inStock}
                  />
                  <label htmlFor="notify-stock" className="text-sm text-burgundy">
                    {t.notifyStockAvailable || "أعلمني عند التوفر"}
                  </label>
                </div>

                <div className="flex items-center gap-3">
                  <Checkbox
                    id="notify-email"
                    checked={notifyEmail}
                    onCheckedChange={setNotifyEmail}
                  />
                  <label htmlFor="notify-email" className="text-sm text-burgundy">
                    {t.notifyByEmail || "تنبيه بالبريد الإلكتروني"}
                  </label>
                </div>

                <div className="flex items-center gap-3">
                  <Checkbox
                    id="notify-app"
                    checked={notifyInApp}
                    onCheckedChange={setNotifyInApp}
                  />
                  <label htmlFor="notify-app" className="text-sm text-burgundy">
                    {t.notifyInApp || "تنبيه داخل التطبيق"}
                  </label>
                </div>
              </div>

              <Button
                onClick={handleAddToWishlist}
                className="w-full bg-burgundy/10 text-burgundy border-2 border-burgundy hover:bg-burgundy hover:text-white px-6 py-3 rounded-lg font-semibold transition-all flex items-center gap-2"
              >
                <Heart size={18} />
                {t.addToWishlist || "أضف لقائمة الأمنيات"}
              </Button>
            </Card>
            <Button
              variant="outline"
              onClick={() => router.back()}
              className="w-full border-2 border-burgundy text-burgundy hover:bg-burgundy hover:text-white px-6 py-3 rounded-lg font-semibold transition-all flex items-center gap-2"
            >
              <ArrowRight size={18} />
              {t.backToShop || "العودة للمتجر"}
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
