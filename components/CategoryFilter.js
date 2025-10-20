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
  const { category, setCategory } = useStore();

  return (
    <div className="w-full max-w-xs">
      <Select value={category} onValueChange={setCategory}>
        <SelectTrigger className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-emerald-700">
          <SelectValue placeholder="الكل" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">الكل</SelectItem>
          <SelectItem value="مصاحف">مصاحف</SelectItem>
          <SelectItem value="تفسير">تفسير</SelectItem>
          <SelectItem value="فقه">فقه</SelectItem>
          <SelectItem value="لغة">لغة</SelectItem>
          <SelectItem value="حديث">حديث</SelectItem>
          <SelectItem value="سيرة">سيرة</SelectItem>
          <SelectItem value="مواعظ وتزكية">مواعظ وتزكية</SelectItem>
          <SelectItem value="رقائق">رقائق</SelectItem>
          <SelectItem value="دواوين">دواوين</SelectItem>
          <SelectItem value="كتب أطفال">كتب أطفال</SelectItem>
          <SelectItem value="مناجد">مناجد</SelectItem>
          <SelectItem value="علوم قرآن">علوم قرآن</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
