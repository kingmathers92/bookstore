"use client";

import { useStore } from "@/lib/store";
import { Slider } from "@/components/ui/slider";
import { motion } from "framer-motion";
import { TrendingUp } from "lucide-react";
import translations from "@/lib/translations";

export default function PriceRangeFilter() {
  const { priceRange = [0, 1000], setPriceRange, language } = useStore();
  const t = translations[language] || translations.ar;

  return (
    <motion.div
      className="w-full max-w-sm bg-white rounded-2xl p-6 elegant-shadow hover:shadow-lg transition-all duration-300"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-burgundy/10 rounded-xl">
          <TrendingUp className="w-5 h-5 text-burgundy" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-burgundy font-serif">
            {t.priceRangeLabel || "نطاق السعر"}
          </h3>
        </div>
      </div>

      <div className="space-y-4">
        <div className="px-2">
          <Slider
            min={0}
            max={1000}
            step={10}
            value={priceRange}
            onValueChange={(value) => {
              setPriceRange([value[0], 1000]);
            }}
            className="w-full"
          />
        </div>

        <div className="flex justify-between text-sm text-warm-gray-500 px-2">
          <span>
            {priceRange[0]} {t.priceTnd}
          </span>
          <span>1000 {t.priceTnd}</span>
        </div>
      </div>
    </motion.div>
  );
}
