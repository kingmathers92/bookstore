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
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-32 h-32 border border-burgundy rounded-full"></div>
        <div className="absolute top-40 right-20 w-24 h-24 border border-burgundy rounded-full"></div>
        <div className="absolute bottom-40 left-20 w-40 h-40 border border-burgundy rounded-full"></div>
        <div className="absolute bottom-20 right-10 w-28 h-28 border border-burgundy rounded-full"></div>
      </div>

      <div className="relative z-10 container mx-auto px-6 h-full flex items-center">
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
            className="relative flex justify-center"
          >
            <div className="relative max-w-sm w-full">
              <Card className="bg-white elegant-shadow-lg hover-lift transition-all duration-500 overflow-hidden">
                <CardContent className="p-0">
                  <div className="aspect-[3/4] relative overflow-hidden">
                    <BookOfTheDay />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <h3 className="text-lg font-bold mb-1 font-serif">
                        {language === "ar"
                          ? "مجموعة مختارة بعناية"
                          : "Carefully Curated Collection"}
                      </h3>
                      <p className="text-xs opacity-90">
                        {language === "ar"
                          ? "كتب إسلامية أصيلة من أفضل دور النشر"
                          : "Authentic Islamic books from the best publishers"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="absolute -top-3 -right-3 bg-burgundy text-white p-3 rounded-2xl elegant-shadow-lg"
              >
                <BookOpen size={20} />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 1 }}
                className="absolute -bottom-3 -left-3 bg-white p-3 rounded-2xl elegant-shadow-lg"
              >
                <div className="flex items-center gap-2">
                  <Star size={14} className="text-yellow-500 fill-current" />
                  <span className="text-sm font-semibold text-gray-900">4.9/5</span>
                </div>
                <div className="text-xs text-gray-600 mt-1">
                  {language === "ar" ? "تقييم العملاء" : "Customer Rating"}
                </div>
              </motion.div>
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
