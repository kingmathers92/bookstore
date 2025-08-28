"use client";

import { motion } from "framer-motion";

export default function BookCard({ title, price, image }) {
  return (
    <motion.div
      className="bg-white rounded-xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl border-t-4 border-[var(--gold-300)]"
      whileHover={{ scale: 1.05, rotate: 0.5 }}
      transition={{ duration: 0.4 }}
    >
      <img
        src={image}
        alt={title}
        className="w-full h-56 object-cover rounded-t-xl"
      />
      <div className="p-4">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
        <p className="text-gray-600 mb-4">{price} ر.س</p>
        <button className="bg-[var(--emerald-700)] text-[var(--cream-100)] px-4 py-2 rounded hover:bg-[var(--green-900)] w-full">
          أضف إلى السلة
        </button>
      </div>
    </motion.div>
  );
}
