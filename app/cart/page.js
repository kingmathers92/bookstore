"use client";

import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import { useStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import translations from "@/lib/translations";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";
import { showSuccess, showError } from "@/components/Toast";

function Cart() {
  const { cart, removeFromCart, updateQuantity, clearCart, language, syncCartFromLocalStorage } =
    useStore();
  const t = translations[language];
  const router = useRouter();

  const [isConfirming, setIsConfirming] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
  });

  useEffect(() => {
    syncCartFromLocalStorage();
  }, [syncCartFromLocalStorage]);

  const subtotal = cart.reduce(
    (sum, item) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 1),
    0,
  );
  const shipping = subtotal > 200 ? 0 : 6;
  const grandTotal = subtotal + shipping;

  const handleRemove = async (bookId) => {
    try {
      await removeFromCart(bookId);
    } catch (error) {
      showError(t.cartOrderError || "Error", {
        description: `Failed to remove item: ${error.message}`,
      });
    }
  };

  const handleUpdateQuantity = async (bookId, newQty) => {
    try {
      await updateQuantity(bookId, newQty);
    } catch (error) {
      showError(t.cartOrderError || "Error", {
        description: `Failed to update quantity: ${error.message}`,
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleConfirmOrder = () => {
    setIsConfirming(true);
  };

  const handleOrderSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.address || !formData.phone) {
      showError(t.cartFormIncomplete || "الرجاء ملء جميع الحقول قبل تأكيد الطلب");
      return;
    }

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      const headers = { "Content-Type": "application/json" };
      if (session?.access_token) {
        headers.Authorization = `Bearer ${session.access_token}`;
      }

      const res = await fetch("/api/orders", {
        method: "POST",
        headers,
        body: JSON.stringify({
          name: formData.name,
          address: formData.address,
          phone: formData.phone,
          items: cart.map((item) => ({
            book_id: item.book_id,
            title: item.title,
            quantity: Number(item.quantity) || 1,
            price: Number(item.price) || 0,
          })),
          total_amount: grandTotal,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Order failed");
      }

      await clearCart();
      showSuccess(t.cartOrderSuccess || "تم تأكيد الطلب بنجاح!");
      setIsConfirming(false);
      router.push("/");
    } catch (error) {
      console.error("Order error:", error);
      showError(t.cartOrderError || "حدث خطأ أثناء إنشاء الطلب، الرجاء المحاولة لاحقاً.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-cream py-8 mt-40 px-4" dir="rtl">
      <div className="container mx-auto max-w-4xl">
        {cart.length === 0 ? (
          <motion.div
            className="text-center py-16"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="bg-white shadow-lg rounded-xl p-8 elegant-shadow">
              <CardContent>
                <div className="text-6xl mb-4">📚</div>
                <h2 className="text-2xl font-semibold text-burgundy mb-4 font-serif">
                  {t.cartEmpty}
                </h2>
                <Button
                  onClick={() => router.push("/shop")}
                  className="bg-burgundy text-white hover:bg-burgundy-dark transition-all px-8 py-3 rounded-lg font-semibold"
                >
                  تصفح الكتب
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <>
            <div className="space-y-4 mb-8">
              {cart.map((item, index) => {
                const displayTitle =
                  language === "ar"
                    ? item.title_ar || item.title_en
                    : item.title_en || item.title_ar;
                const displayAuthor =
                  language === "ar"
                    ? item.author_ar || item.author_en
                    : item.author_en || item.author_ar;
                const displayPublisher =
                  language === "ar"
                    ? item.publishing_house_ar || item.publishing_house_en
                    : item.publishing_house_en || item.publishing_house_ar;

                return (
                  <motion.div
                    key={`${item.book_id}-${index}`}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Card className="bg-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl overflow-hidden elegant-shadow">
                      <CardContent className="p-6">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                          <div className="w-20 h-24 flex-shrink-0">
                            <img
                              src={item.image || "/placeholder.jpg"}
                              alt={displayTitle}
                              className="w-full h-full object-cover rounded-lg shadow-sm"
                              onError={(e) => (e.target.src = "/placeholder.jpg")}
                            />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-burgundy font-serif mb-1">
                              {displayTitle}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {t.author}: {displayAuthor || t.unknown}
                            </p>
                            <p className="text-sm text-gray-600">
                              {t.publisher}: {displayPublisher || t.unknown}
                            </p>
                            <div className="flex items-center gap-4 text-sm text-warm-gray-600 mt-2">
                              <span className="font-medium">
                                {Number(item.price).toFixed(2)} × {item.quantity || 1}
                              </span>
                              <span className="font-bold text-burgundy">
                                = {(Number(item.price) * (item.quantity || 1)).toFixed(2)}{" "}
                                {t.priceTnd}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                handleUpdateQuantity(item.book_id, (item.quantity || 1) - 1)
                              }
                            >
                              -
                            </Button>
                            <span className="px-2">{item.quantity || 1}</span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                handleUpdateQuantity(item.book_id, (item.quantity || 1) + 1)
                              }
                            >
                              +
                            </Button>
                          </div>
                          <Button
                            variant="destructive"
                            onClick={() => handleRemove(item.book_id)}
                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                          >
                            <Trash size={16} />
                            {t.cartRemove}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>

            <Card className="bg-white shadow-lg rounded-xl elegant-shadow mb-8">
              <CardHeader className="bg-gradient-burgundy text-white rounded-t-xl">
                <CardTitle className="text-xl font-bold font-serif text-center">
                  {t.cartSummary}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 text-center">
                <div className="text-lg font-medium">
                  {t.subtotal}: {subtotal.toFixed(2)} {t.priceTnd}
                </div>
                <div className="text-lg font-medium">
                  {t.shipping}: {shipping.toFixed(2)} {t.priceTnd}
                  {shipping === 0 && `(${t.freeShipping})`}
                </div>
                <div className="text-3xl font-bold text-burgundy font-serif">
                  {t.cartTotal}: {grandTotal.toFixed(2)} {t.priceTnd}
                </div>
                <Button
                  onClick={handleConfirmOrder}
                  className="w-full mt-6 bg-burgundy hover:bg-burgundy-dark text-white py-3 rounded-lg font-semibold transition-all"
                >
                  {t.cartConfirmOrder}
                </Button>
              </CardContent>
            </Card>

            {isConfirming && (
              <Card className="bg-white shadow-lg rounded-xl elegant-shadow">
                <CardHeader className="bg-gradient-burgundy text-white rounded-t-xl">
                  <CardTitle className="text-xl font-bold font-serif">
                    {t.cartOrderDetails}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <form onSubmit={handleOrderSubmit} className="space-y-6">
                    <div>
                      <Label htmlFor="name" className="text-burgundy font-semibold mb-2 block">
                        {t.cartName}
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder={t.cartNamePlaceholder}
                      />
                    </div>
                    <div>
                      <Label htmlFor="address" className="text-burgundy font-semibold mb-2 block">
                        {t.cartAddress}
                      </Label>
                      <Input
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        placeholder={t.cartAddressPlaceholder}
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone" className="text-burgundy font-semibold mb-2 block">
                        {t.cartPhone}
                      </Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder={t.cartPhonePlaceholder}
                      />
                    </div>
                    <div className="flex gap-4">
                      <Button type="submit" className="flex-1 bg-burgundy text-white">
                        {t.cartPlaceOrder}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsConfirming(false)}
                        className="flex-1 border-burgundy text-burgundy hover:bg-burgundy hover:text-white"
                      >
                        إلغاء
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            <div className="text-center mt-8">
              <Button
                variant="outline"
                className="border-2 border-burgundy text-burgundy hover:bg-burgundy hover:text-white px-8 py-3 rounded-lg font-semibold transition-all"
                onClick={() => router.back()}
              >
                {t.backToStore}
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

const DynamicCart = dynamic(() => Promise.resolve(Cart), { ssr: false });

export default function CartPage() {
  return <DynamicCart />;
}
