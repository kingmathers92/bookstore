"use client";

import { useStore } from "@/lib/store";
import { Slider } from "@/components/ui/slider";
import { motion } from "framer-motion";
import { DollarSign, TrendingUp } from "lucide-react";
import translations from "@/lib/translations";

export default function PriceRangeFilter() {
  const { priceRange, setPriceRange, language } = useStore();
  const t = translations[language];

  return (
    <motion.div
      className="w-full max-w-sm bg-white rounded-2xl p-6 elegant-shadow hover:shadow-lg transition-all duration-300"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {" "}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-burgundy/10 rounded-xl">
          <TrendingUp className="w-5 h-5 text-burgundy" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-burgundy font-serif">
            {t.priceRangeLabel || "نطاق السعر"}
          </h3>
          <p className="text-sm text-warm-gray-600">اختر النطاق المناسب لك</p>
        </div>
      </div>
      <div className="space-y-6">
        <div className="bg-gradient-cream rounded-xl p-4 border border-burgundy/10">
          <div className="flex items-center justify-between">
            <div className="text-center">
              <p className="text-xs text-warm-gray-600 mb-1">من</p>
              <div className="flex items-center gap-1">
                <DollarSign className="w-4 h-4 text-burgundy" />
                <span className="text-xl font-bold text-burgundy">{priceRange[0]}</span>
              </div>
            </div>

            <div className="flex-1 mx-4">
              <div className="h-px bg-gradient-burgundy"></div>
            </div>

            <div className="text-center">
              <p className="text-xs text-warm-gray-600 mb-1">إلى</p>
              <div className="flex items-center gap-1">
                <DollarSign className="w-4 h-4 text-burgundy" />
                <span className="text-xl font-bold text-burgundy">{priceRange[1]}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="px-2">
          <Slider
            min={0}
            max={1000}
            step={10}
            value={priceRange}
            onValueChange={setPriceRange}
            className="w-full"
          />
        </div>

        <div className="flex justify-between text-sm text-warm-gray-500 px-2">
          <span className="flex items-center gap-1">
            <span>0</span>
            <span className="text-xs">{t.priceTnd || "ر.س"}</span>
          </span>
          <span className="flex items-center gap-1">
            <span>1000</span>
            <span className="text-xs">{t.priceTnd || "ر.س"}</span>
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {[
            { label: "اقتصادي", range: [0, 100] },
            { label: "متوسط", range: [100, 300] },
            { label: "مميز", range: [300, 1000] },
          ].map((preset, index) => (
            <motion.button
              key={preset.label}
              onClick={() => setPriceRange(preset.range)}
              className={`px-3 py-2 text-xs font-medium rounded-lg transition-all duration-200 ${
                priceRange[0] === preset.range[0] && priceRange[1] === preset.range[1]
                  ? "bg-burgundy text-white shadow-md"
                  : "bg-burgundy/5 text-burgundy hover:bg-burgundy/10"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {preset.label}
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
