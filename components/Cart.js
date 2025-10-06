"use client";

import { useState, useEffect } from "react";
import { useStore } from "@/lib/store";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import translations from "@/lib/translations";
import { supabase } from "@/lib/supabase";
import { toast } from "@/components/ui/sonner";

export default function Cart() {
  const { cart, removeFromCart, language } = useStore();
  const t = translations[language];

  const totalPrice = cart.reduce(
    (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
    0
  );

  const [isMobile, setIsMobile] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
  });

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleRemove = async (bookId) => {
    try {
      await removeFromCart(bookId);
    } catch (error) {
      toast.error(t.cartOrderError || "Error", {
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
      toast.error(t.cartFormIncomplete || "Incomplete Form", {
        description: t.cartFormIncomplete || "Please fill in all fields.",
      });
      return;
    }

    const orderDetails = {
      userId: useStore.getState().user?.id || "guest",
      items: cart.map((item) => ({
        bookId: item.book_id,
        title: item.title,
        price: item.price,
        quantity: item.quantity || 1,
      })),
      totalPrice,
      ...formData,
      status: "pending",
      orderDate: new Date().toISOString(),
    };

    try {
      const { error } = await supabase.from("orders").insert(orderDetails);
      if (error) throw error;

      await fetch("/api/sendOrderEmail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: "orders@thamarat-alawarak.com",
          subject: "New Order - Cash on Delivery",
          text: `New order from ${
            formData.name
          }\nTotal: ${totalPrice} ر.س\nItems: ${JSON.stringify(
            orderDetails.items
          )}\nAddress: ${formData.address}\nPhone: ${formData.phone}`,
        }),
      });

      toast.success(t.cartOrderSuccess || "Order Placed!", {
        description:
          t.cartOrderConfirm ||
          "Your order has been placed for cash on delivery. We'll contact you soon.",
      });
      setFormData({ name: "", address: "", phone: "" });
      useStore.getState().set({ cart: [] });
    } catch (error) {
      toast.error(t.cartOrderError || "Error", {
        description: `Failed to place order: ${error.message}`,
      });
    }
  };

  return (
    <div className="container mx-auto py-6 sm:py-8 lg:py-12 max-w-4xl">
      {" "}
      {/* Constrain width */}
      <h2 className="text-2xl sm:text-3xl md:text-3xl lg:text-4xl font-bold text-green-900 mb-6 sm:mb-8 text-center">
        {t.cartTitle}
      </h2>
      {cart.length === 0 ? (
        <p className="text-center text-muted-foreground text-lg sm:text-xl">
          {t.cartEmpty}
        </p>
      ) : (
        <>
          <div className="space-y-4 sm:space-y-6">
            {cart.map((item) => (
              <Card
                key={item.book_id}
                className="flex flex-col sm:flex-row justify-between items-center p-4 sm:p-6 shadow-md hover:shadow-lg transition-shadow"
              >
                <CardHeader className="p-0 sm:p-2 w-full sm:w-2/3 md:w-3/4">
                  <CardTitle className="text-base sm:text-lg md:text-xl lg:text-xl font-semibold line-clamp-2">
                    {item.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0 sm:p-2 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                  <span className="text-sm sm:text-base md:text-lg lg:text-lg font-medium">
                    {item.price} ر.س x {item.quantity || 1}
                  </span>
                  <Button
                    variant="destructive"
                    onClick={() => handleRemove(item.book_id)}
                    className="w-full sm:w-auto mt-2 sm:mt-0 px-3 py-2 flex items-center gap-2"
                    aria-label={`${t.cartRemove} ${item.title}`}
                  >
                    <Trash size={isMobile ? 14 : 16} /> {t.cartRemove}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          <Card className="mt-8 sm:mt-10 lg:mt-12 p-4 sm:p-6 shadow-md">
            <CardHeader>
              <CardTitle className="text-xl sm:text-2xl md:text-2xl lg:text-3xl font-bold text-green-900">
                {t.cartSummary}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-lg sm:text-xl md:text-xl lg:text-2xl font-semibold text-right">
                {t.cartTotal}:{" "}
                <span className="text-green-700">{totalPrice} ر.س</span>
              </p>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button
                onClick={() => setIsConfirming(true)}
                className="bg-emerald-700 text-cream-100 px-4 py-2 hover:bg-emerald-800 transition-colors"
              >
                {t.cartConfirmOrder}
              </Button>
            </CardFooter>
          </Card>

          {isConfirming && (
            <Card className="mt-8 sm:mt-10 lg:mt-12 p-4 sm:p-6 shadow-md">
              <CardHeader>
                <CardTitle className="text-xl sm:text-2xl md:text-2xl lg:text-3xl font-bold text-green-900">
                  {t.cartOrderDetails}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleOrderSubmit} className="space-y-4">
                  <div>
                    <Label
                      htmlFor="name"
                      className="text-sm sm:text-base md:text-lg"
                    >
                      {t.cartName}
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder={t.cartNamePlaceholder}
                      className="w-full mt-1"
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="address"
                      className="text-sm sm:text-base md:text-lg"
                    >
                      {t.cartAddress}
                    </Label>
                    <Input
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder={t.cartAddressPlaceholder}
                      className="w-full mt-1"
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="phone"
                      className="text-sm sm:text-base md:text-lg"
                    >
                      {t.cartPhone}
                    </Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder={t.cartPhonePlaceholder}
                      className="w-full mt-1"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="bg-emerald-700 text-cream-100 px-4 py-2 w-full sm:w-auto hover:bg-emerald-800 transition-colors"
                  >
                    {t.cartPlaceOrder}
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
