"use client";

import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useStore } from "@/lib/store";
import translations from "@/lib/translations";

const LoadingSpinner = () => {
  const { language } = useStore();
  const t = translations[language];

  return (
    <Card className="border-t-4 border-gold-300 bg-gray-900 text-cream-100 w-full max-w-md mx-auto mt-12 p-6">
      <CardContent className="flex flex-col items-center justify-center space-y-4">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <Loader2 className="h-12 w-12 text-emerald-700" />
        </motion.div>
        <p className="text-lg font-semibold text-center">{t.loading}</p>
      </CardContent>
    </Card>
  );
};

export default LoadingSpinner;
