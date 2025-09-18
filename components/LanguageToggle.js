"use client";

import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";
import { useStore } from "@/lib/store";

export default function LanguageToggle() {
  const { language, setLanguage } = useStore();

  const toggleLanguage = () => {
    const newLang = language === "ar" ? "en" : "ar";
    setLanguage(newLang);
  };

  return (
    <Button
      variant="outline"
      onClick={toggleLanguage}
      className="bg-gradient-to-r from-[var(--header-gradient-start)] to-[var(--header-gradient-end)] text-primary-foreground hover:bg-accent hover:text-primary-foreground hover:shadow-md transition-all duration-300 rounded-full px-4 py-2 flex items-center gap-2 hover:cursor-pointer"
      aria-label={`Switch to ${language === "ar" ? "English" : "العربية"}`}
    >
      <Globe size={16} />
      {language === "ar" ? "English" : "العربية"}
    </Button>
  );
}
