"use client";

import { useStore } from "@/lib/store";
import translations from "@/lib/translations";

const StockStatus = ({ inStock, language }) => {
  const t = translations[language];

  const stockText =
    language === "ar"
      ? inStock
        ? "متوفر"
        : "غير متوفر"
      : inStock
      ? "In Stock"
      : "Sold Out";
  const stockColor = inStock ? "bg-green-600" : "bg-red-600";
  const stockTextColor = "text-white";

  return (
    <div
      className={`absolute bottom-2 right-2 px-3 py-1 text-xs font-semibold rounded-full ${stockColor} ${stockTextColor} shadow-md transition-all duration-200`}
      style={{ zIndex: 10, maxWidth: "calc(100% - 16px)" }}
    >
      {stockText}
    </div>
  );
};

export default StockStatus;
