"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import TestimonialCard from "./TestimonialCard";

const Testimonials = () => {
  // dummy data for now
  const [testimonials, setTestimonials] = useState([
    {
      id: 1,
      text: "Everything about this is next level: the components, the registry, dynamic items. Really impressed!",
      author: "@shadcn",
      avatar: "https://i.pravatar.cc/40?img=1",
      rating: 5,
    },
    {
      id: 2,
      text: "Have you heard of React Bits? David Haz has lovingly put together a collection of animated &amp; fully customizable React components.",
      author: "@DIYDev",
      avatar: "https://i.pravatar.cc/40?img=2",
      rating: 5,
    },
    {
      id: 3,
      text: "React Bits: A stellar collection of React components to make your landing pages shine.",
      author: "@gregberge",
      avatar: "https://i.pravatar.cc/40?img=3",
      rating: 5,
    },
    {
      id: 4,
      text: "The coolest React library in React - sleek, super dev-friendly React UI library. Clean UI, easy to use, &amp; perfect for modern projects.",
      author: "@yskmd",
      avatar: "https://i.pravatar.cc/40?img=4",
      rating: 5,
    },
    {
      id: 5,
      text: "Covered https://reactbits.dev — a sleek &amp; super dev-friendly React UI library. Clean UI, easy to use, &amp; perfect for modern projects.",
      author: "@coffee",
      avatar: "https://i.pravatar.cc/40?img=5",
      rating: 5,
    },
    {
      id: 6,
      text: "Everything about this is next level: the components, the registry, dynamic items. Really impressed!",
      author: "@shadcn",
      avatar: "https://i.pravatar.cc/40?img=1",
      rating: 5,
    },
    {
      id: 7,
      text: "Have you heard of React Bits? David Haz has lovingly put together a collection of animated &amp; fully customizable React components.",
      author: "@DIYDev",
      avatar: "https://i.pravatar.cc/40?img=2",
      rating: 5,
    },
    {
      id: 8,
      text: "React Bits: A stellar collection of React components to make your landing pages shine.",
      author: "@gregberge",
      avatar: "https://i.pravatar.cc/40?img=3",
      rating: 5,
    },
    {
      id: 9,
      text: "The coolest React library in React - sleek, super dev-friendly React UI library. Clean UI, easy to use, &amp; perfect for modern projects.",
      author: "@yskmd",
      avatar: "https://i.pravatar.cc/40?img=4",
      rating: 5,
    },
    {
      id: 10,
      text: "Covered https://reactbits.dev — a sleek &amp; super dev-friendly React UI library. Clean UI, easy to use, &amp; perfect for modern projects.",
      author: "@coffee",
      avatar: "https://i.pravatar.cc/40?img=5",
      rating: 5,
    },
  ]);

  const [duration, setDuration] = useState(60);

  useEffect(() => {
    setDuration(window.innerWidth < 768 ? 15 : 60);
  }, []);

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
          {/* first row, right to left */}
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

          {/* second row, left to right */}
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

          {/* 3rdd row, right to left */}
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
