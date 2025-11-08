"use client";

import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { useStore } from "@/lib/store";
import translations from "@/lib/translations";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";

export default function SearchBar() {
  const {
    searchQuery,
    setSearchQuery,
    language,
    isTyping,
    setIsTyping,
    searchHistory,
    loadSearchHistoryFromSupabase,
  } = useStore();

  const [suggestions, setSuggestions] = useState([]);
  const [isFocused, setIsFocused] = useState(false);
  const t = translations[language];
  const debounceRef = useRef(null);

  useEffect(() => {
    loadSearchHistoryFromSupabase();
  }, [loadSearchHistoryFromSupabase]);

  useEffect(() => {
    if (!searchQuery) {
      setSuggestions(searchHistory);
      setIsTyping(false);
      return;
    }

    setIsTyping(true);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      try {
        const { data, error } = await supabase
          .from("books")
          .select("title_en, title_ar")
          .ilike(language === "ar" ? "title_ar" : "title_en", `%${searchQuery}%`)
          .limit(5);

        if (error) throw error;

        const titles = data
          .map((b) => (language === "ar" ? b.title_ar || b.title_en : b.title_en || b.title_ar))
          .filter(Boolean);

        setSuggestions([...new Set([...searchHistory, ...titles])].slice(0, 5));
      } catch (e) {
        console.error("Search suggestions error:", e);
      } finally {
        setIsTyping(false);
      }
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [searchQuery, language, searchHistory, setIsTyping]);

  const handleSelect = (s) => {
    setSearchQuery(s);
    setIsFocused(false);
  };

  const clear = () => {
    setSearchQuery("");
    setIsFocused(false);
  };

  return (
    <div className="w-full max-w-md relative">
      <div className="relative">
        <Input
          type="text"
          placeholder={t.searchPlaceholder}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          className="w-full pl-12 pr-12 py-3 border-2 border-gray-200 focus:border-burgundy rounded-xl bg-white elegant-shadow focus:elegant-shadow-lg transition-all duration-300"
        />
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />

        {searchQuery && (
          <button
            onClick={clear}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-burgundy transition-colors"
          >
            <X size={20} />
          </button>
        )}

        {isTyping && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-1">
            <div className="dot-flashing"></div>
            <div className="dot-flashing" style={{ animationDelay: "0.2s" }}></div>
            <div className="dot-flashing" style={{ animationDelay: "0.4s" }}></div>
          </div>
        )}
      </div>

      <AnimatePresence>
        {isFocused && suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute z-20 w-full bg-white border border-gray-200 rounded-xl mt-2 elegant-shadow-lg max-h-60 overflow-y-auto"
          >
            {suggestions.map((s, i) => (
              <motion.button
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2, delay: i * 0.05 }}
                className="w-full px-4 py-3 text-left hover:bg-warm-gray cursor-pointer text-gray-700 hover:text-burgundy transition-colors border-b border-gray-100 last:border-b-0 flex items-center gap-3"
                onMouseDown={() => handleSelect(s)}
              >
                <Search size={16} className="text-gray-400" />
                <span className="truncate">{s}</span>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
