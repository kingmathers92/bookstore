"use client";

import { motion } from "framer-motion";
import { useStore } from "@/lib/store";
import translations from "@/lib/translations";
import { Card, CardContent } from "@/components/ui/card";
import { Facebook, Instagram, Mail, Phone, MapPin } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { TbBrandTiktok } from "react-icons/tb";

export default function Contact() {
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
          className="text-4xl md:text-5xl font-bold text-center mb-10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {t.contactUs}
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Card className="bg-white/10 backdrop-blur-lg border-white/10 rounded-2xl shadow-xl p-6 md:p-10">
            <CardContent className="space-y-6 text-gray-100 text-lg leading-relaxed text-center">
              {" "}
              <div className="flex flex-col md:flex-row items-center justify-center gap-3">
                {" "}
                <Mail size={22} className="text-white" /> <p>info@thamaratalawrak.com</p>{" "}
              </div>{" "}
              <div className="flex flex-col md:flex-row items-center justify-center gap-3">
                {" "}
                <Phone size={22} className="text-white" />{" "}
                <span className="text-gray-300 text-sm">23344488</span>{" "}
              </div>{" "}
              <div className="flex flex-col md:flex-row items-center justify-center gap-3">
                {" "}
                <FaWhatsapp size={22} className="text-white" />{" "}
                <a
                  href="https://wa.me/52998711"
                  className="text-gray-300 hover:text-white transition-colors text-sm"
                >
                  {" "}
                  52998711{" "}
                </a>{" "}
              </div>{" "}
              <div className="flex flex-col md:flex-row items-center justify-center gap-3">
                {" "}
                <MapPin size={22} className="text-white" />{" "}
                <p>{language === "ar" ? "تونس" : "Tunisia"}</p>{" "}
              </div>{" "}
            </CardContent>
          </Card>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-16 text-center"
        >
          <h2 className="text-2xl font-semibold mb-4">{t.followUs || "Follow Us"}</h2>
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
