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
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-r from-[var(--header-gradient-start)]/80 to-[var(--header-gradient-end)]/80 z-50">
      <Card className="bg-gradient-to-r from-[var(--header-gradient-start)] to-[var(--header-gradient-end)] text-primary-foreground w-full max-w-md p-6 shadow-lg">
        <CardContent className="flex flex-col items-center justify-center space-y-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            <Loader2 className="h-12 w-12 text-[var(--accent-start)]" />
          </motion.div>
          <p className="text-lg font-semibold text-center">{t.loading}</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoadingSpinner;
