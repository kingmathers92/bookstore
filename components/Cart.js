"use client";

import { useStore } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import translations from "@/lib/translations";

export default function Cart() {
  const { cart, removeFromCart, language } = useStore();
  const t = translations[language];

  return (
    <div className="container mx-auto py-8">
      <h2 className="text-3xl font-bold text-green-900 mb-4">{t.cartTitle}</h2>
      {cart.length === 0 ? (
        <p>{t.cartEmpty}</p>
      ) : (
        <div className="space-y-4">
          {cart.map((item) => (
            <Card key={item.id}>
              <CardHeader>
                <CardTitle>{item.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex justify-between items-center">
                <span>{item.price} ر.س</span>
                <Button
                  variant="destructive"
                  onClick={() => removeFromCart(item.id)}
                  className="flex items-center gap-2"
                  aria-label={`${t.cartRemove} ${item.title}`}
                >
                  <Trash size={16} /> {t.cartRemove}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
