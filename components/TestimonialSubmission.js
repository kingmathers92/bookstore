"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Star } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import translations from "@/lib/translations";

export default function TestimonialSubmission() {
  const { user, language, submitTestimonial } = useStore();
  const t = translations[language];
  const [testimonial, setTestimonial] = useState("");
  const [rating, setRating] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!testimonial.trim() || rating === 0) {
      toast.error(
        language === "ar"
          ? "يرجى كتابة الشهادة واختيار التقييم!"
          : "Please write a testimonial and select a rating!",
      );
      return;
    }
    if (testimonial.length > 500) {
      toast.error(
        language === "ar"
          ? "الشهادة طويلة جدًا! يرجى الاحتفاظ بها تحت 500 حرف."
          : "Testimonial too long! Please keep it under 500 characters.",
      );
      return;
    }
    const result = await submitTestimonial(testimonial, rating);
    if (result) {
      setTestimonial("");
      setRating(0);
    }
  };

  return (
    <div className="container mx-auto py-12 px-4" dir={language === "ar" ? "rtl" : "ltr"}>
      <h2 className="text-2xl font-bold text-center mb-6 text-foreground sm:text-3xl">
        {t.testimonialSubmitTitle || "Submit Your Testimonial"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
        <div>
          <Label htmlFor="testimonial" className="text-sm sm:text-base">
            {t.testimonialText || "Your Testimonial"}
          </Label>
          <Input
            id="testimonial"
            value={testimonial}
            onChange={(e) => setTestimonial(e.target.value)}
            placeholder={t.testimonialPlaceholder || "Share your experience..."}
            className="w-full mt-1"
            maxLength={500}
          />
        </div>
        <div>
          <Label htmlFor="rating" className="text-sm sm:text-base">
            {t.testimonialRating || "Rating"}
          </Label>
          <div className="flex gap-1 mt-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`cursor-pointer ${rating >= star ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                size={24}
                onClick={() => setRating(star)}
              />
            ))}
          </div>
        </div>
        <Button type="submit" className="w-full bg-primary text-white hover:bg-primary/90">
          {t.testimonialSubmit || "Submit"}
        </Button>
      </form>
    </div>
  );
}
