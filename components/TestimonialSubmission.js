"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Star } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
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
      toast.success(
        language === "ar" ? "تم إرسال الشهادة بنجاح!" : "Testimonial submitted successfully!",
      );
      setTestimonial("");
      setRating(0);
    } else {
      toast.error(
        language === "ar"
          ? "فشل إرسال الشهادة. حاول مجددًا."
          : "Failed to submit testimonial. Please try again.",
      );
    }
  };

  return (
    <div className="container mx-auto py-12 px-4" dir={language === "ar" ? "rtl" : "ltr"}>
      <Card className="max-w-2xl mx-auto bg-white shadow-lg rounded-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300">
        <CardHeader className="text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-primary mb-2">
            {t.testimonialSubmitTitle || "Submit Your Testimonial"}
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base">
            {t.testimonialDescription || "Share your experience with us!"}
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label
                htmlFor="testimonial"
                className="text-sm sm:text-base font-medium text-foreground"
              >
                {t.testimonialText || "Your Testimonial"}
              </Label>
              <Input
                id="testimonial"
                value={testimonial}
                onChange={(e) => setTestimonial(e.target.value)}
                placeholder={t.testimonialPlaceholder || "Share your experience..."}
                className="w-full mt-2 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                maxLength={500}
              />
              <p className="text-xs text-muted-foreground mt-1">{testimonial.length}/500</p>
            </div>
            <div>
              <Label htmlFor="rating" className="text-sm sm:text-base font-medium text-foreground">
                {t.testimonialRating || "Rating"}
              </Label>
              <div className="flex gap-2 mt-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`cursor-pointer w-6 h-6 sm:w-7 sm:h-7 ${
                      rating >= star ? "text-yellow-400 fill-current" : "text-gray-300"
                    } transition-colors`}
                    onClick={() => setRating(star)}
                  />
                ))}
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button
            type="submit"
            onClick={handleSubmit}
            className="w-full sm:w-auto px-6 py-3 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors hover:cursor-pointer"
          >
            {t.testimonialSubmit || "Submit"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
