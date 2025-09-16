"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { useStore } from "@/lib/store";
import translations from "@/lib/translations";

export default function Hero() {
  const { language } = useStore();
  const t = translations[language];

  return (
    <section
      className="relative h-[500px] bg-cover bg-center"
      style={{ backgroundImage: "url('/images/hero3.jpg')" }}
      aria-label={t.heroTitle}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-teal-800/50 via-transparent to-gold-300/50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="text-center px-4 sm:px-6 md:px-8"
        >
          <Card className="bg-cream-100/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <h1 className="text-5xl md:text-6xl mb-4 font-bold text-white drop-shadow-lg">
                {t.heroTitle}
              </h1>
              <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-white">
                {t.heroDescription}
              </p>
              <Link href="/shop">
                <Button
                  className="bg-emerald-700 text-cream-100 hover:bg-green-900 transition duration-300 flex items-center gap-2"
                  aria-label={t.heroShopNow}
                >
                  <ShoppingCart size={20} /> {t.heroShopNow}
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
