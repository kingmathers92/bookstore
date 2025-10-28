"use client";

import { motion } from "framer-motion";
import { Star, Quote, User } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const TestimonialCard = ({ testimonial, index }) => {
  const authorName = testimonial.name || testimonial.author || "زبون مجهول";

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
              {[...Array(testimonial.rating || 0)].map((_, i) => (
                <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
              ))}
            </div>
          </div>

          <p className="text-gray-700 leading-relaxed line-clamp-4 italic">
            "{testimonial.text || "لا يوجد نص"}"
          </p>

          <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100">
              <User className="text-gray-500 w-5 h-5" />
            </div>
            <div>
              <p className="font-semibold text-gray-900">{authorName}</p>
              <p className="text-sm text-gray-500">{testimonial.user_id ? "عميل موثق" : "زائر"}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default TestimonialCard;
