"use client";

import { useStore } from "@/lib/store";
import translations from "@/lib/translations";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import Socials from "@/components/Socials";
import Breadcrumbs from "@/components/Breadcrumbs";

export default function About() {
  const { language } = useStore();
  const t = translations[language];

  return (
    <div
      className="min-h-screen bg-gradient-to-b from-burgundy-dark via-[#2c1d1a] to-[#3a2622] py-16 px-6 mt-8 text-white"
      dir={language === "ar" ? "rtl" : "ltr"}
    >
      <Breadcrumbs />
      <div className="container mx-auto max-w-5xl">
        <motion.h1
          className="text-4xl md:text-5xl font-bold text-center mb-10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {t.aboutUs}
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Card className="bg-white/10 backdrop-blur-lg border-white/10 rounded-2xl shadow-xl p-6 md:p-10">
            <CardContent className="space-y-6 text-gray-100 text-lg leading-relaxed text-center">
              <p>{t.aboutDescription}</p>
              <div className="space-y-2">
                <p>• {t.shipping}</p>
                <p>• {t.offers}</p>
                <p>• {t.joinUs}</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <Socials />
      </div>
    </div>
  );
}
