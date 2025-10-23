"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart, BookOpen, Star, ArrowRight } from "lucide-react";
import { useStore } from "@/lib/store";
import translations from "@/lib/translations";
import { useMediaQuery } from "react-responsive";

export default function Hero() {
  const { language } = useStore();
  const t = translations[language];
  const isSmall = useMediaQuery({ maxWidth: 640 });

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-cream via-white to-warm-gray overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-32 h-32 border border-burgundy rounded-full"></div>
        <div className="absolute top-40 right-20 w-24 h-24 border border-burgundy rounded-full"></div>
        <div className="absolute bottom-40 left-20 w-40 h-40 border border-burgundy rounded-full"></div>
        <div className="absolute bottom-20 right-10 w-28 h-28 border border-burgundy rounded-full"></div>
      </div>

      <div className="relative z-10 container mx-auto px-6 pt-32 pb-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[calc(100vh-8rem)]">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-8"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-burgundy/10 text-burgundy px-4 py-2 rounded-full text-sm font-medium"
            >
              <Star size={16} className="text-burgundy" />
              {language === "ar" ? "الأفضل في الكتب الإسلامية" : "Best Islamic Books Collection"}
            </motion.div>

            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight font-serif">
                {t.heroTitle}
              </h1>
              <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-lg">
                {language === "ar"
                  ? "اكتشف مجموعة واسعة من الكتب الإسلامية عالية الجودة التي تثري معرفتك وتقوي إيمانك"
                  : "Discover a wide collection of high-quality Islamic books that enrich your knowledge and strengthen your faith"}
              </p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link href="/shop">
                <Button className="bg-burgundy hover:bg-burgundy-dark text-white px-8 py-4 rounded-xl font-semibold text-lg elegant-shadow hover-lift transition-all duration-300 flex items-center gap-3">
                  <ShoppingCart size={20} />
                  {t.heroShopNow}
                  <ArrowRight size={16} />
                </Button>
              </Link>
              <Button
                variant="outline"
                className="border-2 border-burgundy text-burgundy hover:bg-burgundy hover:text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 flex items-center gap-3"
              >
                <BookOpen size={20} />
                {language === "ar" ? "تصفح الكتالوج" : "Browse Catalog"}
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="grid grid-cols-3 gap-6 pt-8"
            >
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-burgundy font-serif">500+</div>
                <div className="text-sm text-gray-600">{language === "ar" ? "كتاب" : "Books"}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-burgundy font-serif">1000+</div>
                <div className="text-sm text-gray-600">
                  {language === "ar" ? "عميل راضي" : "Happy Customers"}
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-burgundy font-serif">50+</div>
                <div className="text-sm text-gray-600">
                  {language === "ar" ? "دار نشر" : "Publishers"}
                </div>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="relative"
          >
            <div className="relative">
              <Card className="bg-white elegant-shadow-lg hover-lift transition-all duration-500 overflow-hidden">
                <CardContent className="p-0">
                  <div className="aspect-[4/5] relative overflow-hidden">
                    <img
                      src="/images/hero4.jpg"
                      alt="Islamic Books Collection"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                    <div className="absolute bottom-6 left-6 right-6 text-white">
                      <h3 className="text-xl font-bold mb-2 font-serif">
                        {language === "ar"
                          ? "مجموعة مختارة بعناية"
                          : "Carefully Curated Collection"}
                      </h3>
                      <p className="text-sm opacity-90">
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
                className="absolute -top-4 -right-4 bg-burgundy text-white p-4 rounded-2xl elegant-shadow-lg"
              >
                <BookOpen size={24} />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 1 }}
                className="absolute -bottom-4 -left-4 bg-white p-4 rounded-2xl elegant-shadow-lg"
              >
                <div className="flex items-center gap-2">
                  <Star size={16} className="text-yellow-500 fill-current" />
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
        <svg viewBox="0 0 1200 120" className="w-full h-20 fill-white">
          <path d="M0,60 C300,120 900,0 1200,60 L1200,120 L0,120 Z"></path>
        </svg>
      </div>
    </section>
  );
}
