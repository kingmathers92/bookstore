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
  const { category = "all", setCategory } = useStore();

  const categoryMap = {
    الكل: "all",
    مصاحف: "مصاحف",
    تفسير: "تفسير",
    فقه: "فقه",
    لغة: "لغة",
    حديث: "حديث",
    سيرة: "سيرة",
    "مواعظ وتزكية": "مواعظ وتزكية",
    رقائق: "رقائق",
    دواوين: "دواوين",
    "كتب أطفال": "كتب أطفال",
    مناجد: "مناجد",
    "علوم قرآن": "علوم قرآن",
  };

  return (
    <div className="w-full max-w-xs">
      <Select value={category} onValueChange={setCategory}>
        <SelectTrigger className="w-full p-3 border-2 border-gray-200 focus:border-burgundy rounded-xl bg-white elegant-shadow focus:elegant-shadow-lg transition-all">
          <SelectValue placeholder="الكل" />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(categoryMap).map(([label, value]) => (
            <SelectItem key={value} value={value}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
