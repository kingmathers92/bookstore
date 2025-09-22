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
        max={100}
        step={5}
        value={priceRange}
        onValueChange={setPriceRange}
        className="w-full"
      />
      <div className="flex justify-between mt-2">
        <span>{priceRange[0]} د.ت.</span>
        <span>{priceRange[1]} د.ت.</span>
      </div>
    </div>
  );
}
