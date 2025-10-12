"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useStore } from "@/lib/store";
import translations from "@/lib/translations";
import { supabase } from "@/lib/supabase";

export default function SearchBar() {
  const { searchQuery, setSearchQuery, language, isTyping, searchHistory, loadSearchHistory } =
    useStore();
  const [suggestions, setSuggestions] = useState([]);
  const [isFocused, setIsFocused] = useState(false);
  const t = translations[language];

  useEffect(() => {
    loadSearchHistory();
  }, [loadSearchHistory]);

  useEffect(() => {
    if (!searchQuery) {
      setSuggestions(searchHistory);
      return;
    }
    const fetchSuggestions = async () => {
      const { data, error } = await supabase
        .from("books")
        .select("title_en, title_ar")
        .ilike(language === "ar" ? "title_ar" : "title_en", `%${searchQuery}%`)
        .limit(5);
      if (error) {
        console.error("Error fetching suggestions:", error);
        return;
      }
      const titles = data
        .map((book) =>
          language === "ar" ? book.title_ar || book.title_en : book.title_en || book.title_ar,
        )
        .filter(Boolean);
      setSuggestions([...new Set([...searchHistory, ...titles])].slice(0, 5));
    };
    const debounce = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounce);
  }, [searchQuery, language, searchHistory]);

  const handleSelectSuggestion = (suggestion) => {
    setSearchQuery(suggestion);
    setIsFocused(false);
  };

  return (
    <div className="w-full max-w-md relative">
      <div className="relative">
        <Input
          type="text"
          placeholder={t.searchPlaceholder}
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            useStore.setState({ isTyping: true });
          }}
          onBlur={() => {
            setTimeout(() => setIsFocused(false), 200); // delay to allow suggestion click
            useStore.setState({ isTyping: false });
          }}
          onFocus={() => setIsFocused(true)}
          className="w-full pl-10 pr-10"
        />
        <Search
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          size={20}
        />
        {isTyping && (
          <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 flex">
            <span className="dot-flashing"></span>
            <span className="dot-flashing" style={{ animationDelay: "0.2s" }}></span>
            <span className="dot-flashing" style={{ animationDelay: "0.4s" }}></span>
          </span>
        )}
      </div>
      {isFocused && suggestions.length > 0 && (
        <ul className="absolute z-10 w-full bg-white border border-gray-200 rounded-md mt-1 shadow-lg max-h-40 overflow-y-auto">
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-foreground"
              onClick={() => handleSelectSuggestion(suggestion)}
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
