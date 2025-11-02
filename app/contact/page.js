"use client";

import { motion } from "framer-motion";
import { useStore } from "@/lib/store";
import translations from "@/lib/translations";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Phone, MapPin } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import Socials from "@/components/Socials";

export default function Contact() {
  const { language } = useStore();
  const t = translations[language];

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
        <Socials />
      </div>
    </div>
  );
}
