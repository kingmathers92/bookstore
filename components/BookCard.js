"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useStore } from "@/lib/store";
import { ShoppingCart } from "lucide-react";

export default function BookCard({ title, price, image, alt, id }) {
  const addToCart = useStore((state) => state.addToCart);

  return (
    <motion.div
      whileHover={{ scale: 1.05, rotate: 0.5 }}
      transition={{ duration: 0.4 }}
      aria-label={`كتاب ${title} بسعر ${price} ر.س`}
    >
      <Card className="border-t-4 border-gold-300 overflow-hidden">
        <CardHeader>
          {image ? (
            <img
              src={image}
              alt={alt}
              className="w-full h-56 object-cover rounded-t-lg"
              loading="lazy"
              onError={(e) => {
                e.target.src = "/images/placeholder.png";
              }}
            />
          ) : (
            <Skeleton className="w-full h-56" />
          )}
        </CardHeader>
        <CardContent className="p-4">
          <CardTitle className="text-xl font-semibold text-gray-800 mb-2">
            {title || <Skeleton className="h-6 w-3/4" />}
          </CardTitle>
          <p className="text-gray-600 mb-4">
            {price ? `${price} ر.س` : <Skeleton className="h-4 w-1/2" />}
          </p>
          <Button
            className="bg-emerald-700 text-cream-100 hover:bg-green-900 w-full flex items-center gap-2"
            onClick={() => addToCart({ id, title, price })}
          >
            <ShoppingCart size={16} /> أضف إلى السلة
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}
