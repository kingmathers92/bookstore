"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

const TestimonialCard = ({ testimonial, index }) => {
  return (
    <motion.div
      className="flex-shrink-0 w-80 max-w-sm"
      whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
    >
      <Card className="bg-white elegant-shadow hover:elegant-shadow-lg transition-all duration-300 h-full">
        <CardContent className="p-6 space-y-4">
          <div className="flex justify-between items-start">
            <Quote size={24} className="text-burgundy/30" />
            <div className="flex items-center gap-1">
              {[...Array(testimonial.rating)].map((_, i) => (
                <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
              ))}
            </div>
          </div>
          <p className="text-gray-700 leading-relaxed line-clamp-4 italic">"{testimonial.text}"</p>

          <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
            <div className="relative">
              <Image
                src={testimonial.avatar || "/placeholder.jpg"}
                alt={testimonial.author}
                width={40}
                height={40}
                className="rounded-full object-cover"
                priority={index === 0}
                onError={(e) => (e.target.style.display = "none")}
              />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
            </div>
            <div>
              <p className="font-semibold text-gray-900">{testimonial.author}</p>
              <p className="text-sm text-gray-500">Verified Customer</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default TestimonialCard;
