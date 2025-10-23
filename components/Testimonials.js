"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import TestimonialCard from "./TestimonialCard";
import { supabase } from "@/lib/supabase";
import useSWR from "swr";
import { useStore } from "@/lib/store";

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
  const { language } = useStore();
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
    <section className="py-20 bg-gradient-cream overflow-hidden">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-serif">
            {language === "ar" ? "ماذا يقول عملاؤنا" : "What Our Customers Say"}
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {language === "ar"
              ? "اكتشف تجارب عملائنا الراضين مع مجموعتنا المميزة من الكتب الإسلامية"
              : "Discover the experiences of our satisfied customers with our exceptional collection of Islamic books"}
          </p>
        </motion.div>

        <div className="space-y-8">
          {/* first row - right to left */}
          <div className="overflow-hidden">
            <motion.div
              className="flex gap-6"
              animate={{ x: ["0%", "-50%"] }}
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

          {/* second row - left to right */}
          <div className="overflow-hidden">
            <motion.div
              className="flex gap-6"
              animate={{ x: ["-50%", "0%"] }}
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
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
