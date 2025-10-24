"use client";

import { useStore } from "@/lib/store";
import { motion } from "framer-motion";
import { BookOpen, Mail, Phone, MapPin, Facebook, Twitter, Instagram } from "lucide-react";
import translations from "@/lib/translations";
import Link from "next/link";

export default function Footer() {
  const { language } = useStore();
  const t = translations[language];

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-burgundy-dark to-gray-900 text-white">
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                <BookOpen size={24} className="text-burgundy" />
              </div>
              <div>
                <h3 className="text-xl font-bold font-serif">{t.title}</h3>
                <p className="text-sm text-gray-300">
                  {language === "ar" ? "متجر الكتب الإسلامية" : "Islamic Books Store"}
                </p>
              </div>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              {language === "ar"
                ? "نحن نقدم أفضل مجموعة من الكتب الإسلامية عالية الجودة لإثراء معرفتك الدينية."
                : "We provide the finest collection of high-quality Islamic books to enrich your religious knowledge."}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="space-y-4"
          >
            <h4 className="text-lg font-semibold font-serif">
              {language === "ar" ? "روابط سريعة" : "Quick Links"}
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-300 hover:text-white transition-colors">
                  {t.home}
                </Link>
              </li>
              <li>
                <Link href="/shop" className="text-gray-300 hover:text-white transition-colors">
                  {t.shop}
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-300 hover:text-white transition-colors">
                  {language === "ar" ? "من نحن" : "About Us"}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-white transition-colors">
                  {language === "ar" ? "اتصل بنا" : "Contact"}
                </Link>
              </li>
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-4"
          >
            <h4 className="text-lg font-semibold font-serif">
              {language === "ar" ? "الفئات" : "Categories"}
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/shop?category=quran"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  {language === "ar" ? "قرآن" : "Quran"}
                </Link>
              </li>
              <li>
                <Link
                  href="/shop?category=hadith"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  {language === "ar" ? "حديث" : "Hadith"}
                </Link>
              </li>
              <li>
                <Link
                  href="/shop?category=fiqh"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  {language === "ar" ? "فقه" : "Fiqh"}
                </Link>
              </li>
              <li>
                <Link
                  href="/shop?category=biography"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  {language === "ar" ? "السيرة النبوية" : "Biography"}
                </Link>
              </li>
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="space-y-4"
          >
            <h4 className="text-lg font-semibold font-serif">
              {language === "ar" ? "تواصل معنا" : "Contact Us"}
            </h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Mail size={16} className="text-gray-400" />
                <a
                  href={`mailto:${t.footerEmail}`}
                  className="text-gray-300 hover:text-white transition-colors text-sm"
                >
                  {t.footerEmail}
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={16} className="text-gray-400" />
                <span className="text-gray-300 text-sm">{t.footerPhone}</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin size={16} className="text-gray-400" />
                <span className="text-gray-300 text-sm">
                  {language === "ar" ? "تونس" : "Tunisia"}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4 pt-4">
              <a
                href="#"
                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                <Facebook size={16} />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                <Twitter size={16} />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                <Instagram size={16} />
              </a>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4"
        >
          <p className="text-gray-300 text-sm text-center md:text-left">{t.footerCopyright}</p>
          <div className="flex items-center gap-6 text-sm text-gray-300">
            <Link href="/privacy" className="hover:text-white transition-colors">
              {language === "ar" ? "سياسة الخصوصية" : "Privacy Policy"}
            </Link>
            <Link href="/terms" className="hover:text-white transition-colors">
              {language === "ar" ? "الشروط والأحكام" : "Terms & Conditions"}
            </Link>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
