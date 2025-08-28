"use client";

import { Input } from "@/components/ui/input";

export default function SearchBar() {
  return (
    <div className="w-full max-w-md">
      <Input
        type="text"
        placeholder="ابحث عن كتاب..."
        className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-emerald-700"
      />
    </div>
  );
}
