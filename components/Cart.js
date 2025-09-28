"use client";

import { useStore } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import translations from "@/lib/translations";

export default function Cart() {
  const { cart, removeFromCart, language } = useStore();
  const t = translations[language];

  const totalPrice = cart.reduce((sum, item) => sum + (item.price || 0), 0);

  return (
    <div className="container mx-auto py-4 sm:py-8">
      <h2 className="text-2xl sm:text-3xl font-bold text-green-900 mb-2 sm:mb-4">
        {t.cartTitle}
      </h2>
      {cart.length === 0 ? (
        <p className="text-center text-muted-foreground">{t.cartEmpty}</p>
      ) : (
        <div className="space-y-2 sm:space-y-4">
          {cart.map((item) => (
            <Card
              key={item.id || item.book_id}
              className="flex flex-col sm:flex-row justify-between items-center p-2 sm:p-4"
            >
              <CardHeader className="p-0 sm:p-2">
                <CardTitle className="text-base sm:text-lg">
                  {item.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 sm:p-2 flex items-center gap-2 sm:gap-4">
                <span className="text-sm sm:text-base">{item.price} ر.س</span>
                <Button
                  variant="destructive"
                  onClick={() => removeFromCart(item.book_id)}
                  className="flex items-center gap-1 sm:gap-2 p-1 sm:p-2"
                  aria-label={`${t.cartRemove} ${item.title}`}
                >
                  <Trash size={14} sm:size={16} /> {t.cartRemove}
                </Button>
              </CardContent>
            </Card>
          ))}
          <div className="mt-4 text-right">
            <p className="text-lg sm:text-xl font-semibold">
              {t.cartTotal}: {totalPrice} ر.س
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
