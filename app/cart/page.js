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

function Cart() {
  const { cart, removeFromCart, language, user, syncCartFromLocalStorage } = useStore();
  const t = translations[language];
  const router = useRouter();
  const { checkout } = useStore();

  const [isMobile, setIsMobile] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
  });

  useEffect(() => {
    syncCartFromLocalStorage();
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [syncCartFromLocalStorage]);

  const totalPrice = cart.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0);

  const handleRemove = async (bookId) => {
    try {
      await removeFromCart(bookId);
    } catch (error) {
      alert.error(t.cartOrderError || "Error", {
        description: `Failed to remove item: ${error.message}`,
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleOrderSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.address || !formData.phone) {
      alert(t.cartFormIncomplete);
      return;
    }

    try {
      await checkout(totalPrice);
      alert(t.cartOrderSuccess);
      router.push("/");
    } catch (error) {
      alert(t.cartOrderError);
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
              {cart.map((item, index) => (
                <motion.div
                  key={item.book_id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="bg-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl overflow-hidden elegant-shadow">
                    <CardContent className="p-6">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                        {/* IMAGE */}
                        <div className="w-20 h-24 flex-shrink-0">
                          <img
                            src={item.image || "/placeholder.jpg"}
                            alt={item.title}
                            className="w-full h-full object-cover rounded-lg shadow-sm"
                            onError={(e) => (e.target.src = "/placeholder.jpg")}
                          />
                        </div>

                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-burgundy font-serif mb-1">
                            {item.title}
                          </h3>
                          <div className="flex items-center gap-4 text-sm text-warm-gray-600">
                            <span className="font-medium">
                              {item.price} × {item.quantity || 1}
                            </span>
                            <span className="font-bold text-burgundy">
                              = {item.price * (item.quantity || 1)} ر.س
                            </span>
                          </div>
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
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Card className="bg-white shadow-lg rounded-xl elegant-shadow mb-8">
                <CardHeader className="bg-gradient-burgundy text-white rounded-t-xl">
                  <CardTitle className="text-xl font-bold font-serif text-center">
                    {t.cartSummary}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-burgundy font-serif">
                      {t.cartTotal}: {totalPrice}
                    </div>
                  </div>
                  <Button
                    onClick={() => setIsConfirming(true)}
                    className="w-full mt-6 bg-burgundy hover:bg-burgundy-dark text-white py-3 rounded-lg font-semibold transition-all"
                  >
                    {t.cartConfirmOrder}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {isConfirming && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
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
                          className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-burgundy focus:ring-2 focus:ring-burgundy/20 transition-all"
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
                          className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-burgundy focus:ring-2 focus:ring-burgundy/20 transition-all"
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
                          className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-burgundy focus:ring-2 focus:ring-burgundy/20 transition-all"
                        />
                      </div>
                      <div className="flex gap-4">
                        <Button
                          type="submit"
                          className="flex-1 bg-burgundy hover:bg-burgundy-dark text-white py-3 rounded-lg font-semibold transition-all"
                        >
                          {t.cartPlaceOrder}
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setIsConfirming(false)}
                          className="flex-1 border-2 border-burgundy text-burgundy hover:bg-burgundy hover:text-white py-3 rounded-lg font-semibold transition-all"
                        >
                          إلغاء
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </motion.div>
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

const DynamicCart = dynamic(async () => ({ default: Cart }), { ssr: false });

export default function CartPage() {
  return <DynamicCart />;
}
