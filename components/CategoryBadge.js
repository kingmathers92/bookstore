"use client";

import { useStore } from "@/lib/store";
import translations from "@/lib/translations";

const CategoryBadge = ({ category }) => {
  const { language } = useStore();
  const t = translations[language];

  const categoryColors = {
    tafsir: "bg-primary",
    hadith: "bg-green-500",
    fiqh: "bg-yellow-500",
    biography: "bg-blue-600",
    uncategorized: "bg-gray-300",
    history: "bg-purple-500",
    default: "bg-gray-200",
  };
  const categoryMap = {
    تفسير: "tafsir",
    حديث: "hadith",
    فقه: "fiqh",
    سيرة: "biography",
  };
  const safeCategory = category?.toLowerCase() || "uncategorized";
  const mappedCategory = categoryMap[safeCategory] || safeCategory;
  const badgeColor = categoryColors[mappedCategory] || categoryColors.default;

  return (
    <div
      className={`absolute top-2 left-2 px-3 py-1 text-xs font-semibold text-white rounded-full ${badgeColor} shadow-md transition-all duration-200 group-hover:scale-105`}
      style={{ zIndex: 10, maxWidth: "calc(100% - 16px)" }}
    >
      {category || t.uncategorized}
    </div>
  );
};

export default CategoryBadge;
