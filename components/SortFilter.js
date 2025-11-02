"use client";

import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import translations from "@/lib/translations";

export default function SortFilter({ sortOrder, setSortOrder, language }) {
  const t = translations[language] || translations.ar;

  return (
    <div className="w-[100px] sm:w-[100px]">
      <Select value={sortOrder} onValueChange={setSortOrder}>
        <SelectTrigger
          className="
            w-full
            py-3
            text-sm
            border-2
            border-gray-200
            focus:border-burgundy
            rounded-xl
            bg-white
            elegant-shadow
            focus:elegant-shadow-lg
            transition-all
            duration-300
          "
        >
          <SelectValue placeholder={language === "ar" ? "فرز حسب" : "Sort by"} />
        </SelectTrigger>

        <SelectContent className="rounded-xl shadow-md">
          <SelectItem value="newest">{language === "ar" ? "الأحدث" : "Newest"}</SelectItem>
          <SelectItem value="oldest">{language === "ar" ? "الأقدم" : "Oldest"}</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
