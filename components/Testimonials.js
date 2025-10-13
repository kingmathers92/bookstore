"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import TestimonialCard from "./TestimonialCard";
import { supabase } from "@/lib/supabase";
import useSWR from "swr";

const fetchTestimonials = async () => {
  const { data, error } = await supabase
    .from("testimonials")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(10);
  if (error) throw new Error(`Error fetching testimonials: ${error.message}`);
  return data || [];
};

const Testimonials = () => {
  const { data: testimonials, error } = useSWR("testimonials", fetchTestimonials, {
    refreshInterval: 300000,
  });
  const [duration, setDuration] = useState(60);

  useEffect(() => {
    setDuration(window.innerWidth < 768 ? 15 : 60);
  }, []);

  if (error) return <div>Error loading testimonials: {error.message}</div>;
  if (!testimonials) return <div>Loading testimonials...</div>;

  return (
    <section
      className="py-8 bg-background-gold sm:py-12"
      aria-label="Customer Testimonials Section"
    >
      <div className="container mx-auto px-4 sm:px-6">
        <h2 className="text-2xl font-bold text-center text-foreground mb-6 sm:text-3xl sm:mb-12">
          What Our Customers Say
        </h2>
        <div className="space-y-8 sm:space-y-12">
          {/* First row, right to left */}
          <div className="overflow-hidden h-40 sm:h-60">
            <motion.div
              className="flex gap-4 sm:gap-6"
              animate={{ x: ["0%", "-100%"] }}
              transition={{
                duration: duration,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              {[...testimonials, ...testimonials].map((testimonial, index) => (
                <TestimonialCard
                  key={`${testimonial.id}-row1-${index}`}
                  testimonial={testimonial}
                  index={index}
                />
              ))}
            </motion.div>
          </div>

          {/* Second row, left to right */}
          <div className="overflow-hidden h-40 sm:h-60">
            <motion.div
              className="flex gap-4 sm:gap-6"
              animate={{ x: ["0%", "100%"] }}
              transition={{
                duration: duration,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              {[...testimonials, ...testimonials].map((testimonial, index) => (
                <TestimonialCard
                  key={`${testimonial.id}-row2-${index}`}
                  testimonial={testimonial}
                  index={index}
                />
              ))}
            </motion.div>
          </div>

          {/* Third row, right to left */}
          <div className="overflow-hidden h-40 sm:h-60">
            <motion.div
              className="flex gap-4 sm:gap-6"
              animate={{ x: ["0%", "-100%"] }}
              transition={{
                duration: duration,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              {[...testimonials, ...testimonials].map((testimonial, index) => (
                <TestimonialCard
                  key={`${testimonial.id}-row3-${index}`}
                  testimonial={testimonial}
                  index={index}
                />
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
