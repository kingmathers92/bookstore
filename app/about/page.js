"use client";

import { useStore } from "@/lib/store";
import translations from "@/lib/translations";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Facebook, Instagram } from "lucide-react";
import { TbBrandTiktok } from "react-icons/tb";

export default function About() {
  const { language } = useStore();
  const t = translations[language];

  const socials = [
    {
      icon: <Facebook size={18} />,
      href: "https://www.facebook.com/ThamaratAlAwrak",
      label: "Facebook",
    },
    {
      icon: <TbBrandTiktok size={18} />,
      href: "https://www.tiktok.com/@thamarat_al_awrak?_r=1&_t=ZM-9108FnO80Tb",
      label: "TikTok",
    },
    {
      icon: <Instagram size={18} />,
      href: "https://www.instagram.com/mayyaharrabi/?igsh=emdkNHNpd3lqMWQw",
      label: "Instagram",
    },
  ];

  return (
    <div
      className="min-h-screen bg-gradient-to-b from-burgundy-dark via-[#2c1d1a] to-[#3a2622] py-16 px-6 mt-8 text-white"
      dir={language === "ar" ? "rtl" : "ltr"}
    >
      <div className="container mx-auto max-w-5xl">
        <motion.h1
          className="text-4xl md:text-5xl font-bold text-center font-serif mb-10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {language === "ar" ? "من نحن" : "About Us"}
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Card className="bg-white/10 backdrop-blur-lg border-white/10 rounded-2xl shadow-xl p-6 md:p-10">
            <CardHeader>
              <CardTitle className="text-2xl font-serif font-bold text-center mb-6 text-white">
                {language === "ar" ? "مؤسسة ثمرات الأوراق" : "Thamarat Al-Awraq Foundation"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 text-gray-100 text-lg leading-relaxed">
              <p className="text-center">
                {language === "ar"
                  ? "مؤسسة متخصصة في توفير الكتب الإسلامية الأصلية لطلاب العلم والباحثين والقراء. نهدف إلى نشر العلم الشرعي من مصادره الموثوقة وتقديمه لكل من يسعى إلى الفهم الصحيح لدين الإسلام."
                  : "A specialized institution dedicated to providing authentic Islamic books for students of knowledge, researchers, and readers. Our goal is to spread reliable Islamic knowledge and make it accessible to everyone seeking true understanding."}
              </p>

              <p className="text-center">
                {language === "ar"
                  ? "نقدّم أوسع تشكيلة من الكتب الإسلامية التي تزكّي النفس وتنير القلب، من كتب العلماء الكبار إلى الإصدارات الحديثة. نعمل على إيصال الكتاب إلى يد القارئ أينما كان في تونس عبر خدمة شحن موثوقة وبأسعار مميزة."
                  : "We offer a wide range of Islamic books that purify the soul and enlighten the heart — from classical works by great scholars to contemporary releases. Our mission is to deliver knowledge to every reader across Tunisia with reliable shipping and competitive prices."}
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-16 text-center"
        >
          <h2 className="text-2xl font-serif font-semibold mb-4">
            {language === "ar" ? "تابعنا على وسائل التواصل" : "Follow Us"}
          </h2>
          <div className="flex justify-center gap-6">
            {socials.map((social, i) => (
              <a
                key={i}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                className="w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
              >
                {social.icon}
              </a>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
