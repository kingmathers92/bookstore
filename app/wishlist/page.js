"use client";

import { useStore } from "@/lib/store";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/lib/supabase";
import useSWR, { mutate } from "swr"; // Added mutate for refetching
import Image from "next/image";
import { useRouter } from "next/navigation";
import translations from "@/lib/translations";
import { Skeleton } from "@/components/ui/skeleton";

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

  useEffect(() => {
    if (!user?.id) router.push("/shop");
  }, [user?.id, router]);

  if (wishlistLoading || booksLoading) {
    return (
      <div className="container mx-auto py-12 px-4" dir={language === "ar" ? "rtl" : "ltr"}>
        <h2 className="text-3xl font-bold text-primary mb-6">{t.myWishlist || "My Wishlist"}</h2>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="p-4 border border-gray-200 rounded-lg">
              <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Skeleton className="h-24 w-full" />
                <div className="space-y-2">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
                <Skeleton className="h-10 w-1/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }
  if (wishlistError || booksError)
    return <div>{t.errorLoadingWishlist || "Error loading wishlist"}</div>;
  if (!wishlist?.length)
    return <div className="text-center py-12">{t.emptyWishlist || "Your wishlist is empty"}</div>;

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
    <div className="container mx-auto py-12 px-4" dir={language === "ar" ? "rtl" : "ltr"}>
      <h2 className="text-3xl font-bold text-primary mb-6">{t.myWishlist || "My Wishlist"}</h2>
      <div className="space-y-4">
        {books.map((book) => {
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
            <Card
              key={book.book_id}
              className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
            >
              <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                <div className="relative w-full h-24 rounded-lg overflow-hidden">
                  <Image
                    src={book.image || "/placeholder.jpg"}
                    alt={
                      language === "ar"
                        ? book.title_ar || book.title_en
                        : book.title_en || book.title_ar
                    }
                    fill
                    className="object-cover"
                    onError={(e) => (e.target.style.display = "none")}
                  />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">
                    {language === "ar"
                      ? book.title_ar || book.title_en
                      : book.title_en || book.title_ar}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {t.inStock || "In Stock"}: {book.inStock ? t.yes : t.no}
                  </p>
                  <p className="text-sm text-green-600 font-medium">
                    {book.price ? `${book.price} ر.س` : t.free || "Free"}
                  </p>
                </div>
                <div className="flex flex-col md:flex-row gap-2">
                  {isEditing ? (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Checkbox
                          id={`price-drop-${book.book_id}`}
                          checked={localNotifyPriceDrop}
                          onCheckedChange={setLocalNotifyPriceDrop}
                          disabled={!book.price || book.inStock}
                        />
                        <label
                          htmlFor={`price-drop-${book.book_id}`}
                          className="text-sm text-gray-700"
                        >
                          {t.notifyPriceDrop || "Notify if price drops"}
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
                          className="text-sm text-gray-700"
                        >
                          {t.notifyStockAvailable || "Notify when available"}
                        </label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Checkbox
                          id={`email-${book.book_id}`}
                          checked={localNotifyEmail}
                          onCheckedChange={setLocalNotifyEmail}
                        />
                        <label htmlFor={`email-${book.book_id}`} className="text-sm text-gray-700">
                          {t.notifyByEmail || "Notify by email"}
                        </label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Checkbox
                          id={`in-app-${book.book_id}`}
                          checked={localNotifyInApp}
                          onCheckedChange={setLocalNotifyInApp}
                        />
                        <label htmlFor={`in-app-${book.book_id}`} className="text-sm text-gray-700">
                          {t.notifyInApp || "Notify in-app"}
                        </label>
                      </div>
                      <Button
                        onClick={() =>
                          handleUpdateNotifications(book.book_id, {
                            notify_price_drop: localNotifyPriceDrop,
                            notify_stock_available: localNotifyStockAvailable,
                            notify_email: localNotifyEmail,
                            notify_in_app: localNotifyInApp,
                          })
                        }
                        className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 mt-2"
                      >
                        {t.save || "Save"}
                      </Button>
                      <Button
                        onClick={() => setEditMode(null)}
                        variant="outline"
                        className="bg-secondary text-foreground px-4 py-2 rounded-lg hover:bg-secondary/90 mt-2"
                      >
                        {t.cancel || "Cancel"}
                      </Button>
                    </div>
                  ) : (
                    <>
                      <Button
                        onClick={() => handleRemoveFromWishlist(book.book_id)}
                        disabled={isRemoving === book.book_id}
                        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 disabled:bg-red-300 transition-all"
                      >
                        {isRemoving === book.book_id
                          ? t.removing || "Removing..."
                          : t.remove || "Remove"}
                      </Button>
                      <Button
                        onClick={() => setEditMode(book.book_id)}
                        className="bg-secondary text-foreground px-4 py-2 rounded-lg hover:bg-secondary/80"
                      >
                        {t.edit || "Edit"}
                      </Button>
                      <span className="text-sm text-gray-500 mt-2 md:mt-0">
                        {t.notifications || "Notifications"}:{" "}
                        {wishlistItem.notify_email ? "Email " : ""}
                        {wishlistItem.notify_in_app ? "In-App" : ""}
                      </span>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
