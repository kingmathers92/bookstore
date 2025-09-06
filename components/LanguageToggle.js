"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";

export default function LanguageToggle() {
  const [lang, setLang] = useState("ar");

  return (
    <Button
      variant="outline"
      onClick={() => setLang(lang === "ar" ? "en" : "ar")}
      className="bg-emerald-700 text-cream-100 flex items-center gap-2"
    >
      <Globe size={16} />
      {lang === "ar" ? "English" : "العربية"}
    </Button>
  );
}
