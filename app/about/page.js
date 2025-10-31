"use client";

import { useStore } from "@/lib/store";
import translations from "@/lib/translations";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function About() {
  const { language } = useStore();
  const t = translations[language];

  const categories = [
    { value: "quran", ar: "قرآن", en: "Quran" },
    { value: "hadith", ar: "حديث", en: "Hadith" },
    { value: "fiqh", ar: "فقه", en: "Fiqh" },
    { value: "biography", ar: "سيرة", en: "Biography" },
    // Add more
  ];

  return (
    <div
      className="min-h-screen bg-gradient-cream py-12 px-4"
      dir={language === "ar" ? "rtl" : "ltr"}
    >
      <div className="container mx-auto max-w-4xl">
        <motion.h1
          className="text-4xl font-bold text-white mb-8 text-center font-serif"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {t.aboutUs || "من نحن"}
        </motion.h1>

        <Card className="bg-burgundy shadow-lg rounded-xl p-8 elegant-shadow">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-white font-serif mb-4">
              {language === "ar" ? "قصتنا" : "Our Story"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 text-gray-700 leading-relaxed">
            <p>
              {language === "ar"
                ? "ثمرات الأوراق هو متجر إلكتروني متخصص في الكتب الإسلامية."
                : "Thamarat Al-Awraq is an online store specializing in Islamic books."}
            </p>

            <h2 className="text-xl font-semibold text-white font-serif mt-6">
              {t.categories || "الفئات"}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {categories.map((cat) => (
                <Link
                  key={cat.value}
                  href={`/shop?category=${cat.value}`}
                  className="block p-4 bg-gray-100 rounded-lg hover:bg-burgundy hover:text-white transition-all text-center font-semibold"
                >
                  {language === "ar" ? cat.ar : cat.en}
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
