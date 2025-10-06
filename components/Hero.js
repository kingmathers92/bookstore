"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { useStore } from "@/lib/store";
import translations from "@/lib/translations";
import { useMediaQuery } from "react-responsive";

export default function Hero() {
  const { language } = useStore();
  const t = translations[language];

  const isSmall = useMediaQuery({ maxWidth: 640 });
  const isMedium = useMediaQuery({ minWidth: 641, maxWidth: 1024 });
  const iconSize = isSmall ? 16 : isMedium ? 18 : 20;

  return (
    <section
      className="relative min-h-screen sm:min-h-[400px] md:min-h-[450px] lg:min-h-[500px] lg:max-h-[600px] bg-cover bg-center"
      style={{ backgroundImage: "url('/images/hero3.jpg')" }}
      aria-label={t.heroTitle}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-teal-800/50 via-transparent to-gold-300/50 flex items-center justify-center pt-20 sm:pt-16 md:pt-20 lg:pt-24">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="text-center px-4 sm:px-6 md:px-8 lg:px-12 w-full max-w-4xl"
        >
          <Card className="bg-cream-100/80 backdrop-blur-sm">
            <CardContent className="p-4 sm:p-6 md:p-8">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl mb-4 sm:mb-6 md:mb-8 font-bold text-white drop-shadow-lg leading-tight">
                {t.heroTitle}
              </h1>
              <p className="text-base sm:text-lg md:text-xl lg:text-xl mb-4 sm:mb-6 md:mb-8 max-w-2xl mx-auto text-white leading-relaxed">
                {t.heroDescription}
              </p>
              <Link href="/shop">
                <Button
                  className="bg-primary text-primary-foreground hover:bg-accent transition duration-300 flex items-center gap-2 px-4 py-2 sm:px-6 sm:py-3 md:px-8 md:py-4 hover:cursor-pointer text-base sm:text-lg md:text-xl"
                  aria-label={t.heroShopNow}
                >
                  <ShoppingCart size={iconSize} /> {t.heroShopNow}
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
