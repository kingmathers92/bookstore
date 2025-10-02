"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Image from "next/image";

const TestimonialCard = ({ testimonial, index }) => {
  return (
    <motion.div
      className="flex-shrink-0 w-48 max-w-full sm:w-80 sm:max-w-xs"
      whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
    >
      <Card className="shadow-lg border-border h-full">
        <CardHeader>
          <div className="flex items-center mb-1 sm:mb-2">
            {[...Array(testimonial.rating)].map((_, i) => (
              <Star
                key={i}
                className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 fill-current"
              />
            ))}
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm sm:text-base text-foreground mb-2 sm:mb-4 italic leading-relaxed line-clamp-2 sm:line-clamp-3">
            &quot;{testimonial.text}&quot;
          </p>
          <div className="flex items-center min-h-[30px] sm:min-h-[40px]">
            <Image
              src={testimonial.avatar || "/placeholder.jpg"}
              alt={testimonial.author}
              width={30}
              height={30}
              className="rounded-full mr-2 sm:mr-3"
              priority={index === 0}
              onError={(e) => (e.target.style.display = "none")}
            />
            <p className="text-xs sm:text-sm font-semibold text-foreground">
              {testimonial.author}
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default TestimonialCard;
