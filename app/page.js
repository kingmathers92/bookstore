"use client";

import Hero from "@/components/Hero";
import BookOfTheDay from "@/components/BookOfTheDay";
import Testimonials from "@/components/Testimonials";
import TestimonialSubmission from "@/components/TestimonialSubmission";

export default function Home() {
  return (
    <div>
      <Hero />
      <BookOfTheDay />
      <Testimonials />
      <TestimonialSubmission />
    </div>
  );
}
