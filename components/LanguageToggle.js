"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";
import { useStore } from "@/lib/store";
import translations from "@/lib/transltaions";

export default function LanguageToggle() {
  const { language, setLanguage } = useStore();

  const toggleLanguage = () => {
    const newLang = language === "ar" ? "en" : "ar";
    setLanguage(newLang);
  };

  return (
    <div className="container mx-auto py-2 text-center">
      <Button
        variant="outline"
        onClick={toggleLanguage}
        className="bg-emerald-700 text-cream-100 flex items-center gap-2"
        aria-label={`Switch to ${language === "ar" ? "English" : "العربية"}`}
      >
        <Globe size={16} />
        {language === "ar" ? "Switch to English" : "التبديل إلى العربية"}
      </Button>
    </div>
  );
}
