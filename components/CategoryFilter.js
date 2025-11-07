"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useStore } from "@/lib/store";

export default function CategoryFilter() {
  const { category = "all", setCategory, language } = useStore();

  const categoryMap = {
    all: { en: "All", ar: "الكل" },
    quran: { en: "Quran", ar: "قرآن" },
    hadith: { en: "Hadith", ar: "حديث" },
    fiqh: { en: "Fiqh", ar: "الفقه" },
    aqidah: { en: "Aqidah", ar: "عقيدة" },
    language: { en: "Language", ar: "لغة" },
    history: { en: "History", ar: "تاريخ" },
    culture: { en: "Culture", ar: "ثقافة" },
    children: { en: "Children", ar: "طفل" },
    seerah: { en: "Seerah", ar: "سيرة" },
  };

  return (
    <div className="w-full max-w-xs">
      <Select value={category} onValueChange={setCategory}>
        <SelectTrigger className="w-full p-3 border-2 border-gray-200 focus:border-burgundy rounded-xl bg-white elegant-shadow focus:elegant-shadow-lg transition-all">
          <SelectValue placeholder={language === "ar" ? "الكل" : "All"} />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(categoryMap).map(([key, value]) => (
            <SelectItem key={key} value={key}>
              {language === "ar" ? value.ar : value.en}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
