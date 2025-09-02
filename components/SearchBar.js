"use client";

import { Input } from "@/components/ui/input";
import { useStore } from "@/lib/store";

export default function SearchBar() {
  const { searchQuery, setSearchQuery } = useStore();

  return (
    <div className="w-full max-w-md">
      <Input
        type="text"
        placeholder="ابحث عن كتاب..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-emerald-700"
      />
    </div>
  );
}
