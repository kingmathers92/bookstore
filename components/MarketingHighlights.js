"use client";
import { Truck, ShieldCheck, Clock } from "lucide-react";
import { useStore } from "@/lib/store";

export default function MarketingHighlights() {
  const { language } = useStore();

  const highlights = [
    {
      icon: <Truck className="w-5 h-5 text-burgundy" />,
      en: "Fast & secure delivery with the Post Office",
      ar: "توصيل سريع وآمن مع البريد",
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-burgundy" />,
      en: "Trusted and verified book sources",
      ar: "مصادر كتب موثوقة ومضمونة",
    },
    {
      icon: <Clock className="w-5 h-5 text-burgundy" />,
      en: "Customer support every day",
      ar: "دعم العملاء طوال الأسبوع",
    },
  ];

  return (
    <div
      className={`mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center ${
        language === "ar" ? "rtl" : ""
      }`}
    >
      {highlights.map((h, i) => (
        <div
          key={i}
          className="bg-white/70 backdrop-blur-sm rounded-xl shadow-sm py-4 px-2 flex flex-col items-center gap-2 border border-burgundy/10"
        >
          {h.icon}
          <p className="text-sm font-medium text-gray-700">{language === "ar" ? h.ar : h.en}</p>
        </div>
      ))}
    </div>
  );
}
