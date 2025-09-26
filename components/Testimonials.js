"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Image from "next/image";

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

  useEffect(() => {
    setTestimonials((prev) => [...prev]);
  }, []);

  return (
    <section className="py-16 bg-background-gold">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-foreground mb-12">
          What Our Customers Say
        </h2>
        <div className="space-y-12">
          {/* first row, right to left */}
          <div className="overflow-hidden h-60">
            <motion.div
              className="flex gap-6"
              animate={{ x: ["0%", "-100%"] }}
              transition={{
                duration: 30,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              {[...testimonials, ...testimonials].map((testimonial, index) => (
                <motion.div
                  key={`${testimonial.id}-row1-${index}`}
                  className="flex-shrink-0 w-80 max-w-xs"
                  whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
                >
                  <Card className="shadow-lg border-border h-full">
                    <CardHeader>
                      <div className="flex items-center mb-2">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star
                            key={i}
                            className="w-4 h-4 text-yellow-400 fill-current"
                          />
                        ))}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-foreground mb-4 italic leading-relaxed line-clamp-3">
                        &quot;{testimonial.text}&quot;
                      </p>
                      <div className="flex items-center min-h-[40px]">
                        <Image
                          src={testimonial.avatar}
                          alt={testimonial.author}
                          width={40}
                          height={40}
                          className="rounded-full mr-3"
                          onError={(e) => (e.target.style.display = "none")}
                        />
                        <p className="font-semibold text-foreground">
                          {testimonial.author}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* second row, left to right */}
          <div className="overflow-hidden h-60">
            <motion.div
              className="flex gap-6"
              animate={{ x: ["0%", "100%"] }}
              transition={{
                duration: 30,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              {[...testimonials, ...testimonials].map((testimonial, index) => (
                <motion.div
                  key={`${testimonial.id}-row2-${index}`}
                  className="flex-shrink-0 w-80 max-w-xs"
                  whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
                >
                  <Card className="shadow-lg border-border h-full">
                    <CardHeader>
                      <div className="flex items-center mb-2">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star
                            key={i}
                            className="w-4 h-4 text-yellow-400 fill-current"
                          />
                        ))}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-foreground mb-4 italic leading-relaxed line-clamp-3">
                        &quot;{testimonial.text}&quot;
                      </p>
                      <div className="flex items-center min-h-[40px]">
                        <Image
                          src={testimonial.avatar}
                          alt={testimonial.author}
                          width={40}
                          height={40}
                          className="rounded-full mr-3"
                          onError={(e) => (e.target.style.display = "none")}
                        />
                        <p className="font-semibold text-foreground">
                          {testimonial.author}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* 3rd row, right to left */}
          <div className="overflow-hidden h-48">
            <motion.div
              className="flex gap-6"
              animate={{ x: ["0%", "-100%"] }}
              transition={{
                duration: 30,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              {[...testimonials, ...testimonials].map((testimonial, index) => (
                <motion.div
                  key={`${testimonial.id}-row3-${index}`}
                  className="flex-shrink-0 w-80 max-w-xs"
                  whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
                >
                  <Card className="shadow-lg border-border h-full">
                    <CardHeader>
                      <div className="flex items-center mb-2">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star
                            key={i}
                            className="w-4 h-4 text-yellow-400 fill-current"
                          />
                        ))}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-foreground mb-4 italic leading-relaxed line-clamp-3">
                        &quot;{testimonial.text}&quot;
                      </p>
                      <div className="flex items-center min-h-[40px]">
                        <Image
                          src={testimonial.avatar}
                          alt={testimonial.author}
                          width={40}
                          height={40}
                          className="rounded-full mr-3"
                          onError={(e) => (e.target.style.display = "none")}
                        />
                        <p className="font-semibold text-foreground">
                          {testimonial.author}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
