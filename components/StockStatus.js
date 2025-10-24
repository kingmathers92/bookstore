"use client";

import { motion } from "framer-motion";
import { CheckCircle, XCircle } from "lucide-react";

const StockStatus = ({ inStock, language }) => {
  if (inStock === undefined) return null;

  const getStatusConfig = () => {
    if (inStock) {
      return {
        text: language === "ar" ? "متوفر" : "In Stock",
        icon: CheckCircle,
        bgClass: "bg-gradient-to-r from-emerald-500 to-green-600",
        textClass: "text-white",
        borderClass: "border-emerald-200",
        shadowClass: "shadow-emerald-200/50",
      };
    } else {
      return {
        text: language === "ar" ? "غير متوفر" : "Out of Stock",
        icon: XCircle,
        bgClass: "bg-gradient-to-r from-gray-400 to-gray-500",
        textClass: "text-white",
        borderClass: "border-gray-200",
        shadowClass: "shadow-gray-200/50",
      };
    }
  };

  const config = getStatusConfig();
  const IconComponent = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="inline-flex items-center"
    >
      <div
        className={`
          inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold
          ${config.bgClass} ${config.textClass}
          shadow-lg ${config.shadowClass}
          transform transition-all duration-200 hover:scale-105
        `}
      >
        <IconComponent className="w-4 h-4" />
        <span>{config.text}</span>

        {inStock && (
          <motion.div
            className="w-2 h-2 bg-white rounded-full"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [1, 0.7, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        )}
      </div>
    </motion.div>
  );
};

export default StockStatus;
