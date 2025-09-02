"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useStore } from "@/lib/store";

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
          <img
            src={image}
            alt={alt}
            className="w-full h-56 object-cover rounded-t-lg"
            loading="lazy"
            onError={(e) => {
              e.target.src = "/images/placeholder.webp";
            }}
          />
        </CardHeader>
        <CardContent className="p-4">
          <CardTitle className="text-xl font-semibold text-gray-800 mb-2">
            {title}
          </CardTitle>
          <p className="text-gray-600 mb-4">{price} ر.س</p>
          <Button
            className="bg-emerald-700 text-cream-100 hover:bg-green-900 w-full"
            onClick={() => addToCart({ id, title, price })}
          >
            أضف إلى السلة
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}
