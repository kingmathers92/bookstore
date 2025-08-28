"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section
      className="relative h-[500px] bg-cover bg-center arabesque-bg"
      style={{ backgroundImage: "url('/images/hero.png')" }}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-[var(--teal-800)]/50 via-transparent to-[var(--gold-300)]/50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="text-center px-4"
        >
          <h1 className="text-5xl md:text-6xl font-bold text-[var(--gold-300)] drop-shadow-lg">
            مرحبًا بكم في ثمرات الأوراق
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-[var(--cream-100)]">
            اكتشفوا مجموعتنا الواسعة من الكتب الإسلامية التي تغذي العقل والروح
          </p>
          <Link
            href="/shop"
            className="bg-[var(--emerald-700)] text-[var(--cream-100)] px-6 py-3 rounded-lg hover:bg-[var(--green-900)] transition duration-300"
          >
            تسوق الآن
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
