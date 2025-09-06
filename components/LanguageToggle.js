"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";

export default function LanguageToggle() {
  const [lang, setLang] = useState("ar");

  return (
    <div className="container mx-auto py-2 text-center">
      <Button
        variant="outline"
        onClick={() => setLang(lang === "ar" ? "en" : "ar")}
        className="bg-emerald-700 text-cream-100 flex items-center gap-2"
      >
        <Globe size={16} />{" "}
        {lang === "ar" ? "Switch to English" : "التبديل إلى العربية"}
      </Button>
    </div>
  );
}
