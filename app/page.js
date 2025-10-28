"use client";

import { useSession } from "next-auth/react";
import Hero from "@/components/Hero";
import Testimonials from "@/components/Testimonials";
import TestimonialSubmission from "@/components/TestimonialSubmission";

export default function Home() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="loader" />
      </div>
    );
  }

  return (
    <div>
      <Hero />
      <Testimonials />
      {session ? (
        <TestimonialSubmission />
      ) : (
        <div className="text-center py-12 text-muted-foreground">
          <p>Please log in to submit a testimonial.</p>
        </div>
      )}
    </div>
  );
}
