"use client";

import { Input } from "@/components/ui/input";
import { useStore } from "@/lib/store";
import { Search } from "lucide-react";
import translations from "@/lib/translations";

export default function SearchBar() {
  const { searchQuery, setSearchQuery, language } = useStore();
  const t = translations[language];

  return (
    <div className="w-full max-w-md">
      <div className="relative">
        <Input
          type="text"
          placeholder={t.searchPlaceholder}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10"
        />
        <Search
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          size={20}
        />
      </div>
    </div>
  );
}
