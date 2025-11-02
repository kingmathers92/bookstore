"use client";

import { Badge } from "@/components/ui/badge";

const categoryColors = {
  quran: "bg-emerald-600/90 hover:bg-emerald-600",
  "quranic sciences": "bg-teal-600/90 hover:bg-teal-600",
  hadith: "bg-blue-600/90 hover:bg-blue-600",
  "islamic studies": "bg-indigo-600/90 hover:bg-indigo-600",
  "aqidah (creed)": "bg-rose-600/90 hover:bg-rose-600",
  fiqh: "bg-amber-600/90 hover:bg-amber-600",
  history: "bg-slate-600/90 hover:bg-slate-600",
  biography: "bg-purple-600/90 hover:bg-purple-600",
  literature: "bg-pink-600/90 hover:bg-pink-600",

  القرآن: "bg-emerald-600/90 hover:bg-emerald-600",
  "علوم القرآن": "bg-teal-600/90 hover:bg-teal-600",
  الحديث: "bg-blue-600/90 hover:bg-blue-600",
  "الدراسات الإسلامية": "bg-indigo-600/90 hover:bg-indigo-600",
  العقيدة: "bg-rose-600/90 hover:bg-rose-600",
  الفقه: "bg-amber-600/90 hover:bg-amber-600",
  التاريخ: "bg-slate-600/90 hover:bg-slate-600",
  السيرة: "bg-purple-600/90 hover:bg-purple-600",
  الأدب: "bg-pink-600/90 hover:bg-pink-600",

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
