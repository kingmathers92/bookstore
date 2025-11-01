"use client";

import { useState, useEffect } from "react";
import { useStore } from "@/lib/store";
import { supabase } from "@/lib/supabase";
import { useSession } from "next-auth/react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import Image from "next/image";
import { useRouter } from "next/navigation";
import translations from "@/lib/translations";
import { motion } from "framer-motion";
import { Heart, Settings, Save, X } from "lucide-react";
import { showSuccess, showError } from "@/components/Toast";
import Breadcrumbs from "@/components/Breadcrumbs";

function WishlistItem({
  item,
  index,
  editMode,
  setEditMode,
  handleRemove,
  handleUpdateNotifications,
  isRemoving,
  t,
}) {
  const [localNotifyPriceDrop, setLocalNotifyPriceDrop] = useState(item.notify_price_drop);
  const [localNotifyStockAvailable, setLocalNotifyStockAvailable] = useState(
    item.notify_stock_available,
  );
  const [localNotifyEmail, setLocalNotifyEmail] = useState(item.notify_email);
  const [localNotifyInApp, setLocalNotifyInApp] = useState(item.notify_in_app);
  const [imgSrc, setImgSrc] = useState(item.image || "/images/placeholder.png");

  const isEditing = editMode === item.book_id;

  return (
    <motion.div
      key={item.book_id}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Card className="bg-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl overflow-hidden elegant-shadow">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
            <div className="relative w-full h-32 rounded-lg overflow-hidden bg-gray-100">
              <Image
                src={imgSrc}
                alt={item.title || "Book"}
                fill
                className="object-cover hover:scale-105 transition-transform duration-300"
                onError={() => setImgSrc("/images/placeholder.png")}
              />
              <div className="absolute top-2 right-2 bg-burgundy text-white text-xs px-2 py-1 rounded-full">
                {item.inStock ? "متوفر" : "غير متوفر"}
              </div>
            </div>

            <div className="md:col-span-2">
              <h3 className="text-xl font-bold text-burgundy mb-2 font-serif">
                {item.title || "عنوان غير متوفر"}
              </h3>
              <div className="space-y-1 text-sm">
                <p className="text-warm-gray-600">
                  <span className="font-semibold">{t.inStock || "حالة التوفر"}:</span>{" "}
                  <span className={item.inStock ? "text-green-600" : "text-red-600"}>
                    {item.inStock ? "متوفر" : "غير متوفر"}
                  </span>
                </p>
                <p className="text-burgundy font-bold text-lg">
                  {item.price ? `${item.price} ر.س` : "مجاني"}
                </p>
              </div>

              {!isEditing && (
                <div className="mt-3 text-xs text-warm-gray-500">
                  <span className="font-semibold">{t.notifications || "التنبيهات"}:</span>{" "}
                  {item.notify_email && "البريد الإلكتروني "}
                  {item.notify_in_app && "داخل التطبيق"}
                  {!item.notify_email && !item.notify_in_app && "لا توجد"}
                </div>
              )}
            </div>

            <div className="flex flex-col gap-3">
              {isEditing ? (
                <div className="space-y-4 p-4 bg-cream rounded-lg">
                  <h4 className="font-semibold text-burgundy text-sm">إعدادات التنبيهات</h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id={`price-drop-${item.book_id}`}
                        checked={localNotifyPriceDrop}
                        onCheckedChange={setLocalNotifyPriceDrop}
                        disabled={!item.price}
                      />
                      <label
                        htmlFor={`price-drop-${item.book_id}`}
                        className="text-xs text-burgundy"
                      >
                        {t.notifyPriceDrop || "تنبيه عند انخفاض السعر"}
                      </label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id={`stock-available-${item.book_id}`}
                        checked={localNotifyStockAvailable}
                        onCheckedChange={setLocalNotifyStockAvailable}
                        disabled={item.inStock}
                      />
                      <label
                        htmlFor={`stock-available-${item.book_id}`}
                        className="text-xs text-burgundy"
                      >
                        {t.notifyStockAvailable || "تنبيه عند التوفر"}
                      </label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id={`email-${item.book_id}`}
                        checked={localNotifyEmail}
                        onCheckedChange={setLocalNotifyEmail}
                      />
                      <label htmlFor={`email-${item.book_id}`} className="text-xs text-burgundy">
                        {t.notifyByEmail || "تنبيه بالبريد الإلكتروني"}
                      </label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id={`in-app-${item.book_id}`}
                        checked={localNotifyInApp}
                        onCheckedChange={setLocalNotifyInApp}
                      />
                      <label htmlFor={`in-app-${item.book_id}`} className="text-xs text-burgundy">
                        {t.notifyInApp || "تنبيه داخل التطبيق"}
                      </label>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() =>
                        handleUpdateNotifications(item.book_id, {
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
                    onClick={() => handleRemove(item.book_id)}
                    disabled={isRemoving === item.book_id}
                    className="bg-red-500 text-white hover:bg-red-600 disabled:bg-red-300 px-4 py-2 rounded-lg transition-all text-sm"
                  >
                    {isRemoving === item.book_id
                      ? t.removing || "جاري الحذف..."
                      : t.remove || "حذف"}
                  </Button>
                  <Button
                    onClick={() => setEditMode(item.book_id)}
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
}

export default function Wishlist() {
  const { user, language, removeFromWishlist } = useStore();
  const router = useRouter();
  const { data: session, status } = useSession();
  const t = translations[language];
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editMode, setEditMode] = useState(null);
  const [isRemoving, setIsRemoving] = useState(null);

  useEffect(() => {
    const fetchWishlist = async () => {
      if (status === "loading") return;
      if (status === "unauthenticated" || !session?.user?.id) {
        router.replace("/shop");
        return;
      }

      setIsLoading(true);
      try {
        const { data } = await supabase
          .from("wishlist")
          .select("book_id, notify_price_drop, notify_stock_available, notify_email, notify_in_app")
          .eq("user_id", session.user.id);

        if (!data?.length) {
          setBooks([]);
          return;
        }

        const bookIds = data.map((i) => i.book_id);
        const { data: bookData } = await supabase
          .from("books")
          .select("id, title_ar, title_en, price, image, in_stock")
          .in("id", bookIds);

        const merged = data.map((item) => {
          const book = bookData.find((b) => b.id === item.book_id);
          return {
            ...item,
            title: language === "ar" ? book?.title_ar : book?.title_en,
            price: book?.price,
            image: book?.image,
            inStock: book?.in_stock,
          };
        });

        setBooks(merged);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWishlist();
  }, [session, status, language, router]);

  const handleRemove = async (bookId) => {
    setIsRemoving(bookId);
    const result = await removeFromWishlist(bookId);
    if (result.success) {
      showSuccess("تم حذف الكتاب من قائمة الأمنيات");
      setBooks((prev) => prev.filter((b) => b.book_id !== bookId));
    } else {
      showError(result.error || "فشل في الحذف");
    }
    setIsRemoving(null);
  };

  const handleUpdateNotifications = async (bookId, updates) => {
    try {
      const { error } = await supabase
        .from("wishlist")
        .update(updates)
        .eq("user_id", user.id)
        .eq("book_id", bookId);

      if (error) throw error;

      showSuccess("تم حفظ إعدادات التنبيهات");
      setBooks((prev) => prev.map((b) => (b.book_id === bookId ? { ...b, ...updates } : b)));
      setEditMode(null);
    } catch {
      showError("فشل في حفظ الإعدادات");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-cream py-8 px-4" dir="rtl">
        <div className="container mx-auto max-w-4xl">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="mb-4 p-4">
              <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                <div className="h-24 w-full rounded-lg bg-gray-200 animate-pulse"></div>
                <div className="space-y-2">
                  <div className="h-6 w-full bg-gray-200 animate-pulse rounded"></div>
                  <div className="h-4 w-3/4 bg-gray-200 animate-pulse rounded"></div>
                  <div className="h-4 w-1/2 bg-gray-200 animate-pulse rounded"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!books.length) {
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
            <Heart className="text-burgundy mx-auto mb-4" size={64} />
            <h2 className="text-2xl font-semibold text-burgundy mb-4 font-serif">
              {t.emptyWishlist || "قائمة الأمنيات فارغة"}
            </h2>
            <Button
              onClick={() => router.push("/shop")}
              className="bg-burgundy text-white hover:bg-burgundy-dark transition-all px-8 py-3 rounded-lg font-semibold"
            >
              {t.browseBooks || "تصفح الكتب"}
            </Button>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-cream py-8 px-4" dir="rtl">
      <Breadcrumbs />
      <div className="container mx-auto max-w-4xl">
        <motion.h1
          className="text-4xl md:text-5xl font-bold text-burgundy mb-8 text-center font-serif flex items-center justify-center gap-3"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Heart className="text-burgundy" size={40} />
          {t.myWishlist || "قائمة الأمنيات"}
        </motion.h1>

        <div className="space-y-6">
          {books.map((item, index) => (
            <WishlistItem
              key={item.book_id}
              item={item}
              index={index}
              editMode={editMode}
              setEditMode={setEditMode}
              handleRemove={handleRemove}
              handleUpdateNotifications={handleUpdateNotifications}
              isRemoving={isRemoving}
              t={t}
            />
          ))}
        </div>

        <div className="text-center mt-8">
          <Button
            variant="outline"
            className="border-2 border-burgundy text-burgundy hover:bg-burgundy hover:text-white px-8 py-3 rounded-lg font-semibold transition-all"
            onClick={() => router.push("/shop")}
          >
            {t.backToShop || "العودة للمتجر"}
          </Button>
        </div>
      </div>
    </div>
  );
}
