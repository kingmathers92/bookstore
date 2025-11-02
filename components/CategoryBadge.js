"use client";

import { Badge } from "@/components/ui/badge";

const categoryColors = {
  quran: "bg-emerald-600/90 hover:bg-emerald-600",
  hadith: "bg-blue-600/90 hover:bg-blue-600",
  fiqh: "bg-amber-600/90 hover:bg-amber-600",
  aqidah: "bg-rose-600/90 hover:bg-rose-600",
  language: "bg-pink-600/90 hover:bg-pink-600",
  history: "bg-slate-600/90 hover:bg-slate-600",
  culture: "bg-indigo-600/90 hover:bg-indigo-600",
  children: "bg-teal-600/90 hover:bg-teal-600",

  قرآن: "bg-emerald-600/90 hover:bg-emerald-600",
  حديث: "bg-blue-600/90 hover:bg-blue-600",
  فقه: "bg-amber-600/90 hover:bg-amber-600",
  عقيدة: "bg-rose-600/90 hover:bg-rose-600",
  لغة: "bg-pink-600/90 hover:bg-pink-600",
  تاريخ: "bg-slate-600/90 hover:bg-slate-600",
  ثقافة: "bg-indigo-600/90 hover:bg-indigo-600",
  طفل: "bg-teal-600/90 hover:bg-teal-600",

  default: "bg-[#c0555f]/90 hover:bg-[#c0555f]",
};

const CategoryBadge = ({ category }) => {
  if (!category) return null;

  const normalized = category.trim().toLowerCase();
  const colorClass =
    categoryColors[category] || categoryColors[normalized] || categoryColors.default;

  return (
    <Badge
      className={`absolute top-3 left-3 ${colorClass} text-white text-xs px-3 py-1 rounded-full shadow-sm backdrop-blur-sm transition-colors`}
    >
      {category}
    </Badge>
  );
};

export default CategoryBadge;
