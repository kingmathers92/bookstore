"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import BookOfTheDay from "@/components/BookOfTheDay";
import { ShoppingCart, BookOpen, Star, ArrowRight } from "lucide-react";
import { useStore } from "@/lib/store";
import translations from "@/lib/translations";

export default function Hero() {
  const { language } = useStore();
  const t = translations[language];

  return (
    <section className="relative bg-gradient-to-br from-cream via-white to-warm-gray overflow-hidden h-screen max-h-screen mt-10">
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 border border-burgundy rounded-full"></div>
        <div className="absolute top-40 right-20 w-24 h-24 border border-burgundy rounded-full"></div>
        <div className="absolute bottom-40 left-20 w-40 h-40 border border-burgundy rounded-full"></div>
        <div className="absolute bottom-20 right-10 w-28 h-28 border border-burgundy rounded-full"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 h-full flex items-center">
        <div className="grid lg:grid-cols-2 gap-8 items-center w-full">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-6"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-burgundy/10 text-burgundy px-3 py-2 rounded-full text-sm font-medium"
            >
              <Star size={14} className="text-burgundy" />
              {language === "ar" ? "الأفضل في الكتب الإسلامية" : "Best Islamic Books Collection"}
            </motion.div>

            <div className="space-y-3">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight font-serif">
                {t.heroTitle}
              </h1>
              <p className="text-base md:text-lg text-gray-600 leading-relaxed max-w-lg">
                {language === "ar"
                  ? "اكتشف مجموعة واسعة من الكتب الإسلامية عالية الجودة التي تثري معرفتك وتقوي إيمانك"
                  : "Discover a wide collection of high-quality Islamic books that enrich your knowledge and strengthen your faith"}
              </p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-3"
            >
              <Link href="/shop">
                <Button className="bg-burgundy hover:bg-burgundy-dark text-white px-6 py-3 rounded-xl font-semibold text-base elegant-shadow hover-lift transition-all duration-300 flex items-center gap-2">
                  <ShoppingCart size={18} />
                  {t.heroShopNow}
                  <ArrowRight size={14} />
                </Button>
              </Link>
              <Button
                variant="outline"
                className="border-2 border-burgundy text-burgundy hover:bg-burgundy hover:text-white px-6 py-3 rounded-xl font-semibold text-base transition-all duration-300 flex items-center gap-2"
              >
                <BookOpen size={18} />
                {language === "ar" ? "تصفح الكتالوج" : "Browse Catalog"}
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="grid grid-cols-3 gap-4 pt-6"
            >
              <div className="text-center">
                <div className="text-xl md:text-2xl font-bold text-burgundy font-serif">500+</div>
                <div className="text-xs text-gray-600">{language === "ar" ? "كتاب" : "Books"}</div>
              </div>
              <div className="text-center">
                <div className="text-xl md:text-2xl font-bold text-burgundy font-serif">1000+</div>
                <div className="text-xs text-gray-600">
                  {language === "ar" ? "عميل راضي" : "Happy Customers"}
                </div>
              </div>
              <div className="text-center">
                <div className="text-xl md:text-2xl font-bold text-burgundy font-serif">50+</div>
                <div className="text-xs text-gray-600">
                  {language === "ar" ? "دار نشر" : "Publishers"}
                </div>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="flex justify-center items-center w-full px-4"
          >
            <div className="relative w-full max-w-[280px] sm:max-w-[320px] md:max-w-[360px] lg:max-w-[400px]">
              <Card className="bg-white rounded-2xl overflow-hidden shadow-xl border-0">
                <CardContent className="p-0">
                  <div className="aspect-[3/4] relative">
                    <BookOfTheDay />

                    <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 to-transparent text-white">
                      <h3 className="text-sm sm:text-base font-bold font-serif">
                        {language === "ar" ? "كتاب اليوم" : "Book of the Day"}
                      </h3>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1200 120" className="w-full h-16 fill-white">
          <path d="M0,60 C300,120 900,0 1200,60 L1200,120 L0,120 Z"></path>
        </svg>
      </div>
    </section>
  );
}
