"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Star, Send } from "lucide-react";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { motion } from "framer-motion";
import translations from "@/lib/translations";

export default function TestimonialSubmission() {
  const { user, language, submitTestimonial } = useStore();
  const t = translations[language];
  const [testimonial, setTestimonial] = useState("");
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!testimonial.trim() || rating === 0) {
      alert(
        language === "ar"
          ? "يرجى كتابة الشهادة واختيار التقييم!"
          : "Please write a testimonial and select a rating!",
      );
      return;
    }

    if (testimonial.length > 500) {
      alert(
        language === "ar"
          ? "الشهادة طويلة جدًا! يرجى الاحتفاظ بها تحت 500 حرف."
          : "Testimonial too long! Please keep it under 500 characters.",
      );
      return;
    }

    setIsSubmitting(true);
    const result = await submitTestimonial(testimonial, rating);

    if (result) {
      alert(language === "ar" ? "تم إرسال الشهادة بنجاح!" : "Testimonial submitted successfully!");
      setTestimonial("");
      setRating(0);
    } else {
      alert(
        language === "ar"
          ? "فشل إرسال الشهادة. حاول مجددًا."
          : "Failed to submit testimonial. Please try again.",
      );
    }
    setIsSubmitting(false);
  };

  return (
    <section className="py-20 bg-white" dir={language === "ar" ? "rtl" : "ltr"}>
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto"
        >
          <Card className="bg-white elegant-shadow-lg hover:elegant-shadow-xl transition-all duration-300">
            <CardHeader className="text-center space-y-4 pb-8">
              <div className="w-16 h-16 bg-burgundy rounded-full flex items-center justify-center mx-auto">
                <Star size={24} className="text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2 font-serif">
                  {t.testimonialSubmitTitle || "Share Your Experience"}
                </h2>
                <p className="text-gray-600">
                  {t.testimonialDescription ||
                    "We'd love to hear about your experience with our books!"}
                </p>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-3">
                  <Label className="text-lg font-semibold text-gray-900">
                    {t.testimonialRating || "Your Rating"}
                  </Label>
                  <div className="flex items-center justify-center gap-2 py-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <motion.button
                        key={star}
                        type="button"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className={`p-2 rounded-full transition-colors ${
                          (hoveredRating || rating) >= star ? "text-yellow-400" : "text-gray-300"
                        }`}
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoveredRating(star)}
                        onMouseLeave={() => setHoveredRating(0)}
                      >
                        <Star
                          size={32}
                          className={`${(hoveredRating || rating) >= star ? "fill-current" : ""}`}
                        />
                      </motion.button>
                    ))}
                  </div>
                  <p className="text-center text-sm text-gray-500">
                    {rating > 0 && (
                      <span>
                        {rating === 1 && (language === "ar" ? "ضعيف" : "Poor")}
                        {rating === 2 && (language === "ar" ? "مقبول" : "Fair")}
                        {rating === 3 && (language === "ar" ? "جيد" : "Good")}
                        {rating === 4 && (language === "ar" ? "ممتاز" : "Very Good")}
                        {rating === 5 && (language === "ar" ? "رائع" : "Excellent")}
                      </span>
                    )}
                  </p>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="testimonial" className="text-lg font-semibold text-gray-900">
                    {t.testimonialText || "Your Testimonial"}
                  </Label>
                  <Textarea
                    id="testimonial"
                    value={testimonial}
                    onChange={(e) => setTestimonial(e.target.value)}
                    placeholder={
                      t.testimonialPlaceholder || "Tell us about your experience with our books..."
                    }
                    className="min-h-32 resize-none border-2 border-gray-200 focus:border-burgundy rounded-xl p-4 text-base"
                    maxLength={500}
                  />
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-500">
                      {testimonial.length}/500 {language === "ar" ? "حرف" : "characters"}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <div
                        className={`w-2 h-2 rounded-full ${testimonial.length > 400 ? "bg-red-400" : testimonial.length > 250 ? "bg-yellow-400" : "bg-green-400"}`}
                      ></div>
                      {testimonial.length > 400
                        ? language === "ar"
                          ? "قريب من الحد الأقصى"
                          : "Near limit"
                        : testimonial.length > 250
                          ? language === "ar"
                            ? "جيد"
                            : "Good length"
                          : language === "ar"
                            ? "يمكن إضافة المزيد"
                            : "Can add more"}
                    </div>
                  </div>
                </div>
              </form>
            </CardContent>

            <CardFooter className="pt-6">
              <Button
                type="submit"
                onClick={handleSubmit}
                disabled={!testimonial.trim() || rating === 0 || isSubmitting}
                className="w-full bg-burgundy hover:bg-burgundy-dark text-white py-4 rounded-xl font-semibold text-lg elegant-shadow hover-lift transition-all duration-300 flex items-center justify-center gap-3"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    {language === "ar" ? "جاري الإرسال..." : "Submitting..."}
                  </>
                ) : (
                  <>
                    <Send size={20} />
                    {t.testimonialSubmit || "Submit Testimonial"}
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
