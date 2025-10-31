"use client";

import { useStore } from "@/lib/store";
import translations from "@/lib/translations";
import { motion } from "framer-motion";
import { Facebook, Instagram } from "lucide-react";
import { TbBrandTiktok } from "react-icons/tb";

export default function Socials() {
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
    <div>
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
  );
}
