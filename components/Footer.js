"use client";

import { useStore } from "@/lib/store";
import translations from "@/lib/translations";

export default function Footer() {
  const { language } = useStore();
  const t = translations[language];

  return (
    <footer className="bg-green-900 text-cream-100 py-6">
      <div className="container mx-auto text-center">
        <p className="mb-2 text-lg">{t.footerCopyright}</p>
        <p className="text-sm">
          {t.footerContact}
          <a href={`mailto:${t.footerEmail}`} className="hover:text-gold-300">
            {t.footerEmail}
          </a>{" "}
          | {t.footerPhone}
        </p>
      </div>
    </footer>
  );
}
