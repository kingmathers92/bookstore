"use client";

import { useStore } from "@/lib/store";
import { Slider } from "@/components/ui/slider";
import translations from "@/lib/translations";

export default function PriceRangeFilter() {
  const { priceRange, setPriceRange, language } = useStore();
  const t = translations[language];

  return (
    <div className="w-full max-w-xs">
      <label className="block text-sm font-medium mb-2">
        {t.priceRangeLabel || "Price Range (TND)"}
      </label>
      <Slider
        min={0}
        max={1000}
        step={10}
        value={priceRange}
        onValueChange={setPriceRange}
        className="w-full"
      />
      <div className="flex justify-between mt-2">
        <span>
          {priceRange[0]} {t.priceTnd}
        </span>
        <span>
          {priceRange[1]} {t.priceTnd}
        </span>
      </div>
    </div>
  );
}
