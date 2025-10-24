"use client";

import { useStore } from "@/lib/store";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/lib/supabase";
import useSWR, { mutate } from "swr";
import Image from "next/image";
import { useRouter } from "next/navigation";
import translations from "@/lib/translations";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { Heart, Settings, Save, X } from "lucide-react";

const fetchWishlist = async (userId) => {
  if (!userId) return [];
  const { data, error } = await supabase
    .from("wishlist")
    .select("book_id, notify_price_drop, notify_stock_available, notify_email, notify_in_app")
    .eq("user_id", userId);
  if (error) throw new Error(`Error fetching wishlist: ${error.message}`);
  return data || [];
};

const fetchWishlistBooks = async (wishlist) => {
  if (!wishlist.length) return [];
  const bookIds = wishlist.map((item) => item.book_id);
  const { data, error } = await supabase.from("books").select("*").in("book_id", bookIds);
  if (error) throw new Error(`Error fetching wishlist books: ${error.message}`);
  return data || [];
};

export default function Wishlist() {
  const { user, language } = useStore();
  const router = useRouter();
  const t = translations[language];
  const [isRemoving, setIsRemoving] = useState(null);
  const [editMode, setEditMode] = useState(null);
  const [isUserLoading, setIsUserLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      if (user === undefined) {
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
      setIsUserLoading(false);
    };
    checkUser();
  }, [user]);

  useEffect(() => {
    if (!isUserLoading && !user?.id) {
      router.push("/shop");
    }
  }, [isUserLoading, user?.id, router]);

  const {
    data: wishlist,
    error: wishlistError,
    isLoading: wishlistLoading,
  } = useSWR(user?.id ? `wishlist-${user.id}` : null, () => fetchWishlist(user?.id));

  const {
    data: books,
    error: booksError,
    isLoading: booksLoading,
  } = useSWR(wishlist ? `wishlist-books-${wishlist.map((w) => w.book_id).join("-")}` : null, () =>
    fetchWishlistBooks(wishlist),
  );

  if (isUserLoading || wishlistLoading || booksLoading) {
    return (
      <div className="min-h-screen bg-gradient-cream py-8 px-4" dir="rtl">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-8">
            <Skeleton className="h-12 w-64 mx-auto mb-4" />
          </div>
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="mb-4 p-4">
              <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                <Skeleton className="h-24 w-full rounded-lg" />
                <div className="space-y-2">
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (wishlistError || booksError) {
    return (
      <div
        className="min-h-screen bg-gradient-cream py-8 px-4 flex items-center justify-center"
        dir="rtl"
      >
        <Card className="bg-white shadow-lg rounded-xl p-8 text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-semibold text-burgundy mb-4 font-serif">
            {t.errorLoadingWishlist || "Error loading wishlist"}
          </h2>
        </Card>
      </div>
    );
  }

  if (!wishlist?.length) {
    return (
      <div
        className="min-h-screen bg-gradient-cream py-8 px-4 flex items-center justify-center"
        dir="rtl"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="bg-white shadow-lg rounded-xl p-8 text-center elegant-shadow">
            <div className="text-6xl mb-4">💝</div>
            <h2 className="text-2xl font-semibold text-burgundy mb-4 font-serif">
              {t.emptyWishlist || "Your wishlist is empty"}
            </h2>
            <Button
              onClick={() => router.push("/shop")}
              className="bg-burgundy text-white hover:bg-burgundy-dark transition-all px-8 py-3 rounded-lg font-semibold"
            >
              تصفح الكتب
            </Button>
          </Card>
        </motion.div>
      </div>
    );
  }

  const handleRemoveFromWishlist = async (bookId) => {
    setIsRemoving(bookId);
    try {
      const { error } = await supabase
        .from("wishlist")
        .delete()
        .eq("user_id", user.id)
        .eq("book_id", bookId);
      if (error) throw error;
      mutate(`wishlist-${user.id}`);
    } catch (error) {
      alert(t.errorRemovingWishlist || `Error removing from wishlist: ${error.message}`);
    } finally {
      setIsRemoving(null);
    }
  };

  const handleUpdateNotifications = async (bookId, updates) => {
    try {
      const { error } = await supabase
        .from("wishlist")
        .update(updates)
        .eq("user_id", user.id)
        .eq("book_id", bookId);
      if (error) throw error;
      mutate(`wishlist-${user.id}`);
      setEditMode(null);
    } catch (error) {
      alert(t.errorUpdatingNotifications || `Error updating notifications: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-cream py-8 px-4" dir="rtl">
      <div className="container mx-auto max-w-4xl">
        <motion.h1
          className="text-4xl md:text-5xl font-bold text-burgundy mb-8 text-center font-serif flex items-center justify-center gap-3"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Heart className="text-burgundy" size={40} />
          {t.myWishlist || "My Wishlist"}
        </motion.h1>

        <div className="space-y-6">
          {books.map((book, index) => {
            const wishlistItem = wishlist.find((w) => w.book_id === book.book_id);
            const isEditing = editMode === book.book_id;
            const [localNotifyPriceDrop, setLocalNotifyPriceDrop] = useState(
              wishlistItem.notify_price_drop,
            );
            const [localNotifyStockAvailable, setLocalNotifyStockAvailable] = useState(
              wishlistItem.notify_stock_available,
            );
            const [localNotifyEmail, setLocalNotifyEmail] = useState(wishlistItem.notify_email);
            const [localNotifyInApp, setLocalNotifyInApp] = useState(wishlistItem.notify_in_app);

            useEffect(() => {
              if (!isEditing) {
                setLocalNotifyPriceDrop(wishlistItem.notify_price_drop);
                setLocalNotifyStockAvailable(wishlistItem.notify_stock_available);
                setLocalNotifyEmail(wishlistItem.notify_email);
                setLocalNotifyInApp(wishlistItem.notify_in_app);
              }
            }, [isEditing, wishlistItem]);

            return (
              <motion.div
                key={book.book_id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="bg-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl overflow-hidden elegant-shadow">
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
                      <div className="relative w-full h-32 rounded-lg overflow-hidden bg-gray-100">
                        <Image
                          src={book.image || "/placeholder.jpg"}
                          alt={
                            language === "ar"
                              ? book.title_ar || book.title_en
                              : book.title_en || book.title_ar
                          }
                          fill
                          className="object-cover hover:scale-105 transition-transform duration-300"
                          onError={(e) => (e.target.style.display = "none")}
                        />
                        <div className="absolute top-2 right-2 bg-burgundy text-white text-xs px-2 py-1 rounded-full">
                          {book.inStock ? "متوفر" : "غير متوفر"}
                        </div>
                      </div>

                      <div className="md:col-span-2">
                        <h3 className="text-xl font-bold text-burgundy mb-2 font-serif">
                          {language === "ar"
                            ? book.title_ar || book.title_en
                            : book.title_en || book.title_ar}
                        </h3>
                        <div className="space-y-1 text-sm">
                          <p className="text-warm-gray-600">
                            <span className="font-semibold">{t.inStock || "In Stock"}:</span>{" "}
                            <span className={book.inStock ? "text-green-600" : "text-red-600"}>
                              {book.inStock ? t.yes : t.no}
                            </span>
                          </p>
                          <p className="text-burgundy font-bold text-lg">
                            {book.price ? `${book.price} ر.س` : t.free || "Free"}
                          </p>
                        </div>

                        {!isEditing && (
                          <div className="mt-3 text-xs text-warm-gray-500">
                            <span className="font-semibold">
                              {t.notifications || "Notifications"}:
                            </span>{" "}
                            {wishlistItem.notify_email && "البريد الإلكتروني "}
                            {wishlistItem.notify_in_app && "داخل التطبيق"}
                            {!wishlistItem.notify_email && !wishlistItem.notify_in_app && "لا توجد"}
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col gap-3">
                        {isEditing ? (
                          <div className="space-y-4 p-4 bg-cream rounded-lg">
                            <h4 className="font-semibold text-burgundy text-sm">
                              إعدادات التنبيهات
                            </h4>
                            <div className="space-y-3">
                              <div className="flex items-center gap-2">
                                <Checkbox
                                  id={`price-drop-${book.book_id}`}
                                  checked={localNotifyPriceDrop}
                                  onCheckedChange={setLocalNotifyPriceDrop}
                                  disabled={!book.price || book.inStock}
                                />
                                <label
                                  htmlFor={`price-drop-${book.book_id}`}
                                  className="text-xs text-burgundy"
                                >
                                  {t.notifyPriceDrop || "تنبيه عند انخفاض السعر"}
                                </label>
                              </div>
                              <div className="flex items-center gap-2">
                                <Checkbox
                                  id={`stock-available-${book.book_id}`}
                                  checked={localNotifyStockAvailable}
                                  onCheckedChange={setLocalNotifyStockAvailable}
                                  disabled={book.inStock}
                                />
                                <label
                                  htmlFor={`stock-available-${book.book_id}`}
                                  className="text-xs text-burgundy"
                                >
                                  {t.notifyStockAvailable || "تنبيه عند التوفر"}
                                </label>
                              </div>
                              <div className="flex items-center gap-2">
                                <Checkbox
                                  id={`email-${book.book_id}`}
                                  checked={localNotifyEmail}
                                  onCheckedChange={setLocalNotifyEmail}
                                />
                                <label
                                  htmlFor={`email-${book.book_id}`}
                                  className="text-xs text-burgundy"
                                >
                                  {t.notifyByEmail || "تنبيه بالبريد الإلكتروني"}
                                </label>
                              </div>
                              <div className="flex items-center gap-2">
                                <Checkbox
                                  id={`in-app-${book.book_id}`}
                                  checked={localNotifyInApp}
                                  onCheckedChange={setLocalNotifyInApp}
                                />
                                <label
                                  htmlFor={`in-app-${book.book_id}`}
                                  className="text-xs text-burgundy"
                                >
                                  {t.notifyInApp || "تنبيه داخل التطبيق"}
                                </label>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                onClick={() =>
                                  handleUpdateNotifications(book.book_id, {
                                    notify_price_drop: localNotifyPriceDrop,
                                    notify_stock_available: localNotifyStockAvailable,
                                    notify_email: localNotifyEmail,
                                    notify_in_app: localNotifyInApp,
                                  })
                                }
                                className="flex-1 bg-burgundy text-white hover:bg-burgundy-dark px-3 py-2 rounded-lg text-xs transition-all flex items-center gap-1"
                              >
                                <Save size={12} />
                                {t.save || "حفظ"}
                              </Button>
                              <Button
                                onClick={() => setEditMode(null)}
                                variant="outline"
                                className="flex-1 border-burgundy text-burgundy hover:bg-burgundy hover:text-white px-3 py-2 rounded-lg text-xs transition-all flex items-center gap-1"
                              >
                                <X size={12} />
                                {t.cancel || "إلغاء"}
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <Button
                              onClick={() => handleRemoveFromWishlist(book.book_id)}
                              disabled={isRemoving === book.book_id}
                              className="bg-red-500 text-white hover:bg-red-600 disabled:bg-red-300 px-4 py-2 rounded-lg transition-all text-sm"
                            >
                              {isRemoving === book.book_id
                                ? t.removing || "جاري الحذف..."
                                : t.remove || "حذف"}
                            </Button>
                            <Button
                              onClick={() => setEditMode(book.book_id)}
                              className="bg-burgundy text-white hover:bg-burgundy-dark px-4 py-2 rounded-lg transition-all text-sm flex items-center gap-2"
                            >
                              <Settings size={14} />
                              {t.edit || "تعديل"}
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        <div className="text-center mt-8">
          <Button
            variant="outline"
            className="border-2 border-burgundy text-burgundy hover:bg-burgundy hover:text-white px-8 py-3 rounded-lg font-semibold transition-all"
            onClick={() => router.push("/shop")}
          >
            العودة للمتجر
          </Button>
        </div>
      </div>
    </div>
  );
}
