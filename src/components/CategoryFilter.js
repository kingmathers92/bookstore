"use client";

import { Select } from "@/components/ui/select";

export default function CategoryFilter() {
  return (
    <div className="w-full max-w-xs">
      <Select>
        <option value="all">الكل</option>
        <option value="quran">قرآن</option>
        <option value="hadith">حديث</option>
        <option value="tafsir">تفسير</option>
      </Select>
    </div>
  );
}
