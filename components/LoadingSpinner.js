"use client";

import { motion } from "framer-motion";
import { Loader2, BookOpen, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useStore } from "@/lib/store";
import translations from "@/lib/translations";

const LoadingSpinner = () => {
  const { language } = useStore();
  const t = translations[language];

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-burgundy/10 via-cream/50 to-warm-gray/30 backdrop-blur-sm z-50">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 border-2 border-burgundy rounded-full animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-24 h-24 border-2 border-burgundy-light rounded-full animate-pulse delay-300"></div>
        <div className="absolute top-1/2 right-1/3 w-16 h-16 border border-burgundy rotate-45 animate-pulse delay-700"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10"
      >
        <Card className="bg-white/90 backdrop-blur-md border-0 w-full max-w-md mx-4 elegant-shadow-lg rounded-3xl overflow-hidden">
          <CardContent className="flex flex-col items-center justify-center space-y-6 p-12">
            <div className="relative">
              <motion.div
                className="w-20 h-20 border-4 border-burgundy/20 rounded-full"
                animate={{ rotate: 360 }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />

              <motion.div
                className="absolute inset-2 w-16 h-16 border-4 border-t-burgundy border-r-burgundy-light border-b-transparent border-l-transparent rounded-full"
                animate={{ rotate: -360 }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 180, 360],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <BookOpen className="w-8 h-8 text-burgundy" />
                </motion.div>
              </div>
            </div>
            <div className="text-center space-y-3">
              <motion.h3
                className="text-2xl font-bold text-burgundy font-serif"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                {t.loading || "جاري التحميل"}
              </motion.h3>
              <div className="flex justify-center space-x-1 rtl:space-x-reverse">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-2 h-2 bg-burgundy rounded-full"
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.3, 1, 0.3],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      delay: i * 0.2,
                      ease: "easeInOut",
                    }}
                  />
                ))}
              </div>
            </div>
            <div className="absolute -top-4 -right-4">
              <motion.div
                animate={{
                  y: [-10, 10, -10],
                  rotate: [0, 180, 360],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <Sparkles className="w-6 h-6 text-burgundy-light opacity-60" />
              </motion.div>
            </div>

            <div className="absolute -bottom-4 -left-4">
              <motion.div
                animate={{
                  y: [10, -10, 10],
                  rotate: [360, 180, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <Sparkles className="w-4 h-4 text-burgundy opacity-40" />
              </motion.div>
            </div>
            <div className="w-full bg-burgundy/10 rounded-full h-2 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-burgundy rounded-full"
                animate={{
                  x: ["-100%", "100%"],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </div>
            <p className="text-sm text-warm-gray-600 text-center leading-relaxed">
              نحضر لك أفضل تجربة للكتب الإسلامية
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default LoadingSpinner;
