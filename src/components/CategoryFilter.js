"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function CategoryFilter() {
  return (
    <div className="w-full max-w-xs">
      <Select>
        <SelectTrigger className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-emerald-700">
          <SelectValue placeholder="الكل" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">الكل</SelectItem>
          <SelectItem value="quran">قرآن</SelectItem>
          <SelectItem value="hadith">حديث</SelectItem>
          <SelectItem value="tafsir">تفسير</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
