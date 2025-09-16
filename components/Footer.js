"use client";

import { useStore } from "@/lib/store";
import { motion } from "framer-motion"; // For subtle animation
import translations from "@/lib/translations";

export default function Footer() {
  const { language } = useStore();
  const t = translations[language];

  return (
    <footer
      className="bg-gradient-to-r from-[var(--header-gradient-start)] to-[var(--header-gradient-end)] border-t border-primary/20 shadow-lg"
      style={{
        background:
          "linear-gradient(to right, var(--header-gradient-start), var(--header-gradient-end))",
      }}
    >
      <div className="container mx-auto py-6 px-4 text-center">
        <motion.p
          className="mb-4 text-lg text-primary-foreground"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {t.footerCopyright}
        </motion.p>
        <motion.p
          className="text-sm text-primary-foreground"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {t.footerContact}
          <a
            href={`mailto:${t.footerEmail}`}
            className="hover:text-accent transition-colors ml-1"
          >
            {t.footerEmail}
          </a>{" "}
          | {t.footerPhone}
        </motion.p>
      </div>
    </footer>
  );
}
